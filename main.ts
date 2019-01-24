/// <reference path="Camera.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Mesh.ts" />
/// <reference path="Shader.ts" />
/// <reference path="Pipeline.ts" />
/// <reference path="Matrix.ts" />
/// <reference path="node_modules/graphicsx/graphics.ts" />
/// <reference path="utils.ts" />
/// <reference path="Image.ts" />
var sz = new Vector(800,400)

var positions = [new Vector(-1,-1,5),new Vector(0,1,5),new Vector(1,-1,5)]
var projectionMat = Matrix.projection(sz.x,sz.y,Math.PI,1000,0.1)
var rotz = Matrix.rotz(Math.PI / 2)
var transmat = Matrix.translate(new Vector(3,0,0))
var finalMat = Matrix.pipeMatrices([transmat])
positions.forEach(finalMat.mxv.bind(finalMat))


async function start(){

    // var image = await Sprite.fromString("img/uvtest.png")
    var image = await Sprite.fromString("img/house.png")
    var crret = createCanvas(sz.x,sz.y)
    var canvas = crret.canvas
    var ctxt = crret.ctxt
    var gfx = new Graphics(ctxt)
    var pipeline = new Pipeline()
    var mesh = Mesh.cube()
    

    var light = null

    pipeline.shader = new Shader((v:number[],index:number,normal:Vector) => {
        var color = image.getUV(v[6],v[7])
        
        gfx.putPixel(v[0],v[1],color)
        
    })

    // loop((dt) => {
        ctxt.clearRect(0,0,sz.x,sz.y)
        gfx.load()
        // pipeline.draw(mesh)
        gfx.flush()
    // })
}
start()



