interface DrawingConfig {
    pattern: number[][];
    colors: string[];
}

interface PageConfig {
    version: string;
    text: string;
    configs: DrawingConfig[];
    symmetry: boolean;
}

const defaultConfig = <PageConfig>{
    configs: [
        {
            pattern: [[0, 0], [1, 0], [0, 1], [0, 0], [1, 1]],
            colors: ["0xCC0000", "0x000000"]
        }
    ],
    symmetry: true,
    text: 'Hi there ☺'
};
if (String.prototype["padStart"] === undefined) {
    String.prototype["padStart"] = (str, char, count) =>
        (str.length >= count) ? str : Array(1 + count - str.length).join(char) + str;
}

const dotW = 10;
const dotH = 10;

class PatternPainter {
    constructor(private readonly context: CanvasRenderingContext2D) { }
    draw(draw: DrawingConfig, xOffset = 0, yOffset = 0) {
        const drawDot = (x, y, color) => {
            this.context.fillStyle = color;
            this.context.fillRect(x * dotW + xOffset, y * dotH + yOffset, dotW, dotH);
        }
        const pattern = draw.pattern.map(row => row.map(item => parseInt(draw.colors[item])));
        const w = window.innerWidth, h = window.innerWidth;
        const dotWCount = w / dotW, dotHCount = h / dotH;
        let x = 0;
        let intervalId = setInterval(() => {
            if (x > dotWCount) {
                clearInterval(intervalId);
                return;
            }
            pattern.forEach((row, cy) => row.forEach((patternPx, cx) =>
                drawDot(x + cx, cy, "#" + patternPx.toString(16).padStart(6, 0))));
            x += draw.pattern[0].length;
        }, 0);
    }
    drawPage(pageConfig: PageConfig) {
        const drawDir = (configs, yStart) => {
            let dotYIdx = 0;
            for (let index = 0; index < configs.length; index++) {
                const element = configs[index];
                this.draw(element, 0, yStart + dotH * dotYIdx);
                dotYIdx += element.pattern.length + 1;
            }
            return dotYIdx;
        };
        const y = drawDir(pageConfig.configs, 0);
        if (pageConfig.symmetry) {
            drawDir(pageConfig.configs.reverse().map(row => { row.pattern = row.pattern.reverse(); return row; }), window.innerHeight - y * dotH);
        }
    }
}

function tryParse(input: string) {
    const str = decodeURI(input.substr(1));
    try { return JSON.parse(atob(str)); } catch { }
    try { return JSON.parse(decodeURI(atob(str))); } catch { }
    try { return JSON.parse(str); } catch { }
}