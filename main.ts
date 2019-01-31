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

line3d(new Vector(0,0,100),new Vector(1,0,1), (a,b,t,p) => {
    console.log(t,p)
})

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



//wat wil ik
//ik wil van vec a naar vec b
// en gegeven van procentueel 2d linear t
// wil ik weten hoever zit ik hier procentueel 3d perspectief t