@echo off
:: This Batch file runs the Poker game using Node.js

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org.
    pause
    exit /b
)

:: Run the Poker game script using Node.js
echo Running Poker game...
node poker.js

:: Pause to keep the window open after the game ends
pause
