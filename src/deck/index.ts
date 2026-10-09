import '../styles/canvas.css';
import '../styles/motion.css';
import type { DeckDef, StepDef } from '../engine/types';
import { buildStation, soeStation } from './build';
import { codeStation } from './code';
import { config } from './config';
import { catCount, cats, legacyLines, modernLineCount } from './legacy';
import { overview } from './overview';
import { fixes } from './snippets';
import { shots, siteStation } from './site';

/**
 * The talk is one picture — the life of a server extension:
 *   Code → Build → .soe → ArcGIS Server site
 * Every part starts "legacy" (👴) and turns "21st century" (👨‍💻) once covered.
 */

const colourNotes: Record<string, string[]> = {
  cfg: ['Debug and Release property groups, output paths, target framework.', 'The same block, copied into every one of 189 projects.'],
  id: ['A GUID for the project, GUIDs for every project reference, a strong-name key.', 'Nobody ever reads them — everybody has merged conflicts in them.'],
  refs: ['DLLs by HintPath: five levels of ..\\ into a checked-in lib folder, or straight into another project’s bin.', 'Plus framework assemblies listed one by one.'],
  esri: ['ArcObjects COM interop, pinned to 10.8 — in every project.', '302 of these across the repo.'],
  compile: ['Every .cs file listed by hand.', 'Add a file, forget the line, enjoy the merge.'],
  nuget: ['What packages.config NuGet writes into your project: imports from ..\\packages and a guard target.'],
};

const projSteps: StepDef[] = [
  { id: 'proj', title: `Legacy csproj: ${legacyLines.length} lines`, target: 'proj', secs: 10, notes: [`One SOE feature module: ${legacyLines.length} lines of project file.`, 'Each colour is one kind of noise — let us look closer.'] },
  ...cats.map(
    (c): StepDef => ({ id: `proj-${c.id}`, title: `${c.name} (${catCount(c.id)} lines)`, target: `wall-${c.id}`, secs: 6, pad: 0.03, notes: colourNotes[c.id] }),
  ),
  { id: 'proj-11', title: `SDK-style: ${modernLineCount} lines`, target: 'proj', secs: 10, notes: [`Same project today: ${modernLineCount} lines.`, 'One ProjectReference, one PackageReference — the only things special about it.'] },
  { id: 'proj-fixes', title: 'Where did it all go?', target: 'proj', secs: 5, notes: ['Six kinds of noise, six answers.'] },
  ...cats.map(
    (c): StepDef => ({ id: `fix-${c.id}`, title: `${c.name} → ${fixes[c.id].feature}`, target: `fix-${c.id}`, secs: 7, notes: [`${fixes[c.id].feature}.`, 'QR code in the corner: the docs.'] }),
  ),
];

