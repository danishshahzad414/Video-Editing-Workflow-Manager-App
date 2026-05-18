@echo off
title CutDesk Auto-Commit Watcher
rem Replace YOUR_GITHUB_TOKEN below with your actual GitHub PAT (classic token with repo scope)
powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0auto-commit.ps1" -Token "YOUR_GITHUB_TOKEN"
pause
