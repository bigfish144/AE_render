@echo off
chcp 65001
setlocal enabledelayedexpansion

:: 设置生成的视频文件存放的目录
set "output_dir=output"

:: 创建输出目录（如果不存在）
if not exist "%output_dir%" mkdir "%output_dir%"

:: 遍历当前目录下的所有文件夹
for /d %%f in (*) do (
    :: 当前文件夹名称
    set "folder_name=%%~nxf"
    echo 处理文件夹："!folder_name!"

    ::获取第一个png文件
    set first_png_file=-1
    set l=0
    for %%i in ("%%f\*.png") do (
        if !l!==0 (
            set first_png_file=%%~ni
            set l=1
        )
    )
    
    :: 若有png文件
    if not !first_png_file!==-1 (
        echo 第一个png文件名为："!first_png_file!"
        set l=0
        for /l %%k in (-1,-1,-50) do (
            if !l!==0 (
                if "!first_png_file:~%%k,1!"=="_" set j=%%k & set l=1
                if "!first_png_file:~%%k,1!"=="" set j=-1 & set l=1
            )
        )

        :: 若找到下划线
        if not !j!==-1 (
            set /a j=!j!*-1-1

            set "output_file=%output_dir%\!folder_name!.mov"
            set "format=%%0!j!d"
            echo 格式码为："!format!"

            :: 执行 ffmpeg 命令
            ffmpeg -r 30 -f image2 -i "%%f\!folder_name!_!format!.png" -vcodec png "!output_file!" -y

            echo 处理完成: "!output_file!"
        ) else echo 未找到下划线
    ) else echo 无png文件
    echo.
)
pause
