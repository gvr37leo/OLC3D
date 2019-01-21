
class Pipeline{
    depthbuffer:number[][]

    draw(mesh:Mesh){

        for(var i = 0; i < mesh.faces.length; i++){
            var face = mesh.faces[i]
            
            var a = this.screentransform(face.indices[0].toArray(mesh))
            var b = this.screentransform(face.indices[1].toArray(mesh))
            var c = this.screentransform(face.indices[2].toArray(mesh))
            // var normal = a.getPos().to(b.getPos()).cross(a.getPos().to(c.getPos())).normalize()
            this.triangle(a,b,c,mesh,v => {
                mesh.shader.process(v,i,normal)
            })

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

        var distToPixelCenter = to(tl[1], (Math.ceil(tl[1] - 0.5) + 0.5))

        for(var y = tl[1] + distToPixelCenter; y < bl[1]; y++){
            var ratioy = Pipeline.inverselerp(tl[1],bl[1],y)
            Pipeline.maplerp(tl,bl,lefttemp,ratioy)
            Pipeline.maplerp(tr,br,righttemp,ratioy)
            lefttemp[1] = Math.floor(lefttemp[1])
            righttemp[1] = Math.floor(righttemp[1])

            for(var x = lefttemp[0]; x < righttemp[0]; x++){
                var ratiox = Pipeline.inverselerp(lefttemp[0], righttemp[0], x)
                Pipeline.maplerp(lefttemp,righttemp,hortemp,ratiox)
                hortemp[0] = Math.round(hortemp[0])
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