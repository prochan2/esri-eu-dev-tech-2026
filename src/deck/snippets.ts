/**
 * Real snippets from the gis-be repository (sanitised). Commit references are
 * in the comments so every number on screen can be traced back.
 */

/** Wgis.Soe.csproj at 94b163d8 (2025-06-13) — 135 lines. */
export const legacyCsproj = `<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <Import Project="..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.props" Condition="Exists('..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.props')" />
  <PropertyGroup>
    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
    <Platform Condition=" '$(Platform)' == '' ">AnyCPU</Platform>
    <ProductVersion>8.0.30703</ProductVersion>
    <SchemaVersion>2.0</SchemaVersion>
    <ProjectGuid>{F9A1F056-AB5A-4A93-9242-9BF85721AB5A}</ProjectGuid>
    <OutputType>Library</OutputType>
    <AppDesignerFolder>Properties</AppDesignerFolder>
    <RootNamespace>Wgis.Soe</RootNamespace>
    <AssemblyName>Wgis.Soe</AssemblyName>
    <TargetFrameworkVersion>v4.7.2</TargetFrameworkVersion>
    <FileAlignment>512</FileAlignment>
    <NuGetPackageImportStamp>
    </NuGetPackageImportStamp>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Debug|AnyCPU' ">
    <DebugSymbols>true</DebugSymbols>
    <DebugType>full</DebugType>
    <Optimize>false</Optimize>
    <OutputPath>..\\..\\..\\bin\\debug\\</OutputPath>
    <DefineConstants>DEBUG;TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Release|AnyCPU' ">
    <DebugType>pdbonly</DebugType>
    <Optimize>true</Optimize>
    <OutputPath>..\\..\\..\\bin\\release\\</OutputPath>
    <DefineConstants>TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <PropertyGroup>
    <SignAssembly>true</SignAssembly>
    <AssemblyOriginatorKeyFile>..\\..\\..\\..\\sign\\wgisKey.snk</AssemblyOriginatorKeyFile>
  </PropertyGroup>
  <ItemGroup>
    <Reference Include="Castle.Core">
      <HintPath>..\\..\\..\\..\\..\\lib\\castle.core\\net45\\Castle.Core.dll</HintPath>
    </Reference>
    <Reference Include="Castle.Windsor">
      <HintPath>..\\..\\..\\..\\..\\lib\\castle.windsor\\net45\\Castle.Windsor.dll</HintPath>
    </Reference>
    <Reference Include="ESRI.ArcGIS.Carto, Version=10.8.0.0, Culture=neutral, PublicKeyToken=8fc3cc631e44ad86, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <EmbedInteropTypes>False</EmbedInteropTypes>
      <Private>False</Private>
    </Reference>
    <Reference Include="ESRI.ArcGIS.Geodatabase, Version=10.8.0.0, Culture=neutral, PublicKeyToken=8fc3cc631e44ad86, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <EmbedInteropTypes>False</EmbedInteropTypes>
      <Private>False</Private>
    </Reference>
    <Reference Include="ESRI.ArcGIS.Geometry, Version=10.8.0.0, Culture=neutral, PublicKeyToken=8fc3cc631e44ad86, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <EmbedInteropTypes>False</EmbedInteropTypes>
      <Private>False</Private>
    </Reference>
    <Reference Include="ESRI.ArcGIS.Server, Version=10.8.0.0, Culture=neutral, PublicKeyToken=8fc3cc631e44ad86, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <EmbedInteropTypes>False</EmbedInteropTypes>
      <Private>False</Private>
    </Reference>
    <Reference Include="ESRI.ArcGIS.SOESupport, Version=10.8.0.0, Culture=neutral, PublicKeyToken=8fc3cc631e44ad86, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <Private>False</Private>
    </Reference>
    <Reference Include="ESRI.ArcGIS.System, Version=10.8.0.0, Culture=neutral, PublicKeyToken=8fc3cc631e44ad86, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <EmbedInteropTypes>False</EmbedInteropTypes>
      <Private>False</Private>
    </Reference>
    <Reference Include="Shared.Common, Version=10.8.1.0, Culture=neutral, PublicKeyToken=d67685bd2ec165ce, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <HintPath>..\\..\\..\\..\\..\\common\\bin\\$(Configuration)\\net472\\Shared.Common.dll</HintPath>
    </Reference>
    <Reference Include="Newtonsoft.Json, Version=13.0.0.0, Culture=neutral, PublicKeyToken=30ad4fe6b2a6aeed" />
    <Reference Include="System" />
    <Reference Include="System.Core" />
    <Reference Include="Microsoft.CSharp" />
    <Reference Include="System.Xml" />
    <Reference Include="Wgis, Version=10.8.1.0, Culture=neutral, PublicKeyToken=2a399531d6da93f9, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <HintPath>..\\..\\..\\..\\common\\bin\\$(Configuration)\\Wgis.dll</HintPath>
    </Reference>
  </ItemGroup>
  <ItemGroup>
    <Compile Include="NullRestRequestHandler.cs" />
    <Compile Include="RestResourceBuilder.cs" />
    <Compile Include="ServicesInstaller.cs" />
    <Compile Include="WgisSoe.cs" />
    <Compile Include="Properties\\AssemblyInfo.cs" />
  </ItemGroup>
  <ItemGroup>
    <None Include="..\\..\\..\\..\\sign\\wgisKey.snk" />
    <None Include="packages.config" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\\Wgis.Soe.Authorization\\Wgis.Soe.Authorization.csproj">
      <Project>{0A28C0EA-19AB-42F7-819E-2A00D4561C78}</Project>
      <Name>Wgis.Soe.Authorization</Name>
    </ProjectReference>
    <ProjectReference Include="..\\Wgis.Soe.Common\\Wgis.Soe.Common.csproj">
      <Project>{595570af-4f08-4a59-88f6-079b83534110}</Project>
      <Name>Wgis.Soe.Common</Name>
    </ProjectReference>
  </ItemGroup>
  <PropertyGroup>
    <ZipFileExtension>soe</ZipFileExtension>
    <AddInTargetProduct>Server</AddInTargetProduct>
    <AddInTargetVersion>10.7</AddInTargetVersion>
  </PropertyGroup>
  <Import Project="$(MSBuildToolsPath)\\Microsoft.CSharp.targets" />
  <Target Name="EnsureNuGetPackageBuildImports" BeforeTargets="PrepareForBuild">
    <PropertyGroup>
      <ErrorText>This project references NuGet package(s) that are missing on this computer. Use NuGet Package Restore to download them.  For more information, see http://go.microsoft.com/fwlink/?LinkID=322105. The missing file is {0}.</ErrorText>
    </PropertyGroup>
    <Error Condition="!Exists('..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.props')" Text="$([System.String]::Format('$(ErrorText)', '..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.props'))" />
    <Error Condition="!Exists('..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.targets')" Text="$([System.String]::Format('$(ErrorText)', '..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.targets'))" />
  </Target>
  <Import Project="..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.targets" Condition="Exists('..\\packages\\GitVersion.MsBuild.5.12.0\\build\\GitVersion.MsBuild.targets')" />
  <!--
  <Import Project="$(MSBuildExtensionsPath)\\ESRI\\ESRI.ArcGIS.Server.SDK.targets" Condition="Exists('$(MSBuildExtensionsPath)\\ESRI\\ESRI.ArcGIS.Server.SDK.targets')" />
  -->
  <!-- To modify your build process, add your task inside one of the targets below and uncomment it.
       Other similar extension points exist, see Microsoft.Common.targets.
  <Target Name="BeforeBuild">
  </Target>
  <Target Name="AfterBuild">
  </Target>
  -->
</Project>`;

