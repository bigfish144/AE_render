// 获取当前项目的文件路径和名称
var currentFilePath = app.project.file.fsName;
var currentFileName = app.project.file.name;
var currentFileFolder = app.project.file.parent.fsName;

// 提取当前文件名的扩展名
var fileExtension = currentFileName.split('.').pop();
var baseFileName = currentFileName.slice(0, -(fileExtension.length + 1));

// 构建新的文件名
var newFileName = baseFileName + "_1." + fileExtension;
var newFilePath = currentFileFolder + "/" + newFileName;

// 创建新的文件对象
var newFile = new File(newFilePath);

// 保存项目到新路径
app.project.save(newFile);

// 关闭当前项目
app.project.save();

// 退出 AE
app.quit();