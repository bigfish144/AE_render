import os
import subprocess
import time
import psutil
import pygetwindow as gw 
# 配置路径
aep_file_path = r'C:\Users\admin\Downloads\cloud.aep' 
ae_exe2 = r"C:\Program Files\Adobe\Adobe After Effects 2024\Support Files\AfterFX.exe"  
ae_exe = r"C:\Program Files\Adobe\Adobe After Effects 2024\Support Files\AfterFX"  
jsx_script = r"C:\wudanni\resources\SpecialEffects\AE_scripts\getvalue(1).jsx" 
save_and_close_script = r"C:\wudanni\resources\SpecialEffects\AE_scripts\save_and_close.jsx"  

# 打开 .aep 文件
open_command = [ae_exe2, aep_file_path]
print(f"Opening {aep_file_path} ...")
ae_process = subprocess.Popen(open_command)

# 延时确保项目加载完成
print(f"Waiting to ensure the project is fully loaded...")
time.sleep(1)

def is_ae_interface_loaded():
    windows = gw.getAllTitles()  # 获取所有窗口标题
    for window_title in windows:
        if "Adobe After Effects" in window_title:  # 检查标题中是否包含关键字
            return True
    return False

while not is_ae_interface_loaded():
    print("Waiting for After Effects to start...")
    time.sleep(1)

print("After Effects has started.")

# 运行测试插件脚本
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
time.sleep(1)

# 运行保存并关闭脚本
save_command = [ae_exe, "-r", save_and_close_script]
try:
    print("Saving and closing After Effects project...")
    save_result = subprocess.run(
        save_command,
        check=True,
        capture_output=True,
        text=True,
        env=os.environ.copy()
    )
    print("Project saved and After Effects closed successfully.")
except subprocess.CalledProcessError as e:
    print(f"An error occurred while saving and closing the project: {e}")
print("Process completed.")

# 调用 Nexrender CLI 命令
nexrender_exe = "nexrender-cli-win64.exe"
job_file = r"C:\wudanni\resources\SpecialEffects\AE_scripts\myjob.json"

print("Starting Nexrender for video export...")
nexrender_command = [nexrender_exe, "--file", job_file, "--skip-cleanup"]
time.sleep(1)
try:
    nexrender_result = subprocess.run(
        nexrender_command,
        check=True,
        capture_output=True,
        text=True
    )
    print("Nexrender export completed successfully.")
except subprocess.CalledProcessError as e:
    print(f"An error occurred while running Nexrender: {e}")