export const deck: DeckDef = {
  title: config.title,
  budget: config.budget,
  html: overview(codeStation + buildStation + soeStation + siteStation),
  sections: [
    {
      section: { id: 'open', title: 'Opening' },
      steps: [
        { id: 'title', title: 'Title — the big picture', target: 'overview', secs: 20, notes: ['Let me tell you a story about…', '…server extensions we took over from an external supplier in March 2025.', 'Code → build → .soe → ArcGIS Server. Everything here is still legacy.'] },
        { id: 'why', title: 'Where we started: 10.9.1', target: 'servers', secs: 10, notes: ['ArcGIS Enterprise 10.9.1 — ArcMap runtime.', 'SOEs/SOIs on .NET Framework, ArcObjects COM interop.'] },
        { id: 'why-jump', title: 'The jump to 11.5', target: 'servers', secs: 14, notes: ['We went straight to 11.5.', '11.0 retired the ArcMap runtime; 11.3 brought .NET 8 extensions.', 'Our extensions simply would not load any more.'] },
        { id: 'net', title: '.NET Framework vs .NET', target: 'net', secs: 9, notes: ['.NET Framework: Windows only, 4.8.1 is the last.', '.NET: cross-platform, LTS releases.'] },
        { id: 'net-where', title: 'Where is ArcGIS?', target: 'net', secs: 12, notes: ['ArcGIS Server itself runs on Linux.', 'But on Linux it hosts only Java extensions — the limit is ArcGIS, not .NET.'] },
        { id: 'fix-all', title: 'Fix everything around', target: 'overview', secs: 8, notes: ['If we touch every extension anyway…', '…fix the project files, packages, build, versioning and deployment too.'] },
      ],
    },
    {
      section: { id: 'code', title: 'Project files & packages' },
      steps: [
        ...projSteps,
        { id: 'props', title: 'Directory.Build.props', target: 'props', secs: 12, notes: ['Company, target framework, output path — once.', 'The SOE folder overrides to net472;net8.0, web services to net10.0.'] },
        { id: 'repo', title: 'Repository layout', target: 'repo', secs: 8, notes: ['src, build, ci, config, docs — and one artifacts folder.'] },
        { id: 'artifacts', title: 'Central artifacts folder', target: 'artifacts', secs: 10, notes: ['Before: bin/obj in 189 projects, plus a shared drop folder others read via HintPath.', 'Now: one ArtifactsPath — per project, configuration, TFM and ArcGIS version.'] },
        { id: 'pkg', title: 'packages.config → PackageReference', target: 'pkg', secs: 10, notes: ['117 packages.config files at peak.', 'PackageReference: you list what you need.'] },
        { id: 'pkg-trans', title: 'Transitive packages', target: 'pkg', secs: 12, notes: ['A transitive package is a dependency of a dependency.', 'packages.config lists them all, flat — you cannot tell what you chose.', 'PackageReference: one line; restore resolves the graph.'] },
        { id: 'cpm', title: 'Newtonsoft, six ways', target: 'cpm', secs: 8, notes: ['Newtonsoft.Json referenced six different ways.', 'Three package versions, three copies of a checked-in DLL.'] },
        { id: 'cpm-one', title: 'Central package management', target: 'cpm', secs: 10, notes: ['Directory.Packages.props: 58 packages, one version each.', 'The .csproj has no versions any more.'] },
        { id: 'cpm-pin', title: 'Transitive pinning', target: 'cpm-pin', secs: 10, notes: ['Pinning also overrides versions that arrive transitively.', 'Our case: 13.0.4 compiles, but ArcGIS loads an older Newtonsoft → MissingMethodException.'] },
        { id: 'store', title: 'Package store: per solution vs per user', target: 'store', secs: 8, notes: ['packages.config restores next to each .sln.', 'PackageReference uses one per-user cache — CI points NUGET_PACKAGES somewhere.'] },
        { id: 'store-path', title: 'The relative path trap', target: 'store-path', secs: 9, notes: ['HintPath ..\\packages\\ only works if the .sln is one level above.', '53 solutions — guess how often it was not.'] },
        { id: 'store-gen', title: 'Who edits your csproj?', target: 'store-gen', secs: 9, notes: ['Old NuGet wrote imports and a guard target into your csproj.', 'Now restore generates nuget.g.props/targets in obj.'] },
        { id: 'nuget', title: 'Esri SDK as a NuGet package', target: 'nuget', secs: 10, notes: ['We packed the Enterprise SDK reference DLLs into our own package — 10.9.1 and 13.5.1.', 'Licensed files: internal feed only.'] },
        { id: 'stats', title: 'Then → now', target: 'stats', secs: 5, notes: ['Scoreboard for the project system — main SOE: 135 → 7.'] },
      ],
    },
    {
      section: { id: 'build', title: 'Multitargeting' },
      steps: [
        { id: 'multi', title: 'Multitargeting net472;net8.0', target: 'multi', secs: 12, notes: ['After 11.5 worked, we backported: net472 for 10.9.1 with Pro services.', 'One codebase, two .soe flavours.'] },
        { id: 'multi-db', title: 'Both servers, one geodatabase', target: 'multi', secs: 8, notes: ['Both server generations run in parallel on the same 10.9.1 geodatabase.'] },
      ],
    },
    {
      section: { id: 'soe', title: 'The .soe package' },
      steps: [
        { id: 'split', title: 'Monolith SOE', target: 'split', secs: 8, notes: ['One SOE with 17 feature modules.'] },
        { id: 'split-8', title: 'One SOE/SOI per feature', target: 'split', secs: 9, notes: ['Now 8 archives: 5 SOEs, 3 SOIs — each only with the modules it needs.'] },
        { id: 'merge', title: 'DLL hell in one process', target: 'merge', secs: 9, notes: ['Several extensions share one service process.', 'Two versions of our own DLL: the first one loaded wins.'] },
        { id: 'merge-fix', title: 'Merged per SOE', target: 'merge', secs: 10, notes: ['ILRepack merges our assemblies into one DLL named after the SOE.', 'Third-party stays beside it — and is pinned centrally.'] },
        { id: 'version', title: 'Versioning from git describe', target: 'version', secs: 9, notes: ['Before: the version was typed by hand into AssemblyInfo.cs.', 'Now one git describe writes Version.props for everything.'] },
        { id: 'version-parts', title: 'Anatomy of a version', target: 'version', secs: 8, notes: ['Tag, commits ×2, commit, branch, configuration.', 'Even revision = clean build.'] },
        { id: 'version-dirty', title: 'A dirty build', target: 'version', secs: 8, notes: ['Odd revision = local changes — plus a hash of them.', 'You can never mistake a dirty build for a real one.'] },
        { id: 'version-desc', title: 'Version in the SOE description', target: 'manager', secs: 10, notes: ['The SOE Version field must equal the server version.', 'So the real version goes into Description — the only thing Manager shows.'] },
      ],
    },
    {
      section: { id: 'run', title: 'Docs, deploy, CI' },
      steps: [
        { id: 'openapi', title: 'OpenAPI + Scalar', target: 'openapi', secs: 8, notes: ['Every service — including custom SOEs — gets an OpenAPI document.'] },
        { id: 'oa-rest', title: 'From the REST directory…', target: 'oa-rest', secs: 6, notes: ['We read the ArcGIS REST directory and every SOE’s ?f=schema.'] },
        { id: 'oa-doc', title: '…to Scalar docs', target: 'oa-doc', secs: 8, notes: ['Parameters, types, enums — and code samples.'] },
        { id: 'oa-try', title: '…and a live API client', target: 'oa-try', secs: 6, notes: ['And you can call it right there.'] },
        { id: 'deploy', title: 'Deployment: one command', target: 'deploy', secs: 12, notes: ['Before: built locally, uploaded by hand in Server Manager.', 'Now: NUKE talks to the Admin REST API — and restarts what the update stopped.'] },
        { id: 'linux', title: 'CI/CD on Linux', target: 'ci', secs: 8, notes: ['GitLab CI in a Linux .NET SDK container.', 'Full SOE build including the merge: 1 minute 2 seconds.'] },
        { id: 'linux-pipe', title: 'The pipeline', target: 'pipeline', secs: 8, notes: ['Plan, build, resolve, deploy — build and deploy in one go.'] },
        { id: 'linux-next', title: 'ArcGIS Server may follow', target: 'ci', secs: 6, notes: ['.NET extensions on ArcGIS Server: Windows only today.', 'Our pipeline is ready the day that changes.'] },
        { id: 'modern', title: '21st century — overview', target: 'overview', secs: 6, notes: ['Everything we touched has moved on.'] },
      ],
    },
    {
      section: { id: 'demo', title: 'Admin portal' },
      steps: [
        { id: 'portal', title: 'GIS Backstage', target: 'portal', secs: 8, notes: ['We run the site from our own portal.', 'Built in 7.5 weeks.'] },
        ...shots.map((s, i) => ({ id: s.id, title: s.label.split(' — ')[0], target: s.id, secs: [14, 12, 10, 10, 6][i], notes: [s.label] })),
      ],
    },
    {
      section: { id: 'ai', title: 'Vibe coding' },
      steps: [
        { id: 'ai', title: 'Commits per month, by tool', target: 'ai', secs: 12, notes: ['By hand, then ChatGPT, then GitHub Copilot, then Claude Code.', 'August: 184 commits — Linux CI and the portal.'] },
        { id: 'ai-wow', title: 'What changed', target: 'ai', secs: 15, notes: ['2.2× commits, 4.4× lines per month — and 100× the docs.', 'The secret: AGENTS.md — the agent reads it every time.'] },
      ],
    },
    {
      section: { id: 'close', title: 'Close' },
      steps: [
        { id: 'thanks', title: 'Thank you + QR', target: 'overview', secs: 8, notes: ['Thank you!', 'The QR code opens GitHub Discussions — ask there any time after the talk.'] },
        { id: 'questions', title: 'Questions', target: 'overview', secs: 0, notes: ['Click a chip in the jump list to fly back to any topic.', 'Out of time? Point to the QR code: GitHub Discussions.'] },
        { id: 'feedback', title: 'Feedback survey', target: 'feedback', secs: 0, notes: ['Leave this up after Q&A.'] },
      ],
    },
  ],
};
