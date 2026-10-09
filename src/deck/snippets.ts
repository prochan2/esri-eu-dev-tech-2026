/**
 * Real snippets from the gis-be repository (sanitised). Commit references are
 * in the comments so every number on screen can be traced back.
 */

/** src/Directory.Build.props (key parts). */
export const buildProps = `<Project>
  <PropertyGroup>
    <Company>CETIN a.s.</Company>
    <TargetFramework>net8.0</TargetFramework>
    <ArtifactsPath>$([System.IO.Path]::GetFullPath(
      '$(MSBuildThisFileDirectory)..\\artifacts'))</ArtifactsPath>
  </PropertyGroup>
</Project>`;

/** src/cetin/arcgisserver/src/Directory.Build.props */
export const soeProps = `<!-- ArcGIS Server 10.9.1 (.NET Framework 4.7.2) + ArcGIS Server 11.5 (.NET 8) -->
<TargetFramework />
<TargetFrameworks>net472;net8.0</TargetFrameworks>`;

/** Largest packages.config at 94b163d8 (Zis.Adapter.WinServices) — 28 entries, flattened. */
export const packagesConfig = `<packages>
  <package id="Apache.Avro" version="1.12.0" targetFramework="net472" />
  <package id="Confluent.Kafka" version="2.6.1" targetFramework="net472" />
  <package id="Confluent.SchemaRegistry" version="2.6.1" targetFramework="net472" />
  <package id="GitVersion.MsBuild" version="5.12.0" targetFramework="net472" developmentDependency="true" />
  <package id="librdkafka.redist" version="2.6.1" targetFramework="net472" />
  <package id="Microsoft.Bcl.AsyncInterfaces" version="9.0.0" targetFramework="net472" />
  <package id="Microsoft.Extensions.Caching.Abstractions" version="9.0.0" targetFramework="net472" />
  <package id="Microsoft.Extensions.Caching.Memory" version="9.0.0" targetFramework="net472" />
  <package id="Microsoft.Extensions.DependencyInjection.Abstractions" version="9.0.0" targetFramework="net472" />
  <package id="Microsoft.Extensions.Logging.Abstractions" version="9.0.0" targetFramework="net472" />
  <package id="Microsoft.Extensions.Options" version="9.0.0" targetFramework="net472" />
  <package id="Microsoft.Extensions.Primitives" version="9.0.0" targetFramework="net472" />
  <package id="Newtonsoft.Json" version="13.0.3" targetFramework="net472" />
  <package id="System.Buffers" version="4.6.0" targetFramework="net472" />
  <package id="System.CodeDom" version="9.0.0" targetFramework="net472" />
  <package id="System.Diagnostics.DiagnosticSource" version="9.0.0" targetFramework="net472" />
  <package id="System.IO" version="4.3.0" targetFramework="net472" />
  <package id="System.Memory" version="4.6.0" targetFramework="net472" />
  <package id="System.Net.Http" version="4.3.4" targetFramework="net472" />
  <package id="System.Numerics.Vectors" version="4.6.0" targetFramework="net472" />
  <package id="System.Runtime" version="4.3.1" targetFramework="net472" />
  <package id="System.Runtime.CompilerServices.Unsafe" version="6.1.0" targetFramework="net472" />
  <package id="System.Security.Cryptography.Algorithms" version="4.3.1" targetFramework="net472" />
  <package id="System.Security.Cryptography.Encoding" version="4.3.0" targetFramework="net472" />
  <package id="System.Security.Cryptography.Primitives" version="4.3.0" targetFramework="net472" />
  <package id="System.Security.Cryptography.X509Certificates" version="4.3.2" targetFramework="net472" />
  <package id="System.Threading.Tasks.Extensions" version="4.6.0" targetFramework="net472" />
  <package id="System.ValueTuple" version="4.5.0" targetFramework="net472" />
</packages>`;

