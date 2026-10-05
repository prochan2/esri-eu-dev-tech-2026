import '../styles/canvas.css';
import type { DeckDef } from '../engine/types';
import { buildStation, soeStation } from './build';
import { codeStation } from './code';
import { config } from './config';
import { overview } from './overview';
import { shots, siteStation } from './site';

/**
 * The talk is one picture — the life of a server extension:
 *   Code → Build → .soe → ArcGIS Server site
 * Every part starts "legacy" and turns "21st century" once we have talked about it.
 */
export const deck: DeckDef = {
  title: config.title,
  budget: config.budget,
  html: overview(codeStation + buildStation + soeStation + siteStation),
  sections: [
    {
      section: { id: 'open', title: 'Opening' },
      steps: [
        { id: 'title', title: 'Title — the big picture', target: 'overview', secs: 25, notes: ['Hi, I am Antonín, CETIN — Czech telecom infrastructure.', 'This is the life of our server extensions: code → build → .soe → ArcGIS Server.', 'We took the code over from an external supplier in March 2025.', 'Everything you see is still “legacy”.'] },
        { id: 'why', title: 'Where we started: 10.9.1', target: 'servers', secs: 12, notes: ['ArcGIS Enterprise 10.9.1 — ArcMap runtime.', 'SOEs/SOIs on .NET Framework, ArcObjects COM interop.'] },
        { id: 'why-jump', title: 'The jump to 11.5', target: 'servers', secs: 18, notes: ['We went straight to 11.5.', '11.0 retired the ArcMap runtime; 11.3 brought .NET 8 extensions.', 'Our extensions simply would not load any more.'] },
        { id: 'fix-all', title: 'Fix everything around', target: 'overview', secs: 10, notes: ['If we touch every extension anyway…', '…fix the project files, packages, build, versioning and deployment too.'] },
      ],
    },
    {
      section: { id: 'code', title: 'Project files & packages' },
      steps: [
        { id: 'proj', title: 'Legacy csproj: 135 lines', target: 'proj', secs: 15, notes: ['Our main SOE project file: 135 lines.', 'The colours: red HintPaths, orange ESRI references, yellow hand-listed files.'] },
        { id: 'proj-7', title: 'SDK-style: 7 lines', target: 'proj', secs: 15, notes: ['Same project, SDK-style: 7 lines.', 'One ProjectReference — that is all it says, because that is all that is special about it.'] },
        { id: 'proj-gone', title: 'Where did 128 lines go?', target: 'proj', secs: 18, notes: ['1,636 Compile items → file globbing.', '809 HintPaths → zero.', '302 ESRI references → two PackageReferences.', 'The rest moved to one central place…'] },
        { id: 'props', title: 'Directory.Build.props', target: 'props', secs: 15, notes: ['Directory.Build.props: company, target framework, output path — once.', 'Hierarchy: the SOE folder overrides to net472;net8.0, web services to net10.0.'] },
        { id: 'artifacts', title: 'Central artifacts folder', target: 'artifacts', secs: 12, notes: ['Before: bin/obj in 189 projects, plus a shared drop folder others read via HintPath.', 'Now: one ArtifactsPath — bin, obj, publish and the .soe archives, per TFM and ArcGIS version.'] },
        { id: 'pkg', title: 'packages.config → PackageReference', target: 'pkg', secs: 15, notes: ['117 packages.config files at peak.', 'They list everything flat — direct and transitive.', 'PackageReference: you state what you need; restore resolves the rest.'] },
        { id: 'cpm', title: 'Newtonsoft, six ways', target: 'cpm', secs: 10, notes: ['Newtonsoft.Json was referenced six different ways.', 'Three package versions plus three copies of a checked-in DLL.'] },
        { id: 'cpm-one', title: 'Directory.Packages.props', target: 'cpm', secs: 14, notes: ['Central Package Management: 58 packages, one version each, one file.', 'And a comment explaining why we pin 13.0.3 — ArcGIS loads its own older Newtonsoft.'] },
        { id: 'store', title: 'Package store: per-solution vs per-user', target: 'store', secs: 12, notes: ['packages.config restores next to each .sln.', 'PackageReference uses one per-user cache — CI just points NUGET_PACKAGES somewhere.'] },
        { id: 'store-path', title: 'The relative path trap', target: 'store-path', secs: 12, notes: ['HintPath ..\\packages\\ only works if the .sln is one level above.', '53 solutions — guess how often it was not.'] },
        { id: 'store-gen', title: 'Who edits your csproj?', target: 'store-gen', secs: 12, notes: ['Old NuGet wrote Imports and a guard target into your csproj.', 'Now restore generates nuget.g.props/targets in obj — csproj untouched.'] },
        { id: 'nuget', title: 'Esri SDK as a NuGet package', target: 'nuget', secs: 12, notes: ['We packed the Enterprise SDK reference DLLs into our own package.', 'Two versions: 10.9.1 for net472, 13.5.1 for net8.0.', '302 references became 2.'] },
        { id: 'stats', title: 'Then → now', target: 'stats', secs: 8, notes: ['Quick scoreboard for the project system.'] },
      ],
    },
    {
      section: { id: 'build', title: '.NET & multitargeting' },
      steps: [
        { id: 'net', title: '.NET Framework vs .NET', target: 'net', secs: 12, notes: ['.NET Framework: Windows only, 4.8.1 is the last one.', '.NET: cross-platform, LTS releases.'] },
        { id: 'net-where', title: 'Where is ArcGIS?', target: 'net', secs: 14, notes: ['ArcGIS Server runs on Windows and Linux.', 'But .NET SOEs/SOIs: Windows only — Linux takes Java extensions only.'] },
        { id: 'multi', title: 'Multitargeting net472;net8.0', target: 'multi', secs: 15, notes: ['After 11.5 worked, we backported: net472 for 10.9.1 with Pro services.', 'One codebase, two .soe flavours. The build picks the TFM from the server version.'] },
        { id: 'multi-db', title: 'Both servers, one geodatabase', target: 'multi', secs: 10, notes: ['Both server generations run in parallel on the same 10.9.1 geodatabase.', 'Until we switch off the 10.9.1 servers.'] },
      ],
    },
    {
      section: { id: 'soe', title: 'The .soe package' },
      steps: [
        { id: 'split', title: 'Monolith SOE', target: 'split', secs: 10, notes: ['One SOE with 17 feature modules.'] },
        { id: 'split-8', title: 'One SOE/SOI per feature', target: 'split', secs: 12, notes: ['Now 8 archives: 5 SOEs, 3 SOIs.', 'Each references only the modules it needs.'] },
        { id: 'merge', title: 'DLL hell in one process', target: 'merge', secs: 12, notes: ['Several extensions share one service process.', 'Two versions of our own DLL: the first one loaded wins.'] },
        { id: 'merge-fix', title: 'ILRepack per SOE', target: 'merge', secs: 14, notes: ['ILRepack merges our own assemblies into one DLL named after the SOE.', 'Third-party stays beside it — and we pin those centrally.'] },
        { id: 'version', title: 'Versioning from git describe', target: 'version', secs: 12, notes: ['Before: typed by hand; then GitVersion in 117 packages.config.', 'Now one git describe writes Version.props for everything.'] },
        { id: 'version-parts', title: 'Anatomy of a version', target: 'version', secs: 10, notes: ['Tag, commits ×2 — odd means dirty — sha, branch, configuration.'] },
        { id: 'version-desc', title: 'Version in the SOE description', target: 'manager', secs: 12, notes: ['The SOE Version field must equal the server version — 11.5.', 'So we stamp the real version into Description — the only thing Manager shows.'] },
      ],
    },
    {
      section: { id: 'run', title: 'Docs, deploy, CI' },
      steps: [
        { id: 'openapi', title: 'OpenAPI + Scalar', target: 'openapi', secs: 15, notes: ['Every custom SOE answers ?f=schema.', 'We turn that into OpenAPI and show it in Scalar — next to the standard service operations.'] },
        { id: 'deploy', title: 'Deployment: one command', target: 'deploy', secs: 14, notes: ['Before: 81 hand-listed files, TeamCity, upload in Manager.', 'Now: NUKE talks to the Admin REST API — and restarts what the update stopped.'] },
        { id: 'linux', title: 'CI/CD on Linux', target: 'ci', secs: 12, notes: ['GitLab CI in a Linux .NET SDK container.', 'Full SOE build including ILRepack: 1 minute 2 seconds.'] },
        { id: 'linux-next', title: 'ArcGIS Server may follow', target: 'ci', secs: 8, notes: ['.NET extensions on ArcGIS Server are Windows only today.', 'Our pipeline is ready the day that changes.'] },
        { id: 'modern', title: '21st century — overview', target: 'overview', secs: 8, notes: ['Everything we touched is green now.'] },
      ],
    },
    {
      section: { id: 'demo', title: 'Admin portal' },
      steps: [
        { id: 'portal', title: 'GIS Backstage', target: 'portal', secs: 10, notes: ['We run the site from our own portal.', 'Built in 7.5 weeks. Walkthrough from screenshots.'] },
        ...shots.map((s, i) => ({
          id: s.id,
          title: s.label.split(' — ')[0],
          target: s.id,
          secs: [20, 15, 12, 12][i],
          notes: [s.label],
        })),
      ],
    },
    {
      section: { id: 'ai', title: 'Vibe coding' },
      steps: [
        { id: 'ai', title: 'Commits per month', target: 'ai', secs: 15, notes: ['February 2026: Claude Code joined.', 'August: 184 commits — Linux CI, the portal.'] },
        { id: 'ai-wow', title: 'What changed', target: 'ai', secs: 20, notes: ['2.2× commits, 4.4× lines per month — and 100× the docs.', 'The secret: AGENTS.md — the agent reads it every time.'] },
      ],
    },
    {
      section: { id: 'close', title: 'Close' },
      steps: [
        { id: 'thanks', title: 'Thank you + QR', target: 'overview', secs: 10, notes: ['Thank you!'] },
        { id: 'questions', title: 'Questions', target: 'overview', secs: 0, notes: ['Click a chip in the jump list to fly back to any topic.'] },
        { id: 'feedback', title: 'Feedback survey', target: 'feedback', secs: 0, notes: ['Leave this up after Q&A.'] },
      ],
    },
  ],
};
