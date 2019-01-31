
class Pipeline{
    depthbuffer:number[][]
    cameraPos:Vector = new Vector(0,0,0)
    cameraDir:Vector = new Vector(0,0,1)
    cameraUp:Vector = new Vector(0,1,0)
    worldMatrix:Matrix
    cameraMatrix:Matrix
    shader:Shader

    constructor(public sz:Vector){
        this.depthbuffer = createNDimArray([sz.y,sz.x],p => 0)
    }

    draw(mesh:Mesh){

        var mattrans = Matrix.translate(new Vector(0,0,3))
        var matrotx = Matrix.rotx(1.3)
        var matroty = Matrix.roty(0)
        var matrotz = Matrix.rotz(0)
        var matScale = Matrix.scale(new Vector(1,1,1))
        this.worldMatrix = Matrix.pipeMatrices([matrotx,matroty,matrotz,matScale,mattrans])
        this.cameraMatrix = Matrix.lookAt(this.cameraPos,this.cameraPos.c().add(this.cameraDir),this.cameraUp)
        this.cameraMatrix.mathInverse()
        mesh.vertices.forEach(this.worldMatrix.mxv.bind(this.worldMatrix))
        mesh.vertices.forEach(this.cameraMatrix.mxv.bind(this.cameraMatrix))

        for(var i = 0; i < mesh.faces.length; i++){
            var face:Face = mesh.faces[i]
            
            var a = face.vertices[0]
            var b = face.vertices[1]
            var c = face.vertices[2]

            var ascr = this.screentransform(a.pos(mesh).c())
            var bscr = this.screentransform(b.pos(mesh).c())
            var cscr = this.screentransform(c.pos(mesh).c())

            var a2b = a.pos(mesh).to(b.pos(mesh))
            var a2c = a.pos(mesh).to(c.pos(mesh))
            var normal = a2b.cross(a2c).normalize();
            var cameraRay = this.cameraPos.to(a.pos(mesh))
            if(normal.dot(cameraRay) < 0){
                this.triangle(new Test(ascr,a.toArray(mesh)),new Test(bscr,b.toArray(mesh)),new Test(cscr,c.toArray(mesh)),mesh,v => {
                    this.shader.process(v,i,normal)
                })
            }

        }
    }

    screentransform(pos:Vector):Vector{
        var screensize = new Vector(800,400)
        var ratio = screensize.y / screensize.x
        var x = ((pos.x / pos.z + 1) * (screensize.x / 2)) * ratio + screensize.x * ratio * 0.5
        var y = (-pos.y / pos.z + 1) * (screensize.y / 2)
        pos.x = x 
        pos.y = y
        return pos
    }



    triangle(a:Test,b:Test,c:Test,mesh:Mesh,cb:(v:Test) => void){
        var vertices = [a,b,c]
        sortby(vertices, v => v.screenpos.y)

        var top = vertices[0]
        var middleLeft = vertices[1]
        var bot = vertices[2]
        var middleRight:Test = new Test(new Vector(0,0),[])

        var ratio = to(top.screenpos.y,middleLeft.screenpos.y) / to(top.screenpos.y,bot.screenpos.y)
        top.lerp3d(bot,ratio,middleRight)

        if (middleLeft.screenpos.x > middleRight.screenpos.x){
            var temp = middleLeft
            middleLeft = middleRight
            middleRight = temp
        }


        this.walk(top,top,middleLeft,middleRight,mesh,cb)
        this.walk(middleLeft,middleRight,bot,bot,mesh,cb)

    }
    

    private walk(tl:Test,tr:Test,bl:Test,br:Test,mesh:Mesh,cb:(v:Test) => void){
        var lefttemp:Test = new Test(new Vector(0,0),new Array(tl.vertex.length))
        var righttemp:Test = new Test(new Vector(0,0),new Array(tl.vertex.length))
        var hortemp:Test = new Test(new Vector(0,0),new Array(tl.vertex.length))

        //crop y and then z coordinates of tl and bl
        var distToPixelCenterY = to(tl.screenpos.y, (Math.ceil(tl.screenpos.y - 0.5) + 0.5))
        

        for(var y = tl.screenpos.y + distToPixelCenterY; y < bl.screenpos.y; y++){
            var ratioy = inverselerp(tl.screenpos.y,bl.screenpos.y,y)
            tl.lerp3d(bl,ratioy,lefttemp)
            tr.lerp3d(br,ratioy,righttemp)
            lefttemp.screenpos.y = Math.floor(lefttemp.screenpos.y)
            righttemp.screenpos.y = Math.floor(righttemp.screenpos.y)

            //crop x and then z coordinates of lefttemp and righttemp
            var distToPixelCenterX = to(lefttemp.screenpos.x, (Math.ceil(lefttemp.screenpos.x - 0.5) + 0.5))
            for(var x = lefttemp.screenpos.x + distToPixelCenterX; x < righttemp.screenpos.x; x++){
                var ratiox = inverselerp(lefttemp.screenpos.x, righttemp.screenpos.x, x)
                lefttemp.lerp3d(righttemp,ratiox,hortemp)
                hortemp.screenpos.x = Math.floor(hortemp.screenpos.x)
                cb(hortemp)
            }
        }
    }
    static maplerp(from:number[],to:number[],buffer:number[],t:number){
        this.map(from,buffer,(v,i) => lerp(v,to[i],t))
    }

    static map<T,U>(arr:T[],buffer:U[],cb:(val:T,i:number) => U):U[]{
        for(var i = 0; i < arr.length; i++){
            buffer[i] = cb(arr[i],i)
        }
        return buffer
    }

    putPixelZTest(x:number,y:number,z:number,c:number[],gfx:Graphics){
        if(this.depthbuffer[y][x] > z){
            gfx.putPixel(x,y,c)
            this.depthbuffer[y][x] = z
        }
    }

    clearDepthBuffer(){
        sz.loop2d(v => this.depthbuffer[v.y][v.x] = Number.MAX_SAFE_INTEGER)
    }

    
}

class Test{
    
    
    constructor(public screenpos:Vector, public vertex:number[]){

    }

    lerp3d(other:Test,t:number,testOut:Test):void{
        testOut.screenpos = this.screenpos.lerp(other.screenpos,t)
        var invz = lerp(1 / this.vertex[2],1 / other.vertex[2],t)
        var perspectiveCorrectedT = lerp(0,1 / other.vertex[2],t) / invz
        Pipeline.maplerp(this.vertex,other.vertex,testOut.vertex,perspectiveCorrectedT)
    }

}


function line3d(a:Vector,b:Vector,cb:(a:Vector,b:Vector,l:number,p:number) => void){

    for(var t = 0; t <= 1; t += 0.1){
        var z = lerp(a.z, b.z, t)
        var invz = lerp(1 / a.z, 1 / b.z, t)
        var correctz = 1 / invz

        var x = lerp(0, 1 / b.z, t) / invz
        var cz2 = lerp(a.z,b.z,x)
        var q = 0
    }
}