export const packageReference = `<ItemGroup>
  <PackageReference Include="Confluent.Kafka" />
  <PackageReference Include="Confluent.SchemaRegistry" />
  <PackageReference Include="Microsoft.Extensions.Caching.Memory" />
  <PackageReference Include="Newtonsoft.Json" />
</ItemGroup>`;

/** The six distinct Newtonsoft.Json HintPaths at 73f745cd (with reference counts). */
export const newtonsoftHintPaths: [number, string][] = [
  [61, '..\\..\\..\\..\\..\\lib\\newtonsoft.json\\net45\\Newtonsoft.Json.dll'],
  [6, '..\\..\\..\\..\\lib\\newtonsoft.json\\net45\\Newtonsoft.Json.dll'],
  [4, '..\\packages\\Newtonsoft.Json.13.0.3\\lib\\net45\\Newtonsoft.Json.dll'],
  [1, '..\\packages\\Newtonsoft.Json.13.0.1\\lib\\net45\\Newtonsoft.Json.dll'],
  [1, '..\\packages\\Newtonsoft.Json.11.0.1\\lib\\net45\\Newtonsoft.Json.dll'],
  [1, '..\\libs\\Newtonsoft.Json.dll'],
];

/** src/Directory.Packages.props (excerpt). */
export const packagesProps = `<ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
<CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>

<!-- Cannot use 13.0.4: ArcGIS Server loads an older Newtonsoft.Json
     at runtime -> MissingMethodException in SOE/SOI. -->
<PackageVersion Include="Newtonsoft.Json" Version="13.0.3" />`;

export const packagesPropsTfm = `<!-- .NET Framework 4.7.2 (ArcGIS Server 10.9.1) -->
<ItemGroup Condition="'$(TargetFramework)' == 'net472'">
  <PackageVersion Include="Esri.ArcGIS.Enterprise.Sdk.Ref" Version="10.9.1" />
</ItemGroup>
<!-- .NET 8+ (ArcGIS Server 11.5) -->
<ItemGroup Condition="'$(TargetFramework)' != 'net472'">
  <PackageVersion Include="Esri.ArcGIS.Enterprise.Sdk.Ref" Version="13.5.1" />
</ItemGroup>`;

/** NuGet edits the csproj (legacy) — lines 3 and 117–124 of the legacy file. */
export const nugetEdits = `<Import Project="..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.props" … />
…
<Target Name="EnsureNuGetPackageBuildImports" BeforeTargets="PrepareForBuild">
  <Error Condition="!Exists('..\\packages\\GitVersion.MsBuild.5.12.0\\build\\…props')" … />
  <Error Condition="!Exists('..\\packages\\GitVersion.MsBuild.5.12.0\\build\\…targets')" … />
</Target>
<Import Project="..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.targets" … />`;

/** src/cetin/sdk/Esri.ArcGIS.Enterprise.Sdk.Ref/Esri.ArcGIS.Enterprise.Sdk.Ref.csproj (key parts). */
export const esriRefCsproj = `<Description>ESRI ArcGIS Enterprise SDK reference assemblies</Description>
<IncludeBuildOutput>false</IncludeBuildOutput>
<GeneratePackageOnBuild>true</GeneratePackageOnBuild>

<ItemGroup>
  <_ArcGisSdkReferenceAssemblies Include="$(ENTDEVKITJAVA)\\DotNet\\*.dll" />
  <None Include="@(_ArcGisSdkReferenceAssemblies)" Pack="true" PackagePath="lib/net45" />
</ItemGroup>`;

/** build/VersionHelper.cs (excerpt). */
export const versionHelper = `// git describe --tags --match "*.*.*" --long
var (major, minor, patch, commits, sha) = ParseGitDescribe(repositoryRoot);
var revision = commits * 2 + (isDirty ? 1 : 0);   // even = clean, odd = dirty
var version = $"{major}.{minor}.{patch}.{revision}";
var assemblyVersion = $"{major}.0.0.0";           // stable -> no binding redirects
var informationalVersion = $"{version}+{sha}.{branch}";`;

