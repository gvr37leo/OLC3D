

class Mesh{
    faces:Face[] = []
    vertices:Vector[] = []
    normals:Vector[] = []
    uvs:Vector[] = []

    static triangle():Mesh{
        var tri = new Mesh()
        tri.vertices = [
            new Vector(-1,0.8,0),
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
            new Vector(-1,1),
            new Vector(1,1),
            new Vector(1,-1),
            new Vector(-1,-1),
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