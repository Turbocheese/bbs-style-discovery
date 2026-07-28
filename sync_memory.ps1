# ==============================================================================
# NotebookLM Memory Sync Automation
# ==============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Starting NotebookLM Memory Sync Script " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Define paths relative to current workspace
$scriptPath = "scripts/notebooklm_refresh.py"

# 2. Check if the refresh script exists
if (-not (Test-Path $scriptPath)) {
    Write-Host "[ERROR] Could not find '$scriptPath'." -ForegroundColor Red
    Write-Host "Make sure you are in the project root directory and the file exists." -ForegroundColor Yellow
    exit 1
}

# 3. Check if Python is installed/available
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "[ERROR] Python is not found in your PATH." -ForegroundColor Red
    Write-Host "Please install Python or ensure it is added to your environment variables." -ForegroundColor Yellow
    exit 1
}

# 4. Execute the Python sync script
Write-Host "[INFO] Executing Python refresh script..." -ForegroundColor Green
Write-Host ""

try {
    python $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host " [SUCCESS] NotebookLM Sync Completed!   " -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "[WARNING] Script finished with non-zero exit code: $LASTEXITCODE" -ForegroundColor Yellow
    }
}
catch {
    Write-Host ""
    Write-Host "[ERROR] An exception occurred while running the script:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}