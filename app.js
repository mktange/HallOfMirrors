var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.distanceTo = function (other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    };

    Vector.prototype.normalize = function () {
        var length = this.length();
        return new Vector(this.x / length, this.y / length);
    };

    Vector.prototype.length = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };

    Vector.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };

    Vector.prototype.cross = function (other) {
        return this.x * other.y - this.y * other.x;
    };

    Vector.prototype.scale = function (c) {
        return new Vector(this.x * c, this.y * c);
    };

    Vector.prototype.plus = function (other) {
        return new Vector(this.x + other.x, this.y + other.y);
    };

    Vector.prototype.minus = function (other) {
        return new Vector(this.x - other.x, this.y - other.y);
    };

    Vector.prototype.round6 = function () {
        this.x = round6(this.x);
        this.y = round6(this.y);
        return this;
    };

    Vector.prototype.toString = function () {
        return "[x: " + round3(this.x) + " , y: " + round3(this.y) + "]";
    };
    Vector.origin = new Vector(0, 0);
    return Vector;
})();

function round3(x) {
    return Math.round(x * 10e3) / 10e3;
}

function round6(x) {
    return Math.round(x * 10e6) / 10e6;
}

function intersect(p, r, q, qe) {
    var s = qe.minus(q);
    var rcs = r.cross(s);
    if (rcs == 0)
        return { t: -1, u: -1 };

    var qmp = q.minus(p);
    return { t: round6(qmp.cross(s) / rcs), u: round6(qmp.cross(r) / rcs) };
}

