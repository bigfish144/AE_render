import os
import subprocess
import time
import psutil

ae_exe = r"C:\Program Files\Adobe\Adobe After Effects 2024\Support Files\AfterFX.exe"  # AE 主应用程序路径
jsx_script = r"C:\wudanni\AE_scripts\alert.jsx"  # .jsx 脚本路径# 运行插件
command = [ae_exe, "-r", jsx_script]
try:
    print("Running After Effects with JSX script...")
    result = subprocess.run(
        command,
        check=True,
        capture_output=True,
        text=True,
        env=os.environ.copy() 
    )
    print("JSX script executed successfully.")
except subprocess.CalledProcessError as e:
    print(f"An error occurred while executing the JSX script: {e}")
