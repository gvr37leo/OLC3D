

class Mesh{
    faces:Face[] = []
    vertices:Vector[] = []
    normals:Vector[] = []
    uvs:Vector[] = []

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
            new Face([
                new Vertex(0,0,0),
                new Vertex(1,1,0),
                new Vertex(3,3,0),
            ]),
            new Face([
                new Vertex(1,1,0),
                new Vertex(2,2,0),
                new Vertex(3,3,0),
            ]),

            new Face([
                new Vertex(1,1,0),
                new Vertex(6,6,0),
                new Vertex(2,2,0),
            ]),
            new Face([
                new Vertex(1,1,0),
                new Vertex(5,5,0),
                new Vertex(6,6,0),
            ]),

            new Face([
                new Vertex(5,5,0),
                new Vertex(4,4,0),
                new Vertex(6,6,0),
            ]),
            new Face([
                new Vertex(4,4,0),
                new Vertex(7,7,0),
                new Vertex(6,6,0),
            ]),

            new Face([
                new Vertex(4,4,0),
                new Vertex(0,0,0),
                new Vertex(3,3,0),
            ]),
            new Face([
                new Vertex(4,4,0),
                new Vertex(3,3,0),
                new Vertex(7,7,0),
            ]),

            new Face([
                new Vertex(0,0,0),
                new Vertex(4,4,0),
                new Vertex(1,1,0),
            ]),
            new Face([
                new Vertex(4,4,0),
                new Vertex(5,5,0),
                new Vertex(1,1,0),
            ]),

            new Face([
                new Vertex(3,3,0),
                new Vertex(6,6,0),
                new Vertex(7,7,0),
            ]),
            new Face([
                new Vertex(3,3,0),
                new Vertex(2,2,0),
                new Vertex(6,6,0),
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