@echo off
cls
setlocal EnableDelayedExpansion

:: Initialize the game parameters
set ROWS=5
set COLS=5
set MINE_COUNT=5
set FLAG_COUNT=0

:: Initialize grid (5x5) for minefield
for /L %%r in (1,1,%ROWS%) do (
    for /L %%c in (1,1,%COLS%) do (
        set "grid[%%r,%%c]=0"  :: 0 means empty
    )
)

:: Place mines randomly on the grid
for /L %%i in (1,1,%MINE_COUNT%) do (
    set /A "r=!random! %% %ROWS% + 1"
    set /A "c=!random! %% %COLS% + 1"
    set "grid[!r!,!c!]=X"  :: X means mine
)

:: Count adjacent mines for each cell
for /L %%r in (1,1,%ROWS%) do (
    for /L %%c in (1,1,%COLS%) do (
        if "!grid[%%r,%%c]!"=="X" (
            :: Check adjacent cells and increment their value
            for /L %%dr in (-1,0,1) do (
                for /L %%dc in (-1,0,1) do (
                    set /A "nr=%%r+%%dr"
                    set /A "nc=%%c+%%dc"
                    if !nr! geq 1 if !nr! leq %ROWS% if !nc! geq 1 if !nc! leq %COLS% (
                        if "!grid[!nr!,!nc!]!" neq "X" (
                            set /A "adjacent[!nr!,!nc!] += 1"
                        )
                    )
                )
            )
        )
    )
)

:: Main game loop
:gameLoop
cls
echo Minesweeper - 5x5 Grid
echo ============================
echo Rows and Columns: 1-5
echo Mines: %MINE_COUNT%  Flags: %FLAG_COUNT%
echo.

:: Display the current state of the grid
for /L %%r in (1,1,%ROWS%) do (
    set "row="
    for /L %%c in (1,1,%COLS%) do (
        if "!grid[%%r,%%c]!"=="0" (
            set "row=!row! [ ]"
        ) else if "!grid[%%r,%%c]!"=="X" (
            set "row=!row! [X]"
        ) else (
            set "row=!row! [!adjacent[%%r,%%c]!]"
        )
    )
    echo !row!
)

:: Player input to select a cell to reveal
set /p "row=Enter row (1-5): "
set /p "col=Enter column (1-5): "

:: Check if the selected cell has a mine
if "!grid[%row%,%col%]!"=="X" (
    echo BOOM! You hit a mine.
    pause
    goto :endGame
)

:: Reveal the cell
if "!grid[%row%,%col%]!"=="0" (
    set "grid[%row%,%col%]=!adjacent[%row%,%col%]!"
)

:: Check if player has cleared all non-mine cells
set /A "revealed=0"
for /L %%r in (1,1,%ROWS%) do (
    for /L %%c in (1,1,%COLS%) do (
        if "!grid[%%r,%%c]!" neq "X" if "!grid[%%r,%%c]!" neq "0" (
            set /A "revealed+=1"
        )
    )
)

set /A "totalCells=%ROWS% * %COLS% - %MINE_COUNT%"
if !revealed! equ !totalCells! (
    echo Congratulations! You've cleared the minefield.
    pause
    goto :endGame
)

goto gameLoop

:endGame
echo Game Over!
pause
exit
