@echo off
cd /d "%~dp0"
if not exist out mkdir out
javac -d out src\main\java\Main.java
if errorlevel 1 pause & exit /b 1
java -cp out Main
pause
