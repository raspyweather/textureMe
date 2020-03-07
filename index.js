if (String.prototype["padStart"] === undefined) {
    String.prototype["padStart"] = function (str, char, count) {
        return (str.length >= count) ? str : Array(1 + count - str.length).join(char) + str;
    };
}
var dotW = 10;
var dotH = 10;
var PatternPainter = /** @class */ (function () {
    function PatternPainter(context) {
        this.context = context;
    }
    PatternPainter.prototype.draw = function (draw, xOffset, yOffset) {
        var _this = this;
        if (xOffset === void 0) { xOffset = 0; }
        if (yOffset === void 0) { yOffset = 0; }
        var drawDot = function (x, y, color) {
            _this.context.fillStyle = color;
            _this.context.fillRect(x * dotW + xOffset, y * dotH + yOffset, dotW, dotH);
        };
        var pattern = draw.pattern.map(function (row) { return row.map(function (item) { return parseInt(draw.colors[item]); }); });
        var w = window.innerWidth, h = window.innerWidth;
        var dotWCount = w / dotW, dotHCount = h / dotH;
        var x = 0;
        var intervalId = setInterval(function () {
            if (x > dotWCount) {
                clearInterval(intervalId);
                return;
            }
            pattern.forEach(function (row, cy) { return row.forEach(function (patternPx, cx) {
                return drawDot(x + cx, cy, "#" + patternPx.toString(16).padStart(6, 0));
            }); });
            x += draw.pattern[0].length;
        }, 0);
    };
    PatternPainter.prototype.drawPage = function (pageConfig) {
        var _this = this;
        var drawDir = function (configs, yStart) {
            var dotYIdx = 0;
            for (var index = 0; index < configs.length; index++) {
                var element = configs[index];
                _this.draw(element, 0, yStart + dotH * dotYIdx);
                dotYIdx += element.pattern.length + 1;
            }
            return dotYIdx;
        };
        var y = drawDir(pageConfig.configs, 0);
        if (pageConfig.symmetry) {
            drawDir(pageConfig.configs.reverse().map(function (row) { row.pattern = row.pattern.reverse(); return row; }), window.innerHeight - y * dotH);
        }
    };
    return PatternPainter;
}());
function tryParse(input) {
    var str = decodeURI(input.substr(1));
    try {
        return JSON.parse(atob(str));
    }
    catch (_a) { }
    try {
        return JSON.parse(str);
    }
    catch (_b) { }
}
