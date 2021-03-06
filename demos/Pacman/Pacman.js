var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
var button = document.querySelector("button");
var spriteSheetURL = "demos/Pacman/Sprites2.png";
var image = new Image();
image.src = spriteSheetURL;
const curMaze = 1;
var frame = 0;
var powerTime = 0;

function GetSpritePos(num) {
    if (num < 16) { return { x: num * 8, y: 0 } }
    else if (num < 32) { return { x: (num - 16) * 8, y: 8 } }
    else if (num < 36) { return { x: 0, y: (num - 31) * 16 } }
}
function GetGhostTarget(c) {
    var i = c.type;
    var state = c.state;
    var target = { x: 0, y: 0, c: 0 }
    if (state == "chase") {
        if (i == 0) target = { x: pacman.x, y: pacman.y }
        else if (i == 1) {
            if (pacman.f == 0) target = { x: pacman.x - 4, y: pacman.y - 4 }
            else target = { x: pacman.x + 4 * ((pacman.f - 2) % 2), y: pacman.y + 4 * ((pacman.f - 1) % 2) }
        }
        else if (i == 2) {
            var intermediary = { x: 0, y: 0 }
            if (pacman.f == 0) intermediary = { x: pacman.x - 2, y: pacman.y - 2 }
            else intermediary = { x: pacman.x + 2 * ((pacman.f - 2) % 2), y: pacman.y + 2 * ((pacman.f - 1) % 2) }
            target = { x: pacman.x + (intermediary.x - ghosts[0].x), y: pacman.y + (intermediary.y - ghosts[0].y) }
        }
        else if (i == 3) {
            const g = c;
            const d = (g.x - pacman.x) * (g.x - pacman.x) + (g.y - pacman.y) * (g.y - pacman.y);
            if (d > 64) target = { x: pacman.x, y: pacman.y }
            else target = { x: 0, y: 34 }
        }
    }
    else if (state == "scatter") {
        if (i == 0) target = { x: 25, y: -1 }
        else if (i == 1) target = { x: 03, y: -1 }
        else if (i == 2) target = { x: 27, y: 34 }
        else if (i == 3) target = { x: 00, y: 34 }
    }
    else if (state == "frightened") {
        if (i == 0) target = { x: c.x, y: c.y }
        else if (i == 1) target = { x: c.x, y: c.y }
        else if (i == 2) target = { x: c.x, y: c.y }
        else if (i == 3) target = { x: c.x, y: c.y }
    }
    else if (state == "eaten") {
        if (i == 0) target = { x: 14, y: 16 }
        else if (i == 1) target = { x: 14, y: 16 }
        else if (i == 2) target = { x: 14, y: 16 }
        else if (i == 3) target = { x: 14, y: 16 }
    }
    if (i == 0) target.c = "#ff0000";
    else if (i == 1) target.c = "#ffaaff"
    else if (i == 2) target.c = "#00ffff"
    else if (i == 3) target.c = "#ffaa00"
    return target;
}
var mazes = [
    [
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 02, 01, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 12, 12, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 02, 01, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 20, 28, 26, 31, 31, 21, 28, 24, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 22, 16, 16, 16, 16, 16, 16, 25, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 22, 16, 16, 16, 16, 16, 16, 25, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 22, 16, 16, 16, 16, 16, 16, 25, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 18, 19, 19, 19, 19, 19, 19, 17, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 12, 12, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 02, 01, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 12, 12, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 02, 01, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
    ],
    [
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [15, 15, 15, 15, 15, 15, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 09, 00, 04, 08, 00, 04, 12, 12, 12, 12, 08, 00, 04, 08, 00, 06, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 09, 00, 06, 09, 00, 02, 03, 07, 11, 03, 01, 00, 06, 09, 00, 06, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 09, 00, 06, 09, 00, 00, 00, 06, 09, 00, 00, 00, 06, 09, 00, 06, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 09, 00, 06, 13, 12, 08, 00, 06, 09, 00, 04, 12, 14, 09, 00, 06, 15, 15, 15, 15, 15, 15],
        [03, 03, 03, 03, 03, 03, 01, 00, 06, 11, 03, 01, 00, 02, 01, 00, 02, 03, 07, 09, 00, 02, 03, 03, 03, 03, 03, 03],
        [00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00],
        [12, 12, 08, 00, 04, 12, 12, 12, 14, 09, 00, 04, 12, 12, 12, 12, 08, 00, 06, 13, 12, 12, 12, 08, 00, 04, 12, 12],
        [11, 03, 01, 00, 02, 03, 03, 03, 07, 09, 00, 02, 03, 07, 11, 03, 01, 00, 06, 11, 03, 03, 03, 01, 00, 02, 03, 07],
        [09, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 06, 09, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 06],
        [09, 00, 04, 12, 12, 12, 08, 00, 06, 13, 12, 08, 00, 06, 09, 00, 04, 12, 14, 09, 00, 04, 12, 12, 12, 08, 00, 06],
        [09, 00, 02, 03, 03, 07, 09, 00, 02, 03, 03, 01, 16, 02, 01, 16, 02, 03, 03, 01, 00, 06, 11, 03, 03, 01, 00, 06],
        [09, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 06],
        [13, 12, 12, 08, 00, 06, 13, 12, 08, 00, 20, 28, 26, 31, 31, 21, 28, 24, 00, 04, 12, 14, 09, 00, 04, 12, 12, 14],
        [03, 03, 07, 09, 00, 02, 03, 03, 01, 00, 22, 16, 16, 16, 16, 16, 16, 25, 00, 02, 03, 03, 01, 00, 06, 11, 03, 03],
        [00, 00, 02, 01, 00, 00, 00, 00, 00, 00, 22, 16, 16, 16, 16, 16, 16, 25, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00],
        [08, 00, 00, 00, 00, 04, 12, 12, 08, 00, 22, 16, 16, 16, 16, 16, 16, 25, 00, 04, 12, 12, 08, 00, 02, 01, 00, 04],
        [09, 00, 04, 08, 00, 06, 11, 03, 01, 00, 18, 19, 19, 19, 19, 19, 19, 17, 00, 02, 03, 07, 09, 00, 00, 00, 00, 06],
        [09, 00, 06, 09, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 04, 08, 00, 06],
        [09, 00, 06, 09, 00, 06, 09, 00, 04, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 08, 00, 06, 09, 00, 06, 09, 00, 06],
        [01, 00, 06, 09, 00, 06, 09, 00, 02, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 01, 00, 06, 09, 00, 06, 09, 00, 02],
        [00, 00, 06, 09, 00, 06, 09, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 06, 09, 00, 06, 09, 00, 00],
        [12, 12, 14, 09, 00, 06, 13, 12, 12, 12, 12, 08, 00, 06, 09, 00, 04, 12, 12, 12, 12, 14, 09, 00, 06, 13, 12, 12],
        [11, 03, 03, 01, 00, 02, 03, 03, 03, 03, 03, 01, 16, 02, 01, 16, 02, 03, 03, 03, 03, 03, 01, 00, 02, 03, 03, 07],
        [09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06],
        [09, 00, 04, 08, 00, 04, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 08, 00, 04, 08, 00, 06],
        [09, 00, 06, 09, 00, 06, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 09, 00, 06, 09, 00, 06],
        [09, 00, 06, 09, 00, 06, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 09, 00, 06, 09, 00, 06],
        [09, 00, 02, 01, 00, 06, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 09, 00, 02, 01, 00, 06],
        [09, 00, 00, 00, 00, 06, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 09, 00, 00, 00, 00, 06],
        [13, 12, 12, 12, 12, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 13, 12, 12, 12, 12, 14],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
    ],
];
var pellets = [
    [
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 02, 01, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 12, 12, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 02, 01, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 20, 28, 26, 31, 31, 21, 28, 24, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 22, 16, 16, 16, 16, 16, 16, 25, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 22, 16, 16, 16, 16, 16, 16, 25, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 22, 16, 16, 16, 16, 16, 16, 25, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 18, 19, 19, 19, 19, 19, 19, 17, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 12, 12, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 02, 01, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 12, 12, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07, 11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 06, 09, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 02, 01, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [11, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 00, 00, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 07],
        [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
    ],
    [
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 03, 00, 00, 01, 00, 00, 00, 00, 00, 00, 01, 00, 00, 03, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 01, 01, 00, 00, 01, 01, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00],
        [01, 01, 01, 01, 01, 01, 01, 01, 00, 00, 01, 01, 01, 01, 01, 01, 01, 01, 00, 00, 01, 01, 01, 01, 01, 01, 01, 01],
        [00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00],
        [00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00],
        [00, 01, 01, 01, 01, 01, 01, 01, 00, 00, 01, 01, 01, 00, 00, 01, 01, 01, 00, 00, 01, 01, 01, 01, 01, 01, 01, 00],
        [00, 01, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 01, 00],
        [00, 01, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 01, 00],
        [00, 01, 01, 01, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 01, 01, 01, 00],
        [00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00],
        [00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00],
        [01, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 01],
        [00, 01, 01, 01, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00],
        [00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 01, 01, 01, 00],
        [00, 01, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 01, 00],
        [00, 01, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 01, 00],
        [00, 01, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 01, 00],
        [01, 01, 00, 00, 01, 00, 00, 01, 01, 01, 01, 01, 01, 00, 00, 01, 01, 01, 01, 01, 01, 00, 00, 01, 00, 00, 01, 01],
        [00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00],
        [00, 00, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 00, 00],
        [00, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 00],
        [00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00],
        [00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00],
        [00, 03, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 03, 00],
        [00, 01, 00, 00, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 00, 00, 01, 00],
        [00, 01, 01, 01, 01, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 01, 01, 01, 01, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
        [00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00],
    ],
];
var tempPellets = pellets[curMaze];
var ghosts = [
    { type: 0, x: 13.5, y: 15, facing: 1 + 2, state: "chase" },
    { type: 1, x: 13.5, y: 15, facing: 1 + 2, state: "chase" },
    { type: 2, x: 13.5, y: 15, facing: 1 + 2, state: "chase" },
    { type: 3, x: 13.5, y: 15, facing: 1 + 2, state: "chase" },
    /*{ type: 1, x: 11.5, y: 18, facing: 1 + 2, state: "sleep" },
    { type: 2, x: 13.5, y: 18, facing: 1 + 2, state: "sleep" },
    { type: 3, x: 15.5, y: 18, facing: 1 + 2, state: "sleep" },*/
];
var pacman = { x: 13.5, y: 27, f: 0, state:"alive"};

image.onload = function () {
    DoFrame();
    setInterval(DoFrame, 100);
}
button.onclick = function () {
    DoFrame();
}
function DoFrame() {
    RenderMaze();
    RenderPellets();
    ComputeGhosts();
    RenderGhosts();
    RenderPacman();
}

function RenderMaze() {
    frame++;
    context.drawImage(
        image,
        132, 12,
        8, 8,
        0, 0,
        224, 288,
    );
    for (let y = 0; y < 36; y++) {
        for (let x = 0; x < 28; x++) {
            var p = GetSpritePos(mazes[curMaze][y][x]);
            context.drawImage(
                image,
                p.x, p.y,
                8, 8,
                x * 8, y * 8,
                8, 8,
            );
        }
    }
}
function RenderPellets() {
    for (let y = 0; y < 36; y++) {
        for (let x = 0; x < 28; x++) {
            var pe = tempPellets[y][x];
            if (pe == 0) continue;
            var p = {x: (15+pe) * 8, y:0};
            if (pe == 3 && Math.floor(frame/2)%2 == 1) p.x = p.x -8;
            context.drawImage(
                image,
                p.x, p.y,
                8, 8,
                x * 8, y * 8,
                8, 8,
            );
        }
    }
}
function RenderGhosts() {
    for (const c of ghosts) {
        var p = GetSpritePos(32 + c.type);
        if (c.state == "frightened") p = { x: 0, y: 96 };
        else p.x = p.x + c.facing * 32;
        if (c.state == "eaten") p.y = 80;
        else p.x = p.x + (frame % 2) * 16;
        if (c.state == "frightened" && frame-powerTime > 100) p.x = p.x + Math.floor(frame / 2) % 2 * 32;
        context.drawImage(
            image,
            p.x, p.y,
            8, 8,
            c.x * 8 - 4, c.y * 8 - 4,
            8, 8,
        );
        context.drawImage(
            image,
            p.x + 8, p.y,
            8, 8,
            c.x * 8 + 4, c.y * 8 - 4,
            8, 8,
        );
        context.drawImage(
            image,
            p.x, p.y + 8,
            8, 8,
            c.x * 8 - 4, c.y * 8 + 4,
            8, 8,
        );
        context.drawImage(
            image,
            p.x + 8, p.y + 8,
            8, 8,
            c.x * 8 + 4, c.y * 8 + 4,
            8, 8,
        );
    }
}
function RenderPacman() {
    //pacman.f = (pacman.f+1)%4
    p = { x: 0, y: 112 }
    if (pacman.state == "dying") p = { x: 0, y: 96 };
    else {
        p.x = p.x + pacman.f * 32;
        if (frame%2 == 1) p.x = p.x + 16;
        if (frame%4 == 0) p = {x: 0, y: 128};
    }
    context.drawImage(
        image,
        p.x, p.y,
        8, 8,
        pacman.x * 8 - 4, pacman.y * 8 - 4,
        8, 8,
    );
    context.drawImage(
        image,
        p.x + 8, p.y,
        8, 8,
        pacman.x * 8 + 4, pacman.y * 8 - 4,
        8, 8,
    );
    context.drawImage(
        image,
        p.x, p.y + 8,
        8, 8,
        pacman.x * 8 - 4, pacman.y * 8 + 4,
        8, 8,
    );
    context.drawImage(
        image,
        p.x + 8, p.y + 8,
        8, 8,
        pacman.x * 8 + 4, pacman.y * 8 + 4,
        8, 8,
    );
}
function ComputeGhosts() {
    console.log(frame);
    console.log( Math.floor((frame%400)/200) == 0 ? "chase" : "scatter");
    for (const c of ghosts) {
        let o = [];
        if (c.state == "sleep") continue;
        if (c.state == "chase" || c.state == "scatter"){
            c.state = Math.floor((frame%400)/200) == 0 ? "chase" : "scatter";
        }
        if (c.state == "frightened"){
            if (c.x == pacman.x && c.y == pacman.y) c.state = "eaten";
            if (frame-powerTime > 150) c.state = "chase";
        }
        if (c.state == "eaten" && (mazes[curMaze][c.y + 1][Math.floor(c.x)] == 31 || c.x == 13.5)) {
            c.facing = 2;
            c.y = c.y + 1;
            c.x = 13.5;
            if (c.y == 18) c.state = "chase";
            continue;
        }
        else if (c.x == 13.5) {
            c.facing = 0;
            if (mazes[curMaze][c.y + 1][Math.floor(c.x)] == 31) {
                c.x = 14;
                o[3] = { x: 0, y: 0, f: 3 };
                o[1] = { x: -1, y: 0, f: 1 };
            }
            c.y = c.y - 1;
        }
        else {
            //c.state = "eaten";
            for (let d = 0; d < 4; d++) {
                if (((c.facing + 2) % 4) == d) continue;
                let m = { x: 0, y: 0, f: d };
                if (d == 0) m.y = -1;
                else if (d == 1) m.x = -1;
                else if (d == 2) m.y = 1;
                else if (d == 3) m.x = 1;
                const w = mazes[curMaze][c.y + m.y][c.x + m.x]
                if (!(w == 0 || w == 16 || w == undefined || (w == 31 && c.state == "eaten"))) continue;
                if (m.y == -1 && w == 16) continue;
                o[d] = m;
            }
        }
        const t = GetGhostTarget(c);
        let b = { x: 0, y: 0, f: 0, d: 10000000 };
        for (let d = 0; d < 4; d++) {
            if (o[d] == undefined) continue;
            m = o[d];
            m.d = (c.x + m.x - t.x) * (c.x + m.x - t.x) + (c.y + m.y - t.y) * (c.y + m.y - t.y);
            if (c.state == "frightened") m.d = Math.random() * 100;
            if (m.d < b.d) {
                b = m;
            }
        }
        context.beginPath();
        context.moveTo(c.x * 8 + 4, c.y * 8 + 4);
        context.lineTo(t.x * 8 + 4, t.y * 8 + 4);
        context.lineWidth = 2;
        context.strokeStyle = t.c;
        context.globalAlpha = 0.5;
        context.stroke();
        if (c.type == 3) {
            context.beginPath();
            context.arc(pacman.x * 8, pacman.y * 8, 64, 0, 2 * Math.PI);
            context.globalAlpha = 0.25;
            context.stroke();
        }
        context.globalAlpha = 1;
        c.x = (c.x + b.x + 28) % 28;
        c.y = c.y + b.y;
        c.facing = b.f;
    }
}