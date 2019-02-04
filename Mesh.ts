

class Mesh{
    faces:Face[] = []
    vertices:Vector[] = []
    normals:Vector[] = []
    uvs:Vector[] = []

    constructor(){

    }

    c(){
        var copy = new Mesh()
        copy.faces = this.faces
        copy.vertices = this.vertices.map(v => v.c())
        copy.normals = this.normals.map(v => v.c())
        copy.uvs = this.uvs.map(v => v.c())
        return copy;
    }

    static loadObj(filePath:string):Mesh{
        var file:string
        var mesh = new Mesh()
        var lines = file.split('\n')
        for(var line of lines){
            var splittedLine = line.split(' ')
            var type = splittedLine[0]
            if(type == 'v'){
                mesh.vertices.push(new Vector(0,0,0))
            }else if(type == 'f'){
                mesh.faces.push(new Face([
                    new Vertex(0,0,0),
                    new Vertex(0,0,0),
                    new Vertex(0,0,0),
                ]))
            }else if(type == 'vt'){ 
                mesh.uvs.push(new Vector(0,0))
            }else if(type == 'n'){
                mesh.normals.push(new Vector(0,0,0))
            }
        }
        return mesh
    }

    static triangle():Mesh{
        var tri = new Mesh()
        tri.vertices = [
            new Vector(-1,1,0),
            new Vector(1,1,0),
            new Vector(-1,-1,0),
        ]
        tri.faces = [
            new Face([
                new Vertex(0,0,0),
                new Vertex(1,1,0),
                new Vertex(2,2,0),
            ])
        ]
        tri.normals = [
            new Vector(0,0,-1)
        ]
        tri.uvs = [
            new Vector(0,0),
            new Vector(1,0),
            new Vector(0,1),
        ]
        tri.calcNormals()

        return tri;
    }

    static quad():Mesh{
        var quad = new Mesh()
        quad.vertices = [
            new Vector(-1,1,0),
            new Vector(1,1,0),
            new Vector(1,-1,0),
            new Vector(-1,-1,0),
        ]
        quad.uvs = [
            new Vector(0,0),
            new Vector(1,0),
            new Vector(1,1),
            new Vector(0,1),
        ]
        quad.normals = [
            new Vector(0,0,-1)
        ]
        quad.faces = [
            new Face([
                new Vertex(0,0,0),
                new Vertex(1,1,0),
                new Vertex(2,2,0),
            ]),
            new Face([
                new Vertex(2,2,0),
                new Vertex(3,3,0),
                new Vertex(0,0,0),
            ])
        ]

        return quad
    }

    static cube(){
        var cube = new Mesh()
        cube.vertices = [
            new Vector(-1, 1, -1),
            new Vector(1, 1, -1),
            new Vector(1, -1, -1),
            new Vector(-1, -1, -1),

            new Vector(-1, 1, 1),
            new Vector(1, 1, 1),
            new Vector(1, -1, 1),
            new Vector(-1, -1, 1),
        ]
        cube.uvs = [
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(0, 1),

            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(0, 1),
        ]
        cube.normals = [
            new Vector(0,0,-1)
        ]
        cube.faces = [
            new Face([//front
                new Vertex(0,0,0),
                new Vertex(1,1,0),
                new Vertex(3,3,0),
            ]),
            new Face([
                new Vertex(1,1,0),
                new Vertex(2,2,0),
                new Vertex(3,3,0),
            ]),

            new Face([//right
                new Vertex(1,0,0),
                new Vertex(6,2,0),
                new Vertex(2,3,0),
            ]),
            new Face([
                new Vertex(1,0,0),
                new Vertex(5,1,0),
                new Vertex(6,2,0),
            ]),

            new Face([//back
                new Vertex(5,0,0),
                new Vertex(4,1,0),
                new Vertex(6,3,0),
            ]),
            new Face([
                new Vertex(4,1,0),
                new Vertex(7,2,0),
                new Vertex(6,3,0),
            ]),

            new Face([//left
                new Vertex(4,0,0),
                new Vertex(0,1,0),
                new Vertex(3,2,0),
            ]),
            new Face([
                new Vertex(4,0,0),
                new Vertex(3,2,0),
                new Vertex(7,3,0),
            ]),

            new Face([//top
                new Vertex(0,0,0),
                new Vertex(4,1,0),
                new Vertex(1,3,0),
            ]),
            new Face([
                new Vertex(4,1,0),
                new Vertex(5,2,0),
                new Vertex(1,3,0),
            ]),

            new Face([//bot
                new Vertex(3,0,0),
                new Vertex(6,2,0),
                new Vertex(7,3,0),
            ]),
            new Face([
                new Vertex(3,0,0),
                new Vertex(2,1,0),
                new Vertex(6,2,0),
            ]),
            
        ]

        return cube
    }

    calcNormals(){

    }
}

class Face{
    

    constructor(public vertices:Vertex[]){

    }
}

class Vertex{

    constructor(
        public position:number,
        public uv:number,
        public normal:number){

    }

    pos(mesh:Mesh):Vector{
        return mesh.vertices[this.position]
    }

    toArray(mesh:Mesh){
        var pos = mesh.vertices[this.position]
        var nor = mesh.normals[this.normal]
        var uv = mesh.uvs[this.uv]
        return [...pos.vals,...nor.vals,...uv.vals]
    }
}