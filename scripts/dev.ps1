[CmdletBinding()]
param(
  [ValidateRange(1, 65535)]
  [int] $Port = 1313,

  [switch] $BuildDrafts
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'setup.ps1')

$portProbe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
try {
  $portProbe.Start()
}
catch {
  throw "Port $Port is already in use. Stop the existing Hugo server or choose another port with -Port."
}
finally {
  $portProbe.Stop()
}

# Keep generated images isolated from other Hugo processes on Windows.
$developmentResourceDir = Join-Path $toolsRoot "generated-resources\dev-$Port"
New-Item -ItemType Directory -Path $developmentResourceDir -Force | Out-Null
$env:HUGO_RESOURCEDIR = $developmentResourceDir

$hugoArgs = @(
  'server'
  '--port', $Port
  '--disableFastRender'
  '--noHTTPCache'
  '--noBuildLock'
)
if ($BuildDrafts) {
  $hugoArgs += '--buildDrafts'
}

Write-Host "Starting local site at http://localhost:$Port/"
& $hugoExe @hugoArgs
exit $LASTEXITCODE
