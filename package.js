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
    static cube() {
        var cube = new Mesh();
        cube.vertices = [
            new Vector(-1, 1, -1),
            new Vector(1, 1, -1),
            new Vector(1, -1, -1),
            new Vector(-1, -1, -1),
            new Vector(-1, 1, 1),
            new Vector(1, 1, 1),
            new Vector(1, -1, 1),
            new Vector(-1, -1, 1),
        ];
        cube.uvs = [
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(0, 1),
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(0, 1),
        ];
        cube.normals = [
            new Vector(0, 0, -1)
        ];
        cube.faces = [
            new Face([
                new Vertex(0, 0, 0),
                new Vertex(1, 1, 0),
                new Vertex(3, 3, 0),
            ]),
            new Face([
                new Vertex(1, 1, 0),
                new Vertex(2, 2, 0),
                new Vertex(3, 3, 0),
            ]),
            new Face([
                new Vertex(1, 1, 0),
                new Vertex(6, 6, 0),
                new Vertex(2, 2, 0),
            ]),
            new Face([
                new Vertex(1, 1, 0),
                new Vertex(5, 5, 0),
                new Vertex(6, 6, 0),
            ]),
            new Face([
                new Vertex(5, 5, 0),
                new Vertex(4, 4, 0),
                new Vertex(6, 6, 0),
            ]),
            new Face([
                new Vertex(4, 4, 0),
                new Vertex(7, 7, 0),
                new Vertex(6, 6, 0),
            ]),
            new Face([
                new Vertex(4, 4, 0),
                new Vertex(0, 0, 0),
                new Vertex(3, 3, 0),
            ]),
            new Face([
                new Vertex(4, 4, 0),
                new Vertex(3, 3, 0),
                new Vertex(7, 7, 0),
            ]),
            new Face([
                new Vertex(0, 0, 0),
                new Vertex(4, 4, 0),
                new Vertex(1, 1, 0),
            ]),
            new Face([
                new Vertex(4, 4, 0),
                new Vertex(5, 5, 0),
                new Vertex(1, 1, 0),
            ]),
            new Face([
                new Vertex(3, 3, 0),
                new Vertex(6, 6, 0),
                new Vertex(7, 7, 0),
            ]),
            new Face([
                new Vertex(3, 3, 0),
                new Vertex(2, 2, 0),
                new Vertex(6, 6, 0),
            ]),
        ];
        return cube;
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
    static projection(width, height, fov, zFar, zNear) {
        var a = height / width;
        var f = 1 / Math.tan(fov / 2);
        var q = zFar / (zFar - zNear);
        return new Matrix([
            [a * f, 0, 0, 0],
            [0, f, 0, 0],
            [0, 0, q, -zNear * q],
            [0, 0, 1, 0],
        ]);
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
        var mesh = Mesh.cube();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNhbWVyYS50cyIsIlZlY3Rvci50cyIsIk1lc2gudHMiLCJTaGFkZXIudHMiLCJQaXBlbGluZS50cyIsIk1hdHJpeC50cyIsIm5vZGVfbW9kdWxlcy9ncmFwaGljc3gvZ3JhcGhpY3MudHMiLCJ1dGlscy50cyIsIkltYWdlLnRzIiwibWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQ0FBO0lBR0ksWUFBWSxHQUFHLElBQWE7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxRQUF3QztRQUN4QyxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDLENBQUM7WUFDdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDekIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxDQUFRO1FBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVELFNBQVM7UUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDeEMsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFRO1FBQ1AsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFRLEVBQUMsTUFBYTtRQUN2QixN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QkFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixDQUFDO1FBQ0YsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDVixDQUFDO0lBRUQsT0FBTyxDQUFDLENBQVE7UUFDYixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN2QixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVEsRUFBQyxHQUFVO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN2QixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdkIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLENBQUMsQ0FBQyxHQUFHO1FBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLEdBQUc7UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLENBQUMsR0FBRztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcs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QUFJLENBQUE7SUFDZixDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsT0FBTztRQUNILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBU0QsS0FBSyxDQUFDLEtBQVk7UUFDZCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3pCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDekIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDcEMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDcEMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FB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SUFBSSxDQUFDLEtBQUssR0FBRztZQUNULElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUVGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUVGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUVGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUVGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEIsQ0FBQztZQUNGLElBQUksSUFBSSxDQUFDO2dCQUNMLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FB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QyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQTtRQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUE7UUFDaEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDMUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNWLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDVixNQUFNLENBQUMsR0FBRyxDQUFBO0lBQ2QsQ0FBQztJQUlELFFBQVEsQ0FBQyxDQUFVLEVBQUMsQ0FBVSxFQUFDLENBQVUsRUFBQyxJQUFTLEVBQUMsRUFBdUI7UUFDdkUsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3RCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUUzQixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDckIsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzVCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyQixJQUFJLFdBQVcsR0FBWSxJQUFJLENBQUE7UUFFL0IsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENB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QUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7U0FDWixDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFZO1FBQ3BCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMxQixNQUFNLENBQUMsSUFBSSxNQUFNLENBQUM7WUFDZCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxFQUFDLElBQUksRUFBQyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7WUFDaEIsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7WUFDZixDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUNaLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQVk7UUFDcEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQztZQUNkLENBQUMsSUFBSSxFQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsSUFBSSxFQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1NBQ1osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBWTtRQUNwQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDMUIsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDO1lBQ2QsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNoQixDQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNmLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7U0FDWixDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDUCxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUM7WUFDZCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUNaLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUTtRQUNYLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQztZQUNkLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1NBQ1osQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBWSxFQUFDLE1BQWEsRUFBQyxHQUFVLEVBQUMsSUFBVyxFQUFDLEtBQVk7UUFDNUUsSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQTtRQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFBO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQztZQUNkLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7U0FDWixDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFVLEVBQUMsTUFBYSxFQUFDLEVBQVM7UUFDNUMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLEVBQVMsQ0FBQTtRQUNiLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDN0IsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDO1lBQ2QsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUssS0FBSyxDQUFDLENBQUMsRUFBSyxDQUFDLENBQUM7WUFDdEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQVEsRUFBRSxDQUFDLENBQUMsRUFBUSxDQUFDLENBQUM7WUFDdEMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUcsT0FBTyxDQUFDLENBQUMsRUFBRyxDQUFDLENBQUM7WUFDdEMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQU8sR0FBRyxDQUFDLENBQUMsRUFBTyxDQUFDLENBQUM7U0FDekMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELE9BQU87SUFFUCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0osTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNaLENBQUM7SUFHRCxtQkFBbUI7SUFDbkIsMEJBQTBCO0lBQzFCLEdBQUcsQ0FBQyxDQUFRO1FBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvRixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQy9GLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDL0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvRixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsY0FBYztRQUNkLG1CQUFtQjtRQUNuQixJQUFJO0lBQ1IsQ0FBQztDQUVKO0FDbElEO0lBR0ksWUFBbUIsSUFBNkI7UUFBN0IsU0FBSSxHQUFKLElBQUksQ0FBeUI7UUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9GLENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFDOUMsQ0FBQztJQUVELFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLElBQWE7UUFDdEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUE7UUFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNqQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN6QixDQUFDO0lBRUQsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDO1FBQ1IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUE7UUFDOUIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO0lBQ2pDLENBQUM7SUFFRCxTQUFTO1FBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FB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