/** src/cetin/arcgisserver/config/Wgis.Soe.Config.xml + build/SoeArchiveBuilder.cs */
export const soeConfigXml = `<Version>{ArcGisVersion}</Version>     <!-- must be "11.5" — or no registration -->
<ExtensionType id="Wgis.Soe" library="Wgis.Soe.dll" class="Wgis.Soe.WgisSoe">
  <DisplayName>Cetin WGIS Utility SOE</DisplayName>
  <Description>{Description}</Description>   <!-- the only field Manager shows -->`;

/** Wgis.WebServices.Docs/ArcGisOpenApiDocumentationProvider.cs (excerpt). */
export const openApiProbe = `var schema = await client.GetFromJsonAsync<ArcGisResourceInfo>(
    WithToken($"{serviceUrl}/exts/{name}?f=schema", token), ct);
if (schema?.Resources is { Count: > 0 })
    extensions.Add(new ArcGisExtension(name, schema));`;

/** Legacy BuildSOE XML — 81 hand-listed files. */
export const addFiles = `<addFile source="%CHECKOUT_DIR%\\lib\\castle.core\\net45\\Castle.Core.dll"/>
<addFile source="%CHECKOUT_DIR%\\cetin\\arcgisserver\\bin\\debug\\Wgis.Soe.ModuleC.dll"/>
<addFile source="%CHECKOUT_DIR%\\cetin\\arcgisserver\\bin\\debug\\Wgis.Soe.ModuleC.pdb"/>`;

/** GITLAB_RUNNERS.md §5, 2026-08-20 — first SOE build on a Linux runner. */
export const linuxRun = `$ pwsh ./build.ps1 BuildWgisSoe --configuration Debug --arcgis-version 11.5
Wrote /w/artifacts/build/Wgis.Soe/debug_11.5/Wgis.Soe.dll
[INF] Wgis.Soe -> /w/artifacts/soe/Wgis.Soe/debug_11.5/Wgis.Soe.soe
BuildWgisSoe       Succeeded       1:02`;

/** Monthly commits (all, incl. merges), 2025-03 … 2026-10 (to 10-05). */
export const monthlyCommits: [string, number][] = [
  ['2025-03', 6], ['2025-04', 16], ['2025-05', 12], ['2025-06', 13], ['2025-07', 27], ['2025-08', 12],
  ['2025-09', 58], ['2025-10', 32], ['2025-11', 34], ['2025-12', 18], ['2026-01', 32], ['2026-02', 11],
  ['2026-03', 12], ['2026-04', 81], ['2026-05', 15], ['2026-06', 59], ['2026-07', 47], ['2026-08', 184],
  ['2026-09', 52], ['2026-10', 9],
];

