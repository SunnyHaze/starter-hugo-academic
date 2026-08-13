[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$goVersion = '1.21.13'
$hugoVersion = '0.119.0'
$repoRoot = Split-Path -Parent $PSScriptRoot
$toolsRoot = Join-Path $repoRoot '.local-tools'
$cacheRoot = Join-Path $repoRoot '.cache'
$goRoot = Join-Path $toolsRoot "go-$goVersion"
$goHome = Join-Path $goRoot 'go'
$goExe = Join-Path $goHome 'bin\go.exe'
$hugoHome = Join-Path $toolsRoot "hugo-$hugoVersion"
$hugoExe = Join-Path $hugoHome 'hugo.exe'

if ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -ne 'X64') {
  throw 'The local bootstrap script currently supports Windows x64 only.'
}

function Install-ZipTool {
  param(
    [Parameter(Mandatory)] [string] $Name,
    [Parameter(Mandatory)] [string] $Url,
    [Parameter(Mandatory)] [string] $Destination,
    [Parameter(Mandatory)] [string] $ExpectedExecutable
  )

  if (Test-Path -LiteralPath $ExpectedExecutable) {
    return
  }

  New-Item -ItemType Directory -Path $Destination -Force | Out-Null
  $archive = Join-Path ([System.IO.Path]::GetTempPath()) "starter-hugo-academic-$Name-$PID.zip"

  try {
    Write-Host "Downloading $Name..."
    & curl.exe -L --fail --silent --show-error $Url --output $archive
    if ($LASTEXITCODE -ne 0) {
      throw "Unable to download $Name (curl exit code $LASTEXITCODE)."
    }
    Expand-Archive -LiteralPath $archive -DestinationPath $Destination -Force
  }
  finally {
    if (Test-Path -LiteralPath $archive) {
      Remove-Item -LiteralPath $archive -Force
    }
  }

  if (-not (Test-Path -LiteralPath $ExpectedExecutable)) {
    throw "$Name was downloaded, but its executable was not found at $ExpectedExecutable."
  }
}

New-Item -ItemType Directory -Path $toolsRoot, $cacheRoot -Force | Out-Null

Install-ZipTool `
  -Name "Go-$goVersion" `
  -Url "https://go.dev/dl/go$goVersion.windows-amd64.zip" `
  -Destination $goRoot `
  -ExpectedExecutable $goExe

Install-ZipTool `
  -Name "Hugo-Extended-$hugoVersion" `
  -Url "https://github.com/gohugoio/hugo/releases/download/v$hugoVersion/hugo_extended_${hugoVersion}_windows-amd64.zip" `
  -Destination $hugoHome `
  -ExpectedExecutable $hugoExe

$env:GOROOT = $goHome
$env:GOMODCACHE = Join-Path $cacheRoot 'go-mod'
$env:GOCACHE = Join-Path $cacheRoot 'go-build'
$env:HUGO_CACHEDIR = Join-Path $cacheRoot 'hugo'
$env:PATH = "$($goHome)\bin;$hugoHome;$env:PATH"

New-Item -ItemType Directory -Path $env:GOMODCACHE, $env:GOCACHE, $env:HUGO_CACHEDIR -Force | Out-Null

Write-Host (& $goExe version)
Write-Host (& $hugoExe version)
