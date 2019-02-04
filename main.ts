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

// line3d(new Vector(0,0,100),new Vector(1,0,1), (a,b,t,p) => {
//     console.log(t,p)
// })

async function start(){

    // var image = await Sprite.fromString("img/uvtest.png")
    var image = await Sprite.fromString("img/house.png")
    var crret = createCanvas(sz.x,sz.y)
    var canvas = crret.canvas
    var ctxt = crret.ctxt
    var gfx = new Graphics(ctxt)
    var pipeline = new Pipeline(sz)
    var mesh = Mesh.cube()
    

    var light = null

    pipeline.shader = new Shader((v:Test,index:number,normal:Vector) => {
        var color = image.getUV(v.vertex[6],v.vertex[7])
        
        pipeline.putPixelZTest(v.screenpos.x,v.screenpos.y,v.vertex[2],color,gfx)
    })

    
    var xrot = 0
    var yrot = 0
    var rotspeed = 1
    loop((dt) => {
        dt /= 1000
        console.log(dt)

        if(keys[87]){
            xrot += dt * rotspeed
        }
        if(keys[83]){
            xrot -= dt * rotspeed
        }
        if(keys[65]){
            yrot += dt * rotspeed
        }
        if(keys[68]){
            yrot -= dt * rotspeed
        }

        var mattrans = Matrix.translate(new Vector(0,0,6))
        var matrotx = Matrix.rotx(xrot)
        var matroty = Matrix.roty(yrot)
        var matrotz = Matrix.rotz(0)
        var matScale = Matrix.scale(new Vector(1,1,1))
        pipeline.worldMatrix = Matrix.pipeMatrices([matrotx,matroty,matrotz,matScale,mattrans])
        pipeline.cameraMatrix = Matrix.lookAt(pipeline.cameraPos,pipeline.cameraPos.c().add(pipeline.cameraDir),pipeline.cameraUp)
        pipeline.cameraMatrix = pipeline.cameraMatrix.mathInverse()

        ctxt.clearRect(0,0,sz.x,sz.y)
        pipeline.clearDepthBuffer()
        gfx.load()
        pipeline.draw(mesh)
        gfx.flush()
    })
}
start()



//wat wil ik
//ik wil van vec a naar vec b
// en gegeven van procentueel 2d linear t
// wil ik weten hoever zit ik hier procentueel 3d perspectief t