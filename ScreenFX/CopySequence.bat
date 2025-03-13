@echo off
setlocal ENABLEDELAYEDEXPANSION

set "output_dir=D:\1Data\2zsz\Vitae\TuSimple\Sequence\Test"

set "full_path=%1"
set "file_name=%~n1"
set "file_path=%~dp1"

echo full path: "%full_path%"
echo file name: "%file_name%"
echo file path: "%file_path%"

set i=-1
:loop
if "!file_name:~%i%,1!"=="_" goto endloop
set /a i-=1
goto loop
:endloop

rem echo %i%
set "folder_name=!file_name:~0,%i%!"
set "folder_path=%output_dir%\%folder_name%"
echo folder name = "%folder_name%"
echo folder path = "%folder_path%"

if not exist "%folder_path%" mkdir "%folder_path%"

copy %file_path%\%folder_name%_*.png %folder_path%

pause