/// <reference path="Camera.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Mesh.ts" />
/// <reference path="Shader.ts" />
/// <reference path="Pipeline.ts" />
/// <reference path="Matrix.ts" />
/// <reference path="node_modules/graphicsx/graphics.ts" />
/// <reference path="utils.ts" />




var crret = createCanvas(800,400)
var canvas = crret.canvas
var ctxt = crret.ctxt
var gfx = new Graphics(ctxt)
var pipeline = new Pipeline()
var mesh = Mesh.triangle()

var image = null
var light = null
var color = null

mesh.shader = new Shader((v:number[],index:number,normal:Vector) => {
    // var color = image.getPixel(v[6],v[7])
    
    color = [255,0,0,255]
    gfx.putPixel(v[0],v[1],color)
    
})

loop((dt) => {
    ctxt.clearRect(0,0,500,500)
    gfx.load()
    pipeline.draw(mesh)
    gfx.flush()
})

