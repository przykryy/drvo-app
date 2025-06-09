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

# Function to execute remote command with sudo
function Invoke-RemoteSudoCommand {
    param (
        [string]$Command,
        [string]$Description
    )
    Write-ColorOutput $InfoColor $Description
    $result = ssh -p $PORT "${USER}@${SERVER}" "sudo $Command 2>&1"
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $ErrorColor "Command failed: $Command"
        Write-ColorOutput $ErrorColor "Error output: $result"
        return $false
    }
    return $true
}

# Register cleanup on script exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup-TempFiles }

# Check if required files exist
if (-not (Test-Path $LOCAL_BUILD_DIR)) {
    Write-ColorOutput $ErrorColor "Error: Build directory not found at $LOCAL_BUILD_DIR"
    Write-ColorOutput $InfoColor "Please run 'npm run build' first"
    Cleanup-TempFiles
    exit 1
}

if (-not (Test-Path $LOCAL_NGINX_CONF)) {
    Write-ColorOutput $ErrorColor "Error: nginx.conf not found at $LOCAL_NGINX_CONF"
    Cleanup-TempFiles
    exit 1
}

# Check if pscp is available
try {
    $null = Get-Command pscp -ErrorAction Stop
}
catch {
    Write-ColorOutput $ErrorColor "Error: pscp not found. Please install PuTTY tools and add to PATH"
    Write-ColorOutput $InfoColor "Download from: https://www.putty.org/"
    Cleanup-TempFiles
    exit 1
}

Write-ColorOutput $InfoColor "Starting deployment..."

# Show local nginx.conf contents for verification
Write-ColorOutput $DebugColor "Local nginx.conf contents:"
Get-Content $LOCAL_NGINX_CONF | ForEach-Object { Write-ColorOutput $DebugColor $_ }

# Deploy Nginx configuration to temp location first
Write-ColorOutput $InfoColor "Deploying Nginx configuration to temp location..."
$nginxResult = pscp -P $PORT -pw $password $LOCAL_NGINX_CONF "${USER}@${SERVER}:${REMOTE_TEMP_NGINX_CONF}"
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $ErrorColor "Failed to deploy Nginx configuration to temp location"
    Write-ColorOutput $ErrorColor $nginxResult
    exit 1
}

# Verify temp file exists and show its contents
Write-ColorOutput $InfoColor "Verifying temporary file..."
$checkTemp = ssh -p $PORT "${USER}@${SERVER}" "ls -l ${REMOTE_TEMP_NGINX_CONF}"
Write-ColorOutput $InfoColor "Temp file details: $checkTemp"
Write-ColorOutput $DebugColor "Temp file contents:"
$tempContents = ssh -p $PORT "${USER}@${SERVER}" "cat ${REMOTE_TEMP_NGINX_CONF}"
Write-ColorOutput $DebugColor $tempContents

# Move Nginx configuration to final location with sudo (step by step)
Write-ColorOutput $InfoColor "Moving Nginx configuration to final location..."

# Step 1: Remove existing config if it exists
if (-not (Invoke-RemoteSudoCommand -Command "rm -f ${REMOTE_NGINX_CONF}" -Description "Removing existing config file...")) {
    exit 1
}

# Step 2: Move the file
if (-not (Invoke-RemoteSudoCommand -Command "mv ${REMOTE_TEMP_NGINX_CONF} ${REMOTE_NGINX_CONF}" -Description "Moving file to final location...")) {
    exit 1
}

# Step 3: Set ownership
if (-not (Invoke-RemoteSudoCommand -Command "chown root:root ${REMOTE_NGINX_CONF}" -Description "Setting file ownership...")) {
    exit 1
}

# Step 4: Set permissions
if (-not (Invoke-RemoteSudoCommand -Command "chmod 644 ${REMOTE_NGINX_CONF}" -Description "Setting file permissions...")) {
    exit 1
}

# Verify final file
Write-ColorOutput $InfoColor "Verifying final configuration file..."
$checkFinal = ssh -p $PORT "${USER}@${SERVER}" "ls -l ${REMOTE_NGINX_CONF}"
Write-ColorOutput $InfoColor "Final file details: $checkFinal"
Write-ColorOutput $DebugColor "Final file contents:"
$finalContents = ssh -p $PORT "${USER}@${SERVER}" "sudo cat ${REMOTE_NGINX_CONF}"
Write-ColorOutput $DebugColor $finalContents

# Deploy build files
Write-ColorOutput $InfoColor "Deploying build files..."
$buildResult = pscp -P $PORT -pw $password -r $LOCAL_BUILD_DIR "${USER}@${SERVER}:${REMOTE_APP_DIR}"
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $ErrorColor "Failed to deploy build files"
    Write-ColorOutput $ErrorColor $buildResult
    exit 1
}

# Verify Nginx configuration with detailed output
Write-ColorOutput $InfoColor "Verifying Nginx configuration..."
Write-ColorOutput $DebugColor "Running nginx -t with full output:"
$verifyResult = ssh -p $PORT "${USER}@${SERVER}" "sudo nginx -T 2>&1"
Write-ColorOutput $DebugColor $verifyResult

$testResult = ssh -p $PORT "${USER}@${SERVER}" "sudo nginx -t 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $ErrorColor "Nginx configuration test failed"
    Write-ColorOutput $ErrorColor "Test output: $testResult"
    Write-ColorOutput $InfoColor "Checking Nginx error log for more details..."
    $errorLog = ssh -p $PORT "${USER}@${SERVER}" "sudo tail -n 50 /var/log/nginx/error.log"
    Write-ColorOutput $ErrorColor "Recent Nginx error log entries:"
    Write-ColorOutput $ErrorColor $errorLog
    exit 1
}

# Reload Nginx
Write-ColorOutput $InfoColor "Reloading Nginx..."
$reloadResult = ssh -p $PORT "${USER}@${SERVER}" "sudo systemctl reload nginx 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput $ErrorColor "Failed to reload Nginx"
    Write-ColorOutput $ErrorColor $reloadResult
    exit 1
}

Write-ColorOutput $SuccessColor "Deployment completed successfully!"
Write-ColorOutput $InfoColor "Your applications should now be available at:"
Write-ColorOutput $InfoColor "- drvo: https://frog01-20564.wykr.es/"
Write-ColorOutput $InfoColor "- schody: https://frog01-30564.wykr.es/" 