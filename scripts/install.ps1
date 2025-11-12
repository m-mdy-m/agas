# Install script for Windows

$ErrorActionPreference = "Stop"

# Configuration
$Repo = "m-mdy-m/agas"
$InstallDir = "$env:LOCALAPPDATA\agas"
$BinaryName = "agas.exe"

# Colors
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Detect architecture
function Get-Architecture {
    $arch = $env:PROCESSOR_ARCHITECTURE
    if ($arch -eq "AMD64") {
        return "x64"
    }
    elseif ($arch -eq "ARM64") {
        return "arm64"
    }
    else {
        Write-ColorOutput Red "❌ Unsupported architecture: $arch"
        exit 1
    }
}

# Get latest version
function Get-LatestVersion {
    Write-ColorOutput Blue "🔍 Getting latest version..."
    
    $apiUrl = "https://api.github.com/repos/$Repo/releases/latest"
    $response = Invoke-RestMethod -Uri $apiUrl
    $version = $response.tag_name -replace '^v', ''
    
    Write-ColorOutput Blue "📦 Latest version: v$version"
    return $version
}

# Download binary
function Download-Binary($version, $arch) {
    $archiveName = "agas-v$version-windows-$arch.zip"
    $downloadUrl = "https://github.com/$Repo/releases/download/v$version/$archiveName"
    
    Write-ColorOutput Blue "⬇️  Downloading $archiveName..."
    
    $tmpDir = New-Item -ItemType Directory -Path "$env:TEMP\agas-install-$(Get-Random)"
    $archivePath = Join-Path $tmpDir $archiveName
    
    Invoke-WebRequest -Uri $downloadUrl -OutFile $archivePath
    
    Write-ColorOutput Green "✅ Downloaded successfully"
    return $tmpDir, $archivePath
}

# Install binary
function Install-Binary($tmpDir, $archivePath) {
    Write-ColorOutput Blue "📦 Installing binary..."
    
    # Create install directory
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    
    # Extract archive
    Expand-Archive -Path $archivePath -DestinationPath $tmpDir -Force
    
    # Find binary
    $binaryPath = Get-ChildItem -Path $tmpDir -Filter "agas-windows-*.exe" | Select-Object -First 1
    
    # Move binary
    $targetPath = Join-Path $InstallDir $BinaryName
    Move-Item -Path $binaryPath.FullName -Destination $targetPath -Force
    
    # Cleanup
    Remove-Item -Path $tmpDir -Recurse -Force
    
    Write-ColorOutput Green "✅ Installed to $targetPath"
}

# Add to PATH
function Add-ToPath {
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($currentPath -notlike "*$InstallDir*") {
        Write-ColorOutput Blue "📝 Adding to PATH..."
        
        $newPath = "$currentPath;$InstallDir"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        
        Write-ColorOutput Yellow "⚠️  Please restart your terminal for PATH changes to take effect"
    }
    else {
        Write-ColorOutput Green "✅ Already in PATH"
    }
}

# Main
function Main {
    Write-ColorOutput Blue @"
     █████╗  ██████╗  █████╗ ███████╗
    ██╔══██╗██╔════╝ ██╔══██╗██╔════╝
    ███████║██║  ███╗███████║███████╗
    ██╔══██║██║   ██║██╔══██║╚════██║
    ██║  ██║╚██████╔╝██║  ██║███████║
    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
    
    Installation Script
"@
    
    $arch = Get-Architecture
    Write-ColorOutput Blue "🔍 Detected architecture: $arch"
    
    $version = Get-LatestVersion
    $tmpDir, $archivePath = Download-Binary $version $arch
    Install-Binary $tmpDir $archivePath
    Add-ToPath
    
    Write-Host ""
    Write-ColorOutput Green "🎉 Installation complete!"
    Write-Host ""
    Write-Host "Run 'agas --help' to get started"
    Write-Host ""
}

Main
