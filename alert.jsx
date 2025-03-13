// 定义颜色值 (R, G, B)
var color = [0.5, 0.5, 1.0]; // 蓝紫色

// 获取当前活动的合成
var comp = app.project.activeItem;

if (comp && comp instanceof CompItem) {
    // 添加纯色图层
    var solidLayer = comp.layers.addSolid(color, "New Solid", comp.width, comp.height, 1);
    
    // 可选：设置图层位置
    solidLayer.position.setValue([comp.width / 2, comp.height / 2]);
    
    // 输出提示信息

} else {

}