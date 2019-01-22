var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Vector {
    constructor(...vals) {
        this.vals = vals;
    }
    map(callback) {
        for (var i = 0; i < this.vals.length; i++) {
            callback(this.vals, i);
        }
        return this;
    }
    mul(v) {
        return this.map((arr, i) => arr[i] *= v.vals[i]);
    }
    div(v) {
        return this.map((arr, i) => arr[i] /= v.vals[i]);
    }
    add(v) {
        return this.map((arr, i) => arr[i] += v.vals[i]);
    }
    sub(v) {
        return this.map((arr, i) => arr[i] -= v.vals[i]);
    }
    scale(s) {
        return this.map((arr, i) => arr[i] *= s);
    }
    length() {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * arr[i]);
        return Math.pow(sum, 0.5);
    }
    normalize() {
        return this.scale(1 / this.length());
    }
    to(v) {
        return v.c().sub(this);
    }
    lerp(v, weight) {
        return this.c().add(this.to(v).scale(weight));
    }
    c() {
        return Vector.fromArray(this.vals.slice());
    }
    overwrite(v) {
        return this.map((arr, i) => arr[i] = v.vals[i]);
    }
    dot(v) {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * v.vals[i]);
        return sum;
    }
    loop(callback) {
        var counter = this.c();
        counter.vals.fill(0);
        while (counter.compare(this) == -1) {
            callback(counter);
            if (counter.incr(this)) {
                break;
            }
        }
    }
    compare(v) {
        for (var i = this.vals.length - 1; i >= 0; i--) {
            if (this.vals[i] < v.vals[i]) {
                continue;
            }
            else if (this.vals[i] == v.vals[i]) {
                return 0;
            }
            else {
                return 1;
            }
        }
        return -1;
    }
    incr(comparedTo) {
        for (var i = 0; i < this.vals.length; i++) {
            if ((this.vals[i] + 1) < comparedTo.vals[i]) {
                this.vals[i]++;
                return false;
            }
            else {
                this.vals[i] = 0;
            }
        }
        return true;
    }
    project(v) {
        return v.c().scale(this.dot(v) / v.dot(v));
    }
    get(i) {
        return this.vals[i];
    }
    set(i, val) {
        this.vals[i] = val;
    }
    get x() {
        return this.vals[0];
    }
    get y() {
        return this.vals[1];
    }
    get z() {
        return this.vals[2];
    }
    set x(val) {
        this.vals[0] = val;
    }
    set y(val) {
        this.vals[1] = val;
    }
    set z(val) {
        this.vals[2] = val;
    }
    draw(ctxt) {
        var width = 10;
        var halfwidth = width / 2;
        ctxt.fillRect(this.x - halfwidth, this.y - halfwidth, width, width);
    }
    cross(v) {
        var x = this.y * v.z - this.z * v.y;
        var y = this.z * v.x - this.x * v.z;
        var z = this.x * v.y - this.y * v.x;
        return new Vector(x, y, z);
    }
    static fromArray(vals) {
        var x = new Vector();
        x.vals = vals;
        return x;
    }
    loop2d(callback) {
        var counter = new Vector(0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                callback(counter);
            }
        }
    }
    loop3d(callback) {
        var counter = new Vector(0, 0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                for (counter.z = 0; counter.z < this.z; counter.z++) {
                    callback(counter);
                }
            }
        }
    }
    floor() {
        this.vals = this.vals.map(Math.floor);
        return this;
    }
    ceil() {
        this.vals = this.vals.map(Math.ceil);
        return this;
    }
    round() {
        this.vals = this.vals.map(Math.round);
        return this;
    }
    sign() {
        this.vals = this.vals.map(Math.sign);
        return this;
    }
    inverse() {
        this.vals = this.vals.map(v => -v);
        return this;
    }
    rot2d(theta) {
        var sin = Math.sin(theta);
        var cos = Math.cos(theta);
        var xp = this.x * cos - this.y * sin;
        var yp = this.y * cos + this.x * sin;
        this.x = xp;
        this.y = yp;
        return this;
    }
}
Vector.zero = new Vector(0, 0);
Vector.one = new Vector(1, 1);
Vector.up = new Vector(0, -1);
Vector.down = new Vector(0, 1);
Vector.left = new Vector(-1, 0);
Vector.right = new Vector(1, 0);
// (window as any).devtoolsFormatters = [
//     {
//         header: function(obj, config){
//             if(!(obj instanceof Vector)){
//                 return null
//             }
//             if((obj.vals.length == 2)){
//                 return ["div",{style:""}, `x:${obj.x} y:${obj.y}`]
//             }
//             if((obj.vals.length == 3)){
//                 return ["div",{style:""}, `x:${obj.x} y:${obj.y} z:${obj.z}`]
//             }
//         },
//         hasBody: function(obj){
//             return false
//         },
//     }
// ]
class Mesh {
    constructor() {
        this.faces = [];
        this.vertices = [];
        this.normals = [];
        this.uvs = [];
    }
    static triangle() {
        var tri = new Mesh();
        tri.vertices = [
            new Vector(-1, 1, 0),
            new Vector(1, 1, 0),
            new Vector(-1, -1, 0),
        ];
        tri.faces = [
            new Face([
                new Vertex(0, 0, 0),
                new Vertex(1, 1, 0),
                new Vertex(2, 2, 0),
            ])
        ];
        tri.normals = [
            new Vector(0, 0, -1)
        ];
        tri.uvs = [
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(0, 1),
        ];
        tri.calcNormals();
        return tri;
    }
    static quad() {
        var quad = new Mesh();
        quad.vertices = [
            new Vector(-1, 1, 0),
            new Vector(1, 1, 0),
            new Vector(1, -1, 0),
            new Vector(-1, -1, 0),
        ];
        quad.uvs = [
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(0, 1),
        ];
        quad.normals = [
            new Vector(0, 0, -1)
        ];
        quad.faces = [
            new Face([
                new Vertex(0, 0, 0),
                new Vertex(1, 1, 0),
                new Vertex(2, 2, 0),
            ]),
            new Face([
                new Vertex(2, 2, 0),
                new Vertex(3, 3, 0),
                new Vertex(0, 0, 0),
            ])
        ];
        return quad;
    }
    calcNormals() {
    }
}
class Face {
    constructor(vertices) {
        this.vertices = vertices;
    }
}
class Vertex {
    constructor(position, uv, normal) {
        this.position = position;
        this.uv = uv;
        this.normal = normal;
    }
    pos(mesh) {
        return mesh.vertices[this.position];
    }
    toArray(mesh) {
        var pos = mesh.vertices[this.position];
        var nor = mesh.normals[this.normal];
        var uv = mesh.uvs[this.uv];
        return [...pos.vals, ...nor.vals, ...uv.vals];
    }
}
class Shader {
    //color
    //normalmap
    //colormap
    //lights
    //specularmap
    constructor(process) {
        this.process = process;
    }
}
class Pipeline {
    constructor() {
        this.camera = new Vector(0, 0, 0);
    }
    draw(mesh) {
        for (var i = 0; i < mesh.faces.length; i++) {
            var face = mesh.faces[i];
            var a = face.vertices[0];
            var b = face.vertices[1];
            var c = face.vertices[2];
            var ascr = this.screentransform(a.toArray(mesh));
            var bscr = this.screentransform(b.toArray(mesh));
            var cscr = this.screentransform(c.toArray(mesh));
            var a2b = a.pos(mesh).to(b.pos(mesh));
            var a2c = a.pos(mesh).to(c.pos(mesh));
            var normal = a2b.cross(a2c).normalize();
            var cameraRay = this.camera.to(a.pos(mesh));
            if (normal.dot(cameraRay) < 0) {
                this.triangle(ascr, bscr, cscr, mesh, v => {
                    this.shader.process(v, i, normal);
                });
            }
        }
    }
    screentransform(pos) {
        var screensize = new Vector(800, 400);
        var ratio = screensize.y / screensize.x;
        var x = ((pos[0] + 1) * (screensize.x / 2)) * ratio + screensize.x * ratio * 0.5;
        var y = (-pos[1] + 1) * (screensize.y / 2);
        pos[0] = x;
        pos[1] = y;
        return pos;
    }
    triangle(a, b, c, mesh, cb) {
        var vertices = [a, b, c];
        sortby(vertices, v => v[1]);
        var top = vertices[0];
        var middleLeft = vertices[1];
        var bot = vertices[2];
        var middleRight = null;
        var ratio = to(top[1], middleLeft[1]) / to(top[1], bot[1]);
        var middleRight = top.slice();
        Pipeline.maplerp(top, bot, middleRight, ratio);
        if (middleLeft[0] > middleRight[0]) {
            var temp = middleLeft;
            middleLeft = middleRight;
            middleRight = temp;
        }
        this.walk(top, top, middleLeft, middleRight, mesh, cb);
        this.walk(middleLeft, middleRight, bot, bot, mesh, cb);
    }
    walk(tl, tr, bl, br, mesh, cb) {
        var lefttemp = new Array(tl.length);
        var righttemp = new Array(tl.length);
        var hortemp = new Array(tl.length);
        var distToPixelCenterY = to(tl[1], (Math.ceil(tl[1] - 0.5) + 0.5));
        for (var y = tl[1] + distToPixelCenterY; y < bl[1]; y++) {
            var ratioy = Pipeline.inverselerp(tl[1], bl[1], y);
            Pipeline.maplerp(tl, bl, lefttemp, ratioy);
            Pipeline.maplerp(tr, br, righttemp, ratioy);
            lefttemp[1] = Math.floor(lefttemp[1]);
            righttemp[1] = Math.floor(righttemp[1]);
            var distToPixelCenterX = to(lefttemp[0], (Math.ceil(lefttemp[0] - 0.5) + 0.5));
            for (var x = lefttemp[0] + distToPixelCenterX; x < righttemp[0]; x++) {
                var ratiox = Pipeline.inverselerp(lefttemp[0], righttemp[0], x);
                Pipeline.maplerp(lefttemp, righttemp, hortemp, ratiox);
                hortemp[0] = Math.floor(hortemp[0]);
                cb(hortemp);
            }
        }
    }
    static maplerp(from, to, buffer, t) {
        this.map(from, buffer, (v, i) => this.lerp(v, to[i], t));
    }
    static map(arr, buffer, cb) {
        for (var i = 0; i < arr.length; i++) {
            buffer[i] = cb(arr[i], i);
        }
        return buffer;
    }
    static inverselerp(a, b, v) {
        return (v - a) / (b - a);
    }
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
    static remap(r1a, r1b, r2a, r2b, v) {
        this.lerp(r2a, r2b, this.inverselerp(r1a, r1b, v));
    }
}
class Matrix {
    constructor(vals) {
        this.vals = vals;
    }
    c() {
    }
    static translate(v) {
        return new Matrix([
            [1, 0, 0, v.x],
            [0, 1, 0, v.y],
            [0, 0, 1, v.z],
            [0, 0, 0, 1],
        ]);
    }
    static scale(v) {
        return new Matrix([
            [v.x, 0, 0, 0],
            [0, v.y, 0, 0],
            [0, 0, v.z, 0],
            [0, 0, 0, 1],
        ]);
    }
    static rotx(theta) {
        var cost = Math.cos(theta);
        var sint = Math.sin(theta);
        return new Matrix([
            [1, 0, 0, 0],
            [0, cost, -sint, 0],
            [0, sint, cost, 0],
            [0, 0, 0, 1],
        ]);
    }
    static roty(theta) {
        var cost = Math.cos(theta);
        var sint = Math.sin(theta);
        return new Matrix([
            [cost, 0, sint, 0],
            [0, 1, 0, 0],
            [-sint, 0, cost, 0],
            [0, 0, 0, 1],
        ]);
    }
    static rotz(theta) {
        var cost = Math.cos(theta);
        var sint = Math.sin(theta);
        return new Matrix([
            [cost, -sint, 0, 0],
            [sint, cost, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }
    static zero() {
        return new Matrix([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]);
    }
    static identity() {
        return new Matrix([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }
    static projection() {
    }
    static lookAt(pos, target, up) {
        var forward = pos.to(target).normalize();
        var up;
        var right = up.cross(forward);
        return new Matrix([
            [right.x, right.y, right.z, 0],
            [up.x, up.y, up.z, 0],
            [forward.x, forward.y, forward.z, 0],
            [pos.x, pos.y, pos.z, 1],
        ]);
    }
    inverse() {
    }
    mxm(m) {
        var matrix = Matrix.zero();
        for (var c = 0; c < 4; c++)
            for (var r = 0; r < 4; r++)
                matrix.vals[r][c] = this.vals[r][0] * this.vals[0][c] + this.vals[r][1] * m.vals[1][c] + this.vals[r][2] * m.vals[2][c] + this.vals[r][3] * m.vals[3][c];
        return matrix;
    }
    //matrix bottomleft
    //vector vertical topright
    mxv(v) {
        var x = v.x * this.vals[0][0] + v.y * this.vals[0][1] + v.z * this.vals[0][2] + this.vals[0][3];
        var y = v.x * this.vals[1][0] + v.y * this.vals[1][1] + v.z * this.vals[1][2] + this.vals[1][3];
        var z = v.x * this.vals[2][0] + v.y * this.vals[2][1] + v.z * this.vals[2][2] + this.vals[2][3];
        var w = v.x * this.vals[3][0] + v.y * this.vals[3][1] + v.z * this.vals[3][2] + this.vals[3][3];
        v.x = x;
        v.y = y;
        v.z = z;
        // if(w != 0){
        //     v.scale(1/w)
        // }
    }
}
class Graphics {
    constructor(ctxt) {
        this.ctxt = ctxt;
        this.ctxt = ctxt;
    }
    load() {
        this.imageData = this.ctxt.getImageData(0, 0, this.ctxt.canvas.width, this.ctxt.canvas.height);
    }
    flush() {
        this.ctxt.putImageData(this.imageData, 0, 0);
    }
    putPixel(x, y, vals) {
        var i = this.index(x, y);
        var data = this.imageData.data;
        data[i] = vals[0];
        data[i + 1] = vals[1];
        data[i + 2] = vals[2];
        data[i + 3] = vals[3];
    }
    getPixel(x, y) {
        var i = this.index(x, y);
        var data = this.imageData.data;
        return [data[i], data[i + 1], data[i + 2], data[i + 3]];
    }
    getWidth() {
        return this.ctxt.canvas.width;
    }
    getHeight() {
        return this.ctxt.canvas.height;
    }
    index(x, y) {
        return (this.getWidth() * y + x) * 4;
    }
}
/// <reference path="vector.ts" />
function map(val1, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((val1 - start1) / (stop1 - start1));
}
function inRange(min, max, value) {
    if (min > max) {
        var temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}
function min(a, b) {
    if (a < b)
        return a;
    return b;
}
function max(a, b) {
    if (a > b)
        return a;
    return b;
}
function clamp(val, min, max) {
    return this.max(this.min(val, max), min);
}
function rangeContain(a1, a2, b1, b2) {
    return max(a1, a2) >= max(b1, b2) && min(a1, a2) <= max(b1, b2);
}
function createNDimArray(dimensions, fill) {
    if (dimensions.length > 0) {
        function helper(dimensions) {
            var dim = dimensions[0];
            var rest = dimensions.slice(1);
            var newArray = new Array();
            for (var i = 0; i < dim; i++) {
                newArray[i] = helper(rest);
            }
            return newArray;
        }
        var array = helper(dimensions);
        var looper = new Vector(0, 0);
        looper.vals = dimensions;
        looper.loop((pos) => {
            setElement(array, pos.vals, fill(pos));
        });
        return array;
    }
    else {
        return undefined;
    }
}
function getElement(array, indices) {
    if (indices.length == 0) {
        return null;
    }
    else {
        return getElement(array[indices[0]], indices.slice(1));
    }
}
function setElement(array, pos, val) {
    if (pos.length == 1) {
        array[pos[0]] = val;
    }
    else {
        setElement(array[pos[0]], pos.slice(1), val);
    }
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}
function createCanvas(x, y) {
    var canvas = document.createElement('canvas');
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas);
    var ctxt = canvas.getContext('2d');
    return { ctxt: ctxt, canvas: canvas };
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function randomSpread(center, spread) {
    var half = spread / 2;
    return random(center - half, center + half);
}
var lastUpdate = Date.now();
function loop(callback) {
    var now = Date.now();
    callback(now - lastUpdate);
    lastUpdate = now;
    requestAnimationFrame(() => {
        loop(callback);
    });
}
function mod(number, modulus) {
    return ((number % modulus) + modulus) % modulus;
}
function* iter(n) {
    var i = 0;
    while (i < n)
        yield i++;
}
var keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
});
function getMoveInput() {
    var dir = new Vector(0, 0);
    if (keys[37] || keys[65])
        dir.x--; //left
    if (keys[38] || keys[87])
        dir.y++; //up
    if (keys[39] || keys[68])
        dir.x++; //right
    if (keys[40] || keys[83])
        dir.y--; //down
    return dir;
}
function getMoveInputYFlipped() {
    var input = getMoveInput();
    input.y *= -1;
    return input;
}
function getFiles(strings) {
    var promises = [];
    for (var string of strings) {
        var promise = fetch(string)
            .then(resp => resp.text())
            .then(text => text);
        promises.push(promise);
    }
    return Promise.all(promises);
}
function findbestIndex(list, evaluator) {
    if (list.length < 1) {
        return -1;
    }
    var bestIndex = 0;
    var bestscore = evaluator(list[0]);
    for (var i = 1; i < list.length; i++) {
        var score = evaluator(list[i]);
        if (score > bestscore) {
            bestscore = score;
            bestIndex = i;
        }
    }
    return bestIndex;
}
function createAndAppend(element, html) {
    var result = string2html(html);
    element.appendChild(result);
    return result;
}
function string2html(string) {
    var div = document.createElement('div');
    div.innerHTML = string;
    return div.children[0];
}
function line(ctxt, a, b) {
    ctxt.beginPath();
    ctxt.moveTo(a.x, a.y);
    ctxt.lineTo(b.x, b.y);
    ctxt.stroke();
}
function lerp(a, b, r) {
    return a + to(a, b) * r;
}
function to(a, b) {
    return b - a;
}
function swap(arr, a = 0, b = 1) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
function sortby(arr, picker) {
    arr.sort((a, b) => picker(a) - picker(b));
}
class Sprite {
    constructor(imageData) {
        this.imageData = imageData;
        this.size = new Vector(imageData.width, imageData.height);
    }
    static fromString(url) {
        var image = new Image();
        image.src = url;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var promise = new Promise((res, rej) => {
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);
                var myData = context.getImageData(0, 0, image.width, image.height);
                var sprite = new Sprite(myData);
                sprite.image = image;
                res(sprite);
            };
        });
        return promise;
    }
    index(x, y) {
        return (this.imageData.width * y + x) * 4;
    }
    getUV(u, v) {
        return this.getPixel(Math.floor(this.size.x * u), Math.floor(this.size.y * v));
    }
    getPixel(x, y) {
        var i = this.index(x, y);
        return this.imageData.data.slice(i, i + 4);
    }
    putPixel() {
    }
}
/// <reference path="Camera.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Mesh.ts" />
/// <reference path="Shader.ts" />
/// <reference path="Pipeline.ts" />
/// <reference path="Matrix.ts" />
/// <reference path="node_modules/graphicsx/graphics.ts" />
/// <reference path="utils.ts" />
/// <reference path="Image.ts" />
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        // var image = await Sprite.fromString("img/uvtest.png")
        var image = yield Sprite.fromString("img/house.png");
        var crret = createCanvas(800, 400);
        var canvas = crret.canvas;
        var ctxt = crret.ctxt;
        var gfx = new Graphics(ctxt);
        var pipeline = new Pipeline();
        var mesh = Mesh.quad();
        var mattrans = Matrix.translate(new Vector(0, 0, 1));
        mesh.vertices.forEach(mattrans.mxv.bind(mattrans));
        var light = null;
        pipeline.shader = new Shader((v, index, normal) => {
            var color = image.getUV(v[6], v[7]);
            gfx.putPixel(v[0], v[1], color);
        });
        // loop((dt) => {
        ctxt.clearRect(0, 0, 500, 500);
        gfx.load();
        pipeline.draw(mesh);
        gfx.flush();
        // })
    });
}
start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNhbWVyYS50cyIsIlZlY3Rvci50cyIsIk1lc2gudHMiLCJTaGFkZXIudHMiLCJQaXBlbGluZS50cyIsIk1hdHJpeC50cyIsIm5vZGVfbW9kdWxlcy9ncmFwaGljc3gvZ3JhcGhpY3MudHMiLCJ1dGlscy50cyIsIkltYWdlLnRzIiwibWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQ0FBLE1BQU0sTUFBTTtJQUdSLFlBQVksR0FBRyxJQUFhO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsUUFBd0M7UUFDeEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFD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SSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDMUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNWLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDVixPQUFPLEdBQUcsQ0FBQTtJQUNkLENBQUM7SUFJRCxRQUFRLENBQUMsQ0FBVSxFQUFDLENBQVUsRUFBQyxDQUFVLEVBQUMsSUFBUyxFQUFDLEVBQXVCO1FBQ3ZFLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtRQUN0QixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFM0IsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM1QixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDckIsSUFBSSxXQUFXLEdBQVksSUFBSSxDQUFBO1FBRS9CLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN4RCxJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDN0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLFdBQVcsRUFBQyxLQUFLLENBQUMsQ0FBQTtRQUUzQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxD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LENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0osT0FBTyxNQUFNLENBQUM7SUFDWixDQUFDO0lBR0QsbUJBQW1CO0lBQ25CLDBCQUEwQjtJQUMxQixHQUFHLENBQUMsQ0FBUTtRQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDL0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvRixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMs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