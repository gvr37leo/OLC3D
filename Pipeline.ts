
class Pipeline{
    depthbuffer:number[][]
    cameraPos:Vector = new Vector(0,0,0)
    cameraDir:Vector = new Vector(0,0,1)
    cameraUp:Vector = new Vector(0,1,0)
    shader:Shader

    draw(mesh:Mesh){

        for(var i = 0; i < mesh.faces.length; i++){
            var face:Face = mesh.faces[i]
            
            
            
            
            var positions = [a.pos(mesh),b.pos(mesh),c.pos(mesh)]
            var mattrans = Matrix.translate(new Vector(0,0,1))
            var matrotx = Matrix.rotx(0)
            var matroty = Matrix.roty(0)
            var worldMat = Matrix.pipeMatrices([mattrans,matrotx,matroty])


            var cameraMat = Matrix.lookAt(this.cameraPos,this.cameraPos.c().add(this.cameraDir),this.cameraUp)
            cameraMat.inverse()

            var projectionMat = Matrix.projection(sz.x,sz.y,Math.PI,1000,0.1)
            mesh.vertices.forEach(worldMat.mxv.bind(mattrans))

            
            
            
            
            
            
            var a = face.vertices[0]
            var b = face.vertices[1]
            var c = face.vertices[2]

            var ascr = this.screentransform(a.toArray(mesh))
            var bscr = this.screentransform(b.toArray(mesh))
            var cscr = this.screentransform(c.toArray(mesh))

            var a2b = a.pos(mesh).to(b.pos(mesh))
            var a2c = a.pos(mesh).to(c.pos(mesh))
            var normal = a2b.cross(a2c).normalize();
            var cameraRay = this.cameraPos.to(a.pos(mesh))
            if(normal.dot(cameraRay) < 0){
                this.triangle(ascr,bscr,cscr,mesh,v => {
                    this.shader.process(v,i,normal)
                })
            }

        }
    }

    screentransform(pos:number[]):number[]{
        var screensize = new Vector(800,400)
        var ratio = screensize.y / screensize.x
        var x = ((pos[0] + 1) * (screensize.x / 2)) * ratio + screensize.x * ratio * 0.5
        var y = (-pos[1] + 1) * (screensize.y / 2)
        pos[0] = x
        pos[1] = y
        return pos
    }



    triangle(a:number[],b:number[],c:number[],mesh:Mesh,cb:(v:number[]) => void){
        var vertices = [a,b,c]
        sortby(vertices, v => v[1])

        var top = vertices[0]
        var middleLeft = vertices[1]
        var bot = vertices[2]
        var middleRight:number[] = null

        var ratio = to(top[1],middleLeft[1]) / to(top[1],bot[1])
        var middleRight = top.slice()
        Pipeline.maplerp(top,bot,middleRight,ratio)

        if (middleLeft[0] > middleRight[0]){
            var temp = middleLeft
            middleLeft = middleRight
            middleRight = temp
        }

        this.walk(top,top,middleLeft,middleRight,mesh,cb)
        this.walk(middleLeft,middleRight,bot,bot,mesh,cb)

    }
    

    private walk(tl:number[],tr:number[],bl:number[],br:number[],mesh:Mesh,cb:(v:number[]) => void){
        var lefttemp:number[] = new Array(tl.length)
        var righttemp:number[] = new Array(tl.length)
        var hortemp:number[] = new Array(tl.length)

        var distToPixelCenterY = to(tl[1], (Math.ceil(tl[1] - 0.5) + 0.5))

        for(var y = tl[1] + distToPixelCenterY; y < bl[1]; y++){
            var ratioy = Pipeline.inverselerp(tl[1],bl[1],y)
            Pipeline.maplerp(tl,bl,lefttemp,ratioy)
            Pipeline.maplerp(tr,br,righttemp,ratioy)
            lefttemp[1] = Math.floor(lefttemp[1])
            righttemp[1] = Math.floor(righttemp[1])

            var distToPixelCenterX = to(lefttemp[0], (Math.ceil(lefttemp[0] - 0.5) + 0.5))
            for(var x = lefttemp[0] + distToPixelCenterX; x < righttemp[0]; x++){
                var ratiox = Pipeline.inverselerp(lefttemp[0], righttemp[0], x)
                Pipeline.maplerp(lefttemp,righttemp,hortemp,ratiox)
                hortemp[0] = Math.floor(hortemp[0])
                cb(hortemp)
            }
        }
    }
    static maplerp(from:number[],to:number[],buffer:number[],t:number){
        this.map(from,buffer,(v,i) => this.lerp(v,to[i],t))
    }

    static map<T,U>(arr:T[],buffer:U[],cb:(val:T,i:number) => U):U[]{
        for(var i = 0; i < arr.length; i++){
            buffer[i] = cb(arr[i],i)
        }
        return buffer
    }

    static inverselerp(a:number,b:number,v:number){
        return (v - a) / (b - a)
    }

    static lerp(a:number,b:number,t:number){
        return a + (b - a) * t
    }

    static remap(r1a:number,r1b:number,r2a:number,r2b:number,v:number){
        this.lerp(r2a,r2b,this.inverselerp(r1a,r1b,v))
    }
}