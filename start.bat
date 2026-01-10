@echo off
TITLE AI ChatBot - Masha
echo Checking dependencies...

IF NOT EXIST "node_modules\" (
    echo node_modules folder not found. Installing dependencies...
    call npm install
) ELSE (
    echo Dependencies are already installed.
)

echo Starting the application...
call npm start
pause