/** The six legacy categories: an excerpt of the old way and the SDK-style answer. */
export const fixes: Record<'cfg' | 'id' | 'refs' | 'esri' | 'compile' | 'nuget', { feature: string; legacy: string; now: string; doc: string }> = {
  cfg: {
    feature: 'SDK defaults + Directory.Build.props',
    legacy: `<PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Debug|AnyCPU' ">
  <OutputPath>..\\..\\..\\bin\\debug\\</OutputPath>
  <DefineConstants>DEBUG;TRACE</DefineConstants>
</PropertyGroup>
<TargetFrameworkVersion>v4.7.2</TargetFrameworkVersion>`,
    now: `<!-- src/Directory.Build.props: once for all projects -->
<TargetFrameworks>net472;net8.0</TargetFrameworks>
<ArtifactsPath>$(MSBuildThisFileDirectory)..\\artifacts</ArtifactsPath>`,
    doc: 'https://learn.microsoft.com/en-us/visualstudio/msbuild/customize-by-directory',
  },
  id: {
    feature: 'No GUIDs · generated assembly info',
    legacy: `<ProjectGuid>{169977A4-80E4-4B1E-9702-5578D933E906}</ProjectGuid>
<ProjectReference Include="..\\Wgis.Soe.ModuleA\\Wgis.Soe.ModuleA.csproj">
  <Project>{0a28c0ea-19ab-42f7-819e-2a00d4561c78}</Project>
<Compile Include="Properties\\AssemblyInfo.cs" />`,
    now: `<!-- .slnx: projects by path, no GUIDs -->
<Project Path="src/.../Wgis.Soe.ModuleB.csproj" />
<!-- AssemblyInfo generated from Directory.Build.props -->
<Company>CETIN a.s.</Company>`,
    doc: 'https://learn.microsoft.com/en-us/dotnet/core/project-sdk/msbuild-props#assembly-attribute-properties',
  },
  refs: {
    feature: 'ProjectReference + PackageReference',
    legacy: `<Reference Include="Castle.Windsor">
  <HintPath>..\\..\\..\\..\\..\\lib\\castle.windsor\\net45\\Castle.Windsor.dll</HintPath>
<Reference Include="Wgis.GeoDatabase, Version=10.8.1.0, …">
  <HintPath>..\\..\\..\\..\\common\\bin\\$(Configuration)\\Wgis.GeoDatabase.dll</HintPath>
<Reference Include="System.Configuration" />`,
    now: `<ProjectReference Include="..\\Wgis.Soe.ModuleI\\Wgis.Soe.ModuleI.csproj" />
<PackageReference Include="System.Configuration.ConfigurationManager" />
<!-- Castle, Wgis.GeoDatabase … arrive transitively -->`,
    doc: 'https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files',
  },
  esri: {
    feature: 'Esri SDK as one NuGet package',
    legacy: `<Reference Include="ESRI.ArcGIS.Carto, Version=10.8.0.0, Culture=neutral,
    PublicKeyToken=8fc3cc631e44ad86, processorArchitecture=MSIL">
  <SpecificVersion>False</SpecificVersion>
  <Private>False</Private>
</Reference>   <!-- × 5 per project, 302 in the repo -->`,
    now: `<!-- once, in the base library; flows to every SOE -->
<PackageReference Include="Esri.ArcGIS.Enterprise.Sdk.Ref" />`,
    doc: 'https://developers.arcgis.com/enterprise-sdk/guide/net/',
  },
  compile: {
    feature: 'Default items (globbing)',
    legacy: `<Compile Include="Handlers\\HandlerA.cs" />
<Compile Include="Handlers\\HandlerB.cs" />
<Compile Include="ServicesInstaller.cs" />
<Compile Include="SpatialAnalysis.cs" />`,
    now: `<!-- nothing: **/*.cs is included by default -->`,
    doc: 'https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview#default-includes-and-excludes',
  },
  nuget: {
    feature: 'Restore generates the imports',
    legacy: `<Import Project="..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.props" … />
<Target Name="EnsureNuGetPackageBuildImports" BeforeTargets="PrepareForBuild">
  <Error Condition="!Exists('..\\packages\\…')" … />
</Target>`,
    now: `obj/Wgis.Soe.ModuleB.csproj.nuget.g.props
obj/Wgis.Soe.ModuleB.csproj.nuget.g.targets
<!-- generated by restore, never in the .csproj -->`,
    doc: 'https://learn.microsoft.com/en-us/nuget/consume-packages/migrate-packages-config-to-package-reference',
  },
};

/** Transitive pinning: a package nobody references directly still gets our version. */
export const pinning = `<CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>

<!-- also wins where Newtonsoft only arrives transitively (via a package) -->
<PackageVersion Include="Newtonsoft.Json" Version="13.0.3" />`;

export const cpmCsproj = `<!-- .csproj: no versions any more -->
<PackageReference Include="Newtonsoft.Json" />`;

/** Version strings: a clean build from Server Manager and a dirty local build (Version.props). */
export const versions = {
  clean: { tag: '11.5.3', rev: '.220', sha: '+06be7b2c', branch: '.topic-entra-crisp-v2', dirty: '', cfg: '.debug' },
  dirty: { tag: '11.5.3', rev: '.109', sha: '+c41413bb', branch: '.main', dirty: '.dirty.64631446', cfg: '.debug' },
};
