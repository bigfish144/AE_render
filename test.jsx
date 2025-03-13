// 定义函数查找名为指定名称的合成
function findCompByName(name) {
    for (var i = 1; i <= app.project.items.length; i++) {
        var item = app.project.items[i];
        // 检查项目项是否为合成
        if (item instanceof CompItem && item.name === name) {
            return item;
        }
    }
    return null; // 如果没有找到合成，返回null
}

// 查找名为 "main" 的合成
var comp = findCompByName("main");
if (!comp) {
    alert("A composition named 'main' was not found.");
} else {
    // 打开并显示合成
    comp.openInViewer();  // 打开合成以使其成为活动合成
    alert("成功选中了名为 'main' 的合成！");

    // 检查合成中是否有图层
    if (comp.layers.length === 0) {
        alert("The composition has no layers.");
    } else {
        // 自动选择第一个图层
        var firstLayer = comp.layer(1);  // 获取第一个图层
        firstLayer.selected = true;       // 选择该图层
        alert("已成功选择第一个图层！");
    }
}