/** Line categories in legacyCsproj (1-based) — they show as coloured stripes on the "wall". */
export const legacyMarks = [
  '42,45,78,87=c-hint',
  '47-75=c-esri',
  '91-95=c-compile',
  '3,16-17,99,117-124=c-nuget',
  '4-39=c-cfg',
  '36-39,98=c-sign',
  '102-109=c-guid',
].join(';');

/** Same file at HEAD — 7 lines. */
export const modernCsproj = `<Project Sdk="Microsoft.NET.Sdk">

  <ItemGroup>
    <ProjectReference Include="..\\Wgis.Soe.Authorization\\Wgis.Soe.Authorization.csproj" />
  </ItemGroup>

</Project>`;

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

/** build/SoeArchiveBuilder.cs (excerpt). */
export const repack = `// Our own assemblies are merged into the SOE's DLL; Castle, Newtonsoft,
// NLog, RestSharp, ... ship beside it in Install/.
static readonly string[] MergedAssemblyPrefixes = ["Shared.", "Wgis."];

new ILRepack(new RepackOptions {
    OutputFile = outputAssemblyPath,        // Wgis.Soe.dll, named after the SOE
    InputAssemblies = repackedAssemblyPaths.ToArray(),
    Parallel = true,
}).Repack();`;

/** Wgis.WebServices.Docs/ArcGisOpenApiDocumentationProvider.cs (excerpt). */
export const openApiProbe = `var schema = await client.GetFromJsonAsync<ArcGisResourceInfo>(
    WithToken($"{serviceUrl}/exts/{name}?f=schema", token), ct);
if (schema?.Resources is { Count: > 0 })
    extensions.Add(new ArcGisExtension(name, schema));`;

/** Legacy BuildSOE XML — 81 hand-listed files. */
export const addFiles = `<addFile source="%CHECKOUT_DIR%\\lib\\castle.core\\net45\\Castle.Core.dll"/>
<addFile source="%CHECKOUT_DIR%\\cetin\\arcgisserver\\bin\\debug\\Wgis.Soe.Carto.dll"/>
<addFile source="%CHECKOUT_DIR%\\cetin\\arcgisserver\\bin\\debug\\Wgis.Soe.Carto.pdb"/>`;

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
