[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'setup.ps1')

# Do not share generated image files with a concurrently running dev server.
$buildResourceDir = Join-Path $toolsRoot 'generated-resources\build'
New-Item -ItemType Directory -Path $buildResourceDir -Force | Out-Null
$env:HUGO_RESOURCEDIR = $buildResourceDir

& $hugoExe --gc --minify --noBuildLock
exit $LASTEXITCODE
