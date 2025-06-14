# Deployment script for stairs-calculator
# Make sure to run this script from the project root directory

# Configuration
$SERVER = "frog01.mikr.us"
$PORT = "10564"
$USER = "frog"
$REMOTE_NGINX_CONF = "/etc/nginx/http.d/stairs.conf"
$REMOTE_TEMP_NGINX_CONF = "/tmp/stairs.conf"
$REMOTE_APP_DIR = "/home/frog/stairs"
$LOCAL_BUILD_DIR = ".\build"
$LOCAL_NGINX_CONF = ".\nginx.conf"
$password = "3S8JZS4pk2"

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$DebugColor = "Yellow"
$CommandColor = "Magenta"

# Function to write colored output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Check if node_modules exists
if (-not (Test-Path ".\node_modules")) {
    Write-ColorOutput $InfoColor "Installing dependencies..."
    Write-ColorOutput $CommandColor "npm ci"
    $installResult = npm ci 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $ErrorColor "Failed to install dependencies"
        Write-ColorOutput $ErrorColor $installResult
        exit 1
    }
    Write-ColorOutput $SuccessColor "Dependencies installed successfully"
}

# Build the application
Write-ColorOutput $InfoColor "Building application..."
Write-ColorOutput $CommandColor "npm run build"
$env:NODE_ENV = "production"
$buildResult = npm run build 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $ErrorColor "Failed to build application"
    Write-ColorOutput $ErrorColor $buildResult
    exit 1
}

# Verify build directory exists and contains files
if (-not (Test-Path $LOCAL_BUILD_DIR)) {
    Write-ColorOutput $ErrorColor "Build directory not found at $LOCAL_BUILD_DIR"
    exit 1
}

$buildFiles = Get-ChildItem $LOCAL_BUILD_DIR -File
if ($buildFiles.Count -eq 0) {
    Write-ColorOutput $ErrorColor "Build directory is empty"
    exit 1
}

Write-ColorOutput $SuccessColor "Build completed successfully"

# Deploy build files
Write-ColorOutput $InfoColor "Deploying build files..."
Write-ColorOutput $CommandColor "pscp -P $PORT -pw **** -r $LOCAL_BUILD_DIR ${USER}@${SERVER}:${REMOTE_APP_DIR}"
$buildResult = pscp -P $PORT -pw $password -r $LOCAL_BUILD_DIR "${USER}@${SERVER}:${REMOTE_APP_DIR}"
Write-ColorOutput $DebugColor $buildResult

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $ErrorColor "Failed to deploy build files"
    Write-ColorOutput $ErrorColor $buildResult
    exit 1
}

Write-ColorOutput $SuccessColor "Deployment completed successfully"