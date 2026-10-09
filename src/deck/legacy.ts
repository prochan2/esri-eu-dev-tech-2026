/**
 * The before/after project file pair (gis-be, anonymised):
 *   Wgis.Soe.ModuleB.csproj at 94b163d8 (2025-06-13) — 137 lines
 *   the same project at HEAD                            — 11 lines
 * Every legacy line is classified, so the "wall" gets coloured stripes and the
 * camera can zoom onto each category.
 */
import legacyRaw from './data/legacy-csproj.xml?raw';
import modernRaw from './data/modern-csproj.xml?raw';

export const legacyCsproj = legacyRaw.replace(/\r\n/g, '\n');
export const modernCsproj = modernRaw.replace(/\r\n/g, '\n');
export const legacyLines = legacyCsproj.split('\n');
export const modernLineCount = modernCsproj.split('\n').length;

export type Cat = 'cfg' | 'id' | 'refs' | 'esri' | 'compile' | 'nuget';

export const cats: { id: Cat; name: string; what: string }[] = [
  { id: 'cfg', name: 'Build settings', what: 'Debug/Release, output paths, framework — copied into every project' },
  { id: 'id', name: 'GUIDs & signing', what: 'project GUIDs, references by GUID, strong-name key' },
  { id: 'refs', name: 'DLL references', what: 'HintPaths into lib\\ and other projects’ bin\\, framework assemblies' },
  { id: 'esri', name: 'ESRI references', what: 'COM interop assemblies, pinned to 10.8' },
  { id: 'compile', name: 'Hand-listed files', what: 'every .cs file, one line each' },
  { id: 'nuget', name: 'NuGet plumbing', what: 'imports from ..\\packages and a guard target' },
];

/** Category per line (index 0-based), or null for structural lines. */
export const lineCat: (Cat | null)[] = (() => {
  const out: (Cat | null)[] = [];
  let block: Cat | null = null; // inside a <Reference> or the NuGet guard target
  let inProps = false;
  for (const raw of legacyLines) {
    const t = raw.trim();
    let c: Cat | null = null;
    if (block) {
      c = block;
      if (t === '</Reference>' || t === '</Target>') block = null;
    } else if (/^<Reference Include="ESRI/.test(t)) {
      c = 'esri';
      if (!t.endsWith('/>')) block = 'esri';
    } else if (/^<Reference Include=/.test(t)) {
      c = 'refs';
      if (!t.endsWith('/>')) block = 'refs';
    } else if (/EnsureNuGetPackageBuildImports/.test(t)) {
      c = 'nuget';
      block = 'nuget';
    } else if (/packages\\|NuGetPackageImportStamp|packages\.config/.test(t)) c = 'nuget';
    else if (/^<Compile Include/.test(t)) c = 'compile';
    else if (/ProjectGuid|SignAssembly|AssemblyOriginatorKeyFile|\.snk|^<Project>\{|^<Name>/.test(t)) c = 'id';
    else if (/^<PropertyGroup/.test(t)) {
      inProps = true;
      c = 'cfg';
    } else if (/^<\/PropertyGroup>/.test(t)) {
      inProps = false;
      c = 'cfg';
    } else if (inProps || /ToolsVersion|Microsoft\.Common\.props|Microsoft\.CSharp\.targets/.test(t)) c = 'cfg';
    out.push(c);
  }
  // a <PropertyGroup> that only wraps signing belongs to "GUIDs & signing"
  for (let i = 0; i < out.length; i++) {
    if (legacyLines[i].trim() === '<PropertyGroup>' && out[i + 1] === 'id' && legacyLines[i + 2]?.trim() === '</PropertyGroup>') {
      out[i] = out[i + 2] = 'id';
    }
  }
  return out;
})();

export const catCount = (c: Cat) => lineCat.filter((x) => x === c).length;

/** "3,5-9=c-cfg;…" marks for highlight.ts */
export const legacyMarks = cats
  .map(({ id }) => {
    const nums = lineCat.flatMap((c, i) => (c === id ? [i + 1] : []));
    return nums.length ? `${nums.join(',')}=c-${id}` : '';
  })
  .filter(Boolean)
  .join(';');

/** Densest block of a category (1-based, inclusive), allowing small gaps. */
export function catRange(c: Cat): [number, number] {
  let best: [number, number] = [1, 1];
  let bestN = 0;
  for (let i = 0; i < lineCat.length; i++) {
    if (lineCat[i] !== c) continue;
    let j = i;
    let n = 0;
    let gap = 0;
    for (let k = i; k < lineCat.length; k++) {
      if (lineCat[k] === c) {
        n++;
        j = k;
        gap = 0;
      } else if (++gap > 3) break;
    }
    if (n > bestN) {
      bestN = n;
      best = [i + 1, j + 1];
    }
  }
  return best;
}
