(function () {
    // 确保当前项目已打开
    if (!app.project) {
        alert("No project is currently open.");
        return;
    }
    if (app.project.items.length === 0) {
        alert("The project is empty.");
        return;
    }

    // 获取所有合成的依赖关系
    function getTopLevelCompositions() {
        var allCompositions = [];
        var dependentComps = [];
        for (var i = 1; i <= app.project.items.length; i++) {
            var item = app.project.items[i];
            if (item instanceof CompItem) {
                allCompositions.push(item);
                // 查找当前合成被使用的地方
                for (var j = 1; j <= item.usedIn.length; j++) {
                    dependentComps.push(item.usedIn[j]);
                }
            }
        }

        // 手动筛选没有被其他合成引用的顶层合成
        var topLevelCompositions = [];
        for (var k = 0; k < allCompositions.length; k++) {
            var comp = allCompositions[k];
            var isTopLevel = true;

            // 手动检查是否在 dependentComps 中
            for (var m = 0; m < dependentComps.length; m++) {
                if (dependentComps[m] === comp) {
                    isTopLevel = false;
                    break;
                }
            }

            if (isTopLevel) {
                topLevelCompositions.push(comp);
            }
        }

        return topLevelCompositions;
    }

    // 查找顶层合成
    var topLevelComps = getTopLevelCompositions();
    if (topLevelComps.length === 0) {
        alert("No top-level compositions found.");
        return;
    }

    // 将第一个顶层合成重命名为 "main"
    app.beginUndoGroup("Rename Top-Level Composition");

    try {
        var mainComp = topLevelComps[0];
        var originalName = mainComp.name;
        mainComp.name = "main";
        alert("The top-level composition '" + originalName + "' has been renamed to 'main'.");
    } catch (error) {
        alert("An error occurred: " + error.message);
    } finally {
        app.endUndoGroup();
    }
})();
