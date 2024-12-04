@echo off
setlocal enabledelayedexpansion

:: Set your Groq API key here
set "GROQ_API_KEY=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"

:: Groq API endpoint
set "API_URL=https://api.groq.ai/v1/completions"

:: Chatbot loop
echo Welcome to the Groq AI Chatbot!
echo Type "exit" to quit.

:chatloop
set /p user_input=You: 

:: Exit if the user types "exit"
if /i "%user_input%"=="exit" goto end

:: Call the Groq API with the user input and get a response
curl -X POST "%API_URL%" ^
    -H "Authorization: Bearer %GROQ_API_KEY%" ^
    -H "Content-Type: application/json" ^
    -d "{\"model\":\"llama3-8b-8192\", \"messages\":[{\"role\":\"user\", \"content\":\"%user_input%\"}]}" ^
    > response.json

:: Parse the JSON response manually (using string manipulation)
set response=""
for /f "tokens=1* delims=:" %%a in ('findstr /i "content" response.json') do (
    set temp=%%b
    set temp=!temp:~2,-2!
    set response=!temp!
)

:: If response is empty, output error message
if "!response!"=="" set response=Sorry, I didn’t get that.

:: Display the chatbot's response
echo Groq AI: !response!

:: Repeat the chat loop
goto chatloop

:end
echo Thank you for chatting with Groq AI!
pause
