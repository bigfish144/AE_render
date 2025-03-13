var weight = 0.5; // 随机权重，可根据需要调整
var maxRange = 100; // 设定一个最大变化范围，当跨度超过此范围时将会被限制
var seed = Math.floor(Math.random() * 0xFFFFFFFF); // 生成一个随机种子值并取整

function lcg(seed) {
    var m = 0xFFFFFFFF; // 2^32 - 1
    var a = 1664525;
    var c = 1013904223;
    return function() {
        seed = (a * seed + c) % m;
        return seed / m;
    };
}

var random = lcg(seed); // 使用自定义的LCG来初始化随机数生成器

function main() {
    var comp = findCompByName("main"); 
    if (!comp) {
        alert("A composition named 'main' was not found.");
        return;
    }
    comp.openInViewer();
    app.beginUndoGroup("Randomize Parameters"); 
    processLayers(comp);
    app.endUndoGroup(); 
    alert("Seed used for randomization: " + seed); // 输出种子值
}

//遍历图层并递归遍历子合成
function processLayers(comp) {
    for (var i = 1; i <= comp.layers.length; i++) {
        var layer = comp.layer(i);
        var effectsGroup = layer.property("ADBE Effect Parade");
        if (effectsGroup) {
            randomizeEffects(effectsGroup);
        }
        if (layer instanceof AVLayer && layer.source instanceof CompItem) {
            var nestedComp = layer.source;
            processLayers(nestedComp); 
        }
    }
}

function randomizeEffects(effectsGroup) {
    // 遍历图层上的所有效果器
    for (var i = 1; i <= effectsGroup.numProperties; i++) {
        var effect = effectsGroup.property(i);
        // 遍历效果器的所有参数
        for (var j = 1; j <= effect.numProperties; j++) {
            var param = effect.property(j);
            if (!isPropertyEditable(param)) {
                continue;
            }
            if (param instanceof Property && param.isTimeVarying === false && hasValue(param)) {
                var value = param.value;
                // 处理数字类型的参数
                if (typeof value === "number") {
                    var minVal = getMinValue(param); 
                    var maxVal = getMaxValue(param); 
                    if (minVal !== -Infinity && maxVal !== Infinity) {
                        var thisValue = param.value;
                        var randomizedValue = randomizeParameter(maxVal, minVal, thisValue, weight);
                        try {
                            param.setValue(randomizedValue);
                        } catch (error) {
                            // 记录错误并跳过无法设置的属性
                        }
                    }
                }
                // 处理颜色类型的参数
                else if (value instanceof Array && value.length === 4) {
                    alert("Processing color parameter: " + param.name);
                    // 颜色通常是一个四元素数组 [R, G, B, A]
                    var randomizedColor = [];
                    for (var k = 0; k < 3; k++) {
                        var minVal = 0; 
                        var maxVal = 1; 
                        var thisValue = value[k];
                        var randomizedValue = randomizeParameter(maxVal, minVal, thisValue, weight);
                        randomizedColor.push(randomizedValue);
                    }
                    randomizedColor.push(value[3]); // 保持原有透明度不变
                    try {
                        param.setValue(randomizedColor);
                    } catch (error) {
                        // 记录错误并跳过无法设置的属性
                    }
                }
                // 处理其他数组类型的参数（排除4维数组）
                else if (value instanceof Array && value.length !== 4) {
                    var randomizedArray = [];
                    for (var k = 0; k < value.length; k++) {
                        var minVal = getMinValue(param); // 获取参数的最小值
                        var maxVal = getMaxValue(param); // 获取参数的最大值
                        if (minVal !== -Infinity && maxVal !== Infinity) {
                            var thisValue = value[k];
                            var randomizedValue = randomizeParameter(maxVal, minVal, thisValue, weight);
                            randomizedArray.push(randomizedValue);
                        } else {
                            randomizedArray.push(thisValue); // 如果无法获取最小值或最大值，则保持原值
                        }
                    }
                    try {
                        param.setValue(randomizedArray);
                    } catch (error) {
                        // 记录错误并跳过无法设置的属性
                    }
                }
            }
        }
    }
}

// 随机化参数
function randomizeParameter(a, b, x, w) {
    if (a < b) {
        var temp = a;
        a = b;
        b = temp;
    }
    var rangeSpan = a - b;
    if (rangeSpan > maxRange) {
        rangeSpan = maxRange; 
    }
    // 确定方向
    var direction;
    if (x === b) {
        direction = 1; // 如果当前值等于最小值，方向必为增加
    } else if (x === a) {
        direction = -1; // 如果当前值等于最大值，方向必为减少
    } else {
        direction = random() < 0.5 ? -1 : 1; // 否则随机选择方向
    }
    var delta = direction * w * rangeSpan * random();
    var randomizedValue = x + delta;
    randomizedValue = Math.max(b, Math.min(a, randomizedValue));
    return randomizedValue;
}

// 检查属性是否有值
function hasValue(prop) {
    return prop.propertyValueType !== PropertyValueType.NO_VALUE;
}

// 检查属性是否可编辑
function isPropertyEditable(prop) {
    try {
        if (!prop || prop.isDisabled || prop.isReadOnly || prop.isHidden || isParentHidden(prop)) {
            return false;
        }
        if (prop.propertyValueType === PropertyValueType.CUSTOM_VALUE) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

// 检查属性的父级是否被隐藏
function isParentHidden(prop) {
    if (prop.parentProperty && prop.parentProperty.isHidden) {
        return true;
    }
    return false;
}

function getMinValue(prop) {
    try {
        if (prop.minValue !== undefined) {
            return prop.minValue;
        }
    } catch (error) {
        return -3600; 
    }
    
}

function getMaxValue(prop) {
    try {
        if (prop.maxValue !== undefined) {
            return prop.maxValue;
        } 
    } catch (error) {
        return 3600;
    }
    
}

// 根据名称查找合成
function findCompByName(name) {
    for (var i = 1; i <= app.project.numItems; i++) {
        var item = app.project.item(i);
        if (item instanceof CompItem && item.name === name) {
            return item;
        }
    }
    return null;
}

// 调用主函数
main();