# ─────────────────────────────────────────────────────────────────────────────
# CutDesk Auto-Commit Watcher
# Watches the project for file changes and auto-commits + pushes to GitHub
# Usage: .\auto-commit.ps1 -Token "YOUR_GITHUB_TOKEN"
# ─────────────────────────────────────────────────────────────────────────────

param(
    [Parameter(Mandatory=$false)]
    [string]$Token = "",
    [string]$RepoPath = "D:\Danish Shahzad\Claude Code",
    [string]$RemoteUser = "danishshahzad414",
    [string]$RemoteRepo = "Video-Editing-Workflow-Manager-App",
    [int]$DebounceSeconds = 5
)

# If token not passed, try to read from env
if (-not $Token) { $Token = $env:GITHUB_TOKEN }
if (-not $Token) {
    Write-Host "ERROR: No GitHub token provided. Run with: .\auto-commit.ps1 -Token 'your_token'" -ForegroundColor Red
    exit 1
}

$RemoteUrl = "https://${RemoteUser}:${Token}@github.com/${RemoteUser}/${RemoteRepo}.git"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  CutDesk Auto-Commit Watcher" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Watching: $RepoPath" -ForegroundColor White
Write-Host "  Remote:   github.com/$RemoteUser/$RemoteRepo" -ForegroundColor White
Write-Host "  Debounce: ${DebounceSeconds}s after last change" -ForegroundColor White
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Update remote URL with token
Set-Location $RepoPath
git remote set-url origin $RemoteUrl 2>$null

$LastChange = $null
$PendingCommit = $false
$Timer = $null

function Invoke-AutoCommit {
    Set-Location $RepoPath

    # Check if there are any changes
    $status = git status --porcelain 2>&1
    if (-not $status) {
        Write-Host "  [$(Get-Date -Format 'HH:mm:ss')] No changes to commit" -ForegroundColor Gray
        return
    }

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $changedFiles = ($status | Measure-Object -Line).Lines

    Write-Host "  [$(Get-Date -Format 'HH:mm:ss')] Committing $changedFiles change(s)..." -ForegroundColor Yellow

    git add -A 2>&1 | Out-Null
    $commitMsg = "auto: save changes at $timestamp"
    git commit -m $commitMsg 2>&1 | Out-Null

    Write-Host "  [$(Get-Date -Format 'HH:mm:ss')] Pushing to main..." -ForegroundColor Yellow
    $pushResult = git push origin HEAD:main 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [$(Get-Date -Format 'HH:mm:ss')] ✓ Pushed successfully" -ForegroundColor Green
    } else {
        Write-Host "  [$(Get-Date -Format 'HH:mm:ss')] ✗ Push failed: $pushResult" -ForegroundColor Red
    }
}

# Set up FileSystemWatcher
$Watcher = New-Object System.IO.FileSystemWatcher
$Watcher.Path = $RepoPath
$Watcher.IncludeSubdirectories = $true
$Watcher.EnableRaisingEvents = $true
$Watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

# Ignore patterns
$IgnorePatterns = @(
    '\.git\',
    'node_modules\',
    '\dist\',
    '\.next\',
    '\.vite\',
    'auto-commit.ps1'
)

$Action = {
    $path = $Event.SourceEventArgs.FullPath

    # Skip ignored paths
    foreach ($pattern in $IgnorePatterns) {
        if ($path -like "*$pattern*") { return }
    }

    $global:LastChange = Get-Date
    $global:PendingCommit = $true
}

Register-ObjectEvent $Watcher Changed -Action $Action | Out-Null
Register-ObjectEvent $Watcher Created -Action $Action | Out-Null
Register-ObjectEvent $Watcher Deleted -Action $Action | Out-Null
Register-ObjectEvent $Watcher Renamed -Action $Action | Out-Null

Write-Host "  Watcher started. Waiting for file changes..." -ForegroundColor Green
Write-Host ""

# Main polling loop with debounce
try {
    while ($true) {
        Start-Sleep -Milliseconds 500

        if ($global:PendingCommit -and $global:LastChange) {
            $elapsed = (Get-Date) - $global:LastChange
            if ($elapsed.TotalSeconds -ge $DebounceSeconds) {
                $global:PendingCommit = $false
                $global:LastChange = $null
                Invoke-AutoCommit
            }
        }
    }
} finally {
    $Watcher.EnableRaisingEvents = $false
    $Watcher.Dispose()
    Get-EventSubscriber | Unregister-Event
    Write-Host ""
    Write-Host "  Watcher stopped." -ForegroundColor Yellow
}