function reflect(dir, p1, p2) {
    var normal = new Vector(p2.y - p1.y, p1.x - p2.x).normalize();
    return dir.minus(normal.scale(2 * dir.dot(normal))).round6();
}
var Mirror = (function () {
    function Mirror(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    return Mirror;
})();
var LightRay = (function () {
    function LightRay(p, d, dist) {
        this.p = p;
        this.dist = dist;
        this.dir = d.normalize();
    }
    return LightRay;
})();
var HallOfMirrors = (function () {
    function HallOfMirrors(mirrors, lightRay) {
        this.mirrors = mirrors;
        this.lightRay = lightRay;
        this.calcSize();
        this.traceRay();
    }
    HallOfMirrors.prototype.traceRayRec = function (distLeft, p, dir) {
        this.ray.push(p);
        if (distLeft <= 0)
            return;

        var nextHit = this.mirrors.map(function (m) {
            return { is: intersect(p, dir, m.p1, m.p2), m: m };
        }).filter(function (x) {
            return x.is.u >= 0 && x.is.u <= 1 && x.is.t > 0;
        }).sort(function (a, b) {
            return a.is.t - b.is.t;
        })[0];

        if (!nextHit) {
            this.traceRayRec(0, p.plus(dir.scale(distLeft)), null);
            return;
        }

        var d = Math.min(nextHit.is.t, distLeft);
        this.traceRayRec(distLeft - d, p.plus(dir.scale(d)), reflect(dir, nextHit.m.p1, nextHit.m.p2));
    };

    HallOfMirrors.prototype.traceRay = function () {
        this.ray = [];
        this.traceRayRec(this.lightRay.dist, this.lightRay.p, this.lightRay.dir);
    };

    HallOfMirrors.prototype.endPoint = function () {
        return this.ray[this.ray.length - 1];
    };

    HallOfMirrors.prototype.calcSize = function () {
        var minX, maxX, minY, maxY;

        minX = this.lightRay.p.x;
        maxX = this.lightRay.p.x;
        minY = this.lightRay.p.y;
        maxY = this.lightRay.p.y;

        for (var i = 0; i < this.mirrors.length; i++) {
            if (this.mirrors[i].p1.x < minX)
                minX = this.mirrors[i].p1.x;
            if (this.mirrors[i].p2.x < minX)
                minX = this.mirrors[i].p2.x;

            if (this.mirrors[i].p1.x > maxX)
                maxX = this.mirrors[i].p1.x;
            if (this.mirrors[i].p2.x > maxX)
                maxX = this.mirrors[i].p2.x;

            if (this.mirrors[i].p1.y < minY)
                minY = this.mirrors[i].p1.y;
            if (this.mirrors[i].p2.y < minY)
                minY = this.mirrors[i].p2.y;

            if (this.mirrors[i].p1.y > maxY)
                maxY = this.mirrors[i].p1.y;
            if (this.mirrors[i].p2.y > maxY)
                maxY = this.mirrors[i].p2.y;
        }

        this.size = { width: maxX - minX, height: maxY - minY };
        this.start = new Vector(minX, minY);
    };
    return HallOfMirrors;
})();
// Parse input string given in textarea
function parseInput(textArea) {
    var input = textArea.val();
    var lines = input.split("\n").map(function (s) {
        return s.trim();
    }).filter(function (s) {
        return s.length > 0;
    });

    var N = parseInt(lines[0]);
    if (N != lines.length - 2) {
        alert("Invalid input");
        return;
    }

    var mirrors = [];
    for (var i = 1; i < N + 1; i++) {
        var line = lines[i].split(" ").map(parseFloat);
        mirrors.push(new Mirror(new Vector(line[0], line[1]), new Vector(line[2], line[3])));
    }

    var line = lines[lines.length - 1].split(" ").map(parseFloat);
    var lightRay = new LightRay(new Vector(line[0], line[1]), new Vector(line[2], line[3]), line[4]);

    return new HallOfMirrors(mirrors, lightRay);
}

// Parse input string given in textarea
function parseInputGET(m, lr) {
    var ms = m.replace(/%20/g, " ").split(";");

    var mirrors = [];
    for (var i = 0; i < ms.length; i++) {
        var line = ms[i].split(" ").map(parseFloat);
        mirrors.push(new Mirror(new Vector(line[0], line[1]), new Vector(line[2], line[3])));
    }

    var line = lr.replace(/%20/g, " ").split(" ").map(parseFloat);
    var lightRay = new LightRay(new Vector(line[0], line[1]), new Vector(line[2], line[3]), line[4]);

    return new HallOfMirrors(mirrors, lightRay);
}

// Generate the GET search string of a hall of mirrors
function getSearchString(hall) {
    var ms = [];

    for (var i = 0; i < hall.mirrors.length; i++) {
        ms.push([
            hall.mirrors[i].p1.x, hall.mirrors[i].p1.y,
            hall.mirrors[i].p2.x, hall.mirrors[i].p2.y
        ].join(" "));
    }

    var lr = [
        hall.lightRay.p.x, hall.lightRay.dir.y,
        hall.lightRay.p.x, hall.lightRay.dir.y,
        hall.lightRay.dist].join(" ");
    return "?m=" + ms.join(";") + "&lr=" + lr;
}
/// <reference path="classes/hallofmirrors.ts" />
/// <reference path="classes/lightray.ts" />
/// <reference path="classes/mirror.ts" />
var EXTENT = 600;
var WIDTH = EXTENT;
var HEIGHT = EXTENT;
var N = 150;
var SCALE = 0.15;

function randomHoM() {
    var mirrors = [];

    var sign = function () {
        return ((Math.random() > 0.5) ? 1 : -1);
    };

    for (var i = 0; i < N; i++) {
        var x = Math.random() * WIDTH, y = Math.random() * HEIGHT;
        var dx = Math.random() * WIDTH * SCALE * sign();
        var dy = Math.random() * HEIGHT * SCALE * sign();
        mirrors.push(new Mirror(new Vector(x, y), new Vector(x + dx, y + dy)));
    }

    var x = Math.random() * WIDTH / 2 + WIDTH / 4, y = Math.random() * HEIGHT / 2 + HEIGHT / 4;
    var vx = Math.random() * WIDTH * sign(), vy = Math.random() * HEIGHT * sign();
    var lightRay = new LightRay(new Vector(x, y), new Vector(vx, vy), 3 * WIDTH);

    return new HallOfMirrors(mirrors, lightRay);
}
function drawCanvasHoM(hall) {
    $("#drawing").append($("<canvas>").attr("id", "canvas"));
    var canvas = document.getElementById("canvas");

    var ctx = canvas.getContext("2d");

    var ratio = 800 / Math.max(hall.size.width, hall.size.height);
    var scale = function (x) {
        return x * ratio;
    };
    canvas.width = scale(hall.size.width) + 10;
    canvas.height = scale(hall.size.height) + 10;

    ctx.translate(-scale(hall.start.x) + 5, -scale(hall.start.y) + 5);

    hall.mirrors.forEach(function (m) {
        ctx.beginPath();
        ctx.moveTo(scale(m.p1.x), scale(m.p1.y));
        ctx.lineTo(scale(m.p2.x), scale(m.p2.y));
        ctx.lineWidth = 1;

        ctx.strokeStyle = "blue";
        ctx.stroke();
    });

    // Draw ray
    ctx.beginPath();
    ctx.moveTo(scale(hall.ray[0].x), scale(hall.ray[0].y));

    hall.ray.slice(1).forEach(function (rp) {
        ctx.lineTo(scale(rp.x), scale(rp.y));
    });
    ctx.strokeStyle = "red";
    ctx.stroke();

    // Draw starting point
    ctx.fillStyle = "red";
    ctx.fillRect(scale(hall.ray[0].x) - 2, scale(hall.ray[0].y) - 2, 4, 4);
    ctx.stroke();

    // Draw end-point
    ctx.fillStyle = "green";
    ctx.fillRect(scale(hall.endPoint().x) - 2, scale(hall.endPoint().y) - 2, 4, 4);
    ctx.stroke();

    return canvas;
}
/// <reference path="lib/typings/jquery/jquery.d.ts" />
/// <reference path="math/geometry.ts" />
/// <reference path="classes/mirror.ts" />
/// <reference path="classes/lightray.ts" />
/// <reference path="classes/hallofmirrors.ts" />
/// <reference path="inputparsing.ts" />
/// <reference path="generate.ts" />
/// <reference path="drawing/canvas.ts" />
// Draw the resulting hall of mirrors
function draw(hall) {
    $("#drawing").children().remove();

    //$("#link").attr("value", window.location.href + getSearchString(hall));
    $("#result").text(hall.endPoint().toString());

    var el = drawCanvasHoM(hall);
    $("#drawing").css({
        "width": el.width,
        "height": el.height
    });
}

// Draw an input area
function drawMenu() {
    var inputDiv = $("<div>").attr("id", "inputDiv");
    var textArea = $("<textarea>").attr("id", "inputval");
    var drawButton = $("<input>").attr({
        type: "button",
        value: "Draw"
    }).click(function () {
        draw(parseInput(textArea));
        inputDiv.slideToggle(300);
    });

    inputDiv.append(textArea, drawButton);

    var buttonArea = $("<div>").addClass("buttons");

    var toggleButton = $("<input>").attr({
        type: "button",
        value: "Menu"
    }).click(function () {
        return inputDiv.slideToggle(500);
    });
    var randomButton = $("<input>").attr({
        type: "button",
        value: "Random"
    }).click(function () {
        return draw(randomHoM());
    });
    buttonArea.append(toggleButton, randomButton);

    $("#menu").append(inputDiv, buttonArea);
    textArea.focus();
}

var sample = "1\n-1 0 1 0\n-1 -1 1 1 2.828427";

window.onload = function () {
    drawMenu();
    var mirrors = window.location.search.toString().match(/[\?&]m=([^&=]+)/);
    if (mirrors) {
        var lightray = window.location.search.toString().match(/[\?&]lr=([^&=]+)/);
        $("#inputDiv").slideToggle(0);
        draw(parseInputGET(mirrors[1], lightray[1]));
    } else {
        var textArea = $("#inputval");
        textArea.val(sample);
        draw(parseInput(textArea));
    }
};
//# sourceMappingURL=app.js.map
