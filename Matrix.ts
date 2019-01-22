class Matrix{
    

    constructor(public vals:number[][]){

    }

    c(){

    }

    static translate(v:Vector){
        return new Matrix([
            [1,0,0,v.x],
            [0,1,0,v.y],
            [0,0,1,v.z],
            [0,0,0,1],
        ])
    }
    
    static scale(v:Vector){
        return new Matrix([
            [v.x,0,0,0],
            [0,v.y,0,0],
            [0,0,v.z,0],
            [0,0,0,1],
        ])
    }

    static rotx(theta:number){
        var cost = Math.cos(theta)
        var sint = Math.sin(theta)
        return new Matrix([
            [1,0,0,0],
            [0,cost,-sint,0],
            [0,sint,cost,0],
            [0,0,0,1],
        ])
    }

    static roty(theta:number){
        var cost = Math.cos(theta)
        var sint = Math.sin(theta)
        return new Matrix([
            [cost,0,sint,0],
            [0,1,0,0],
            [-sint,0,cost,0],
            [0,0,0,1],
        ])
    }

    static rotz(theta:number){
        var cost = Math.cos(theta)
        var sint = Math.sin(theta)
        return new Matrix([
            [cost,-sint,0,0],
            [sint,cost,0,0],
            [0,0,1,0],
            [0,0,0,1],
        ])
    }

    static zero(){
        return new Matrix([
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
        ])
    }

    static identity(){
        return new Matrix([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1],
        ])
    }

    static projection(width:number,height:number,fov:number,zFar:number,zNear:number){
        var a = height / width
        var f = 1 / Math.tan(fov / 2)
        var q = zFar / (zFar - zNear)
        return new Matrix([
            [a*f,0,0,0],
            [0,f,0,0],
            [0,0,q,-zNear * q],
            [0,0,1,0],
        ])
    }

    static lookAt(pos:Vector,target:Vector,up:Vector){
        var forward = pos.to(target).normalize()
        var up:Vector
        var right = up.cross(forward)
        return new Matrix([
            [right.x,   right.y,    right.z,    0],
            [up.x,      up.y,       up.z,       0],
            [forward.x, forward.y,  forward.z,  0],
            [pos.x,     pos.y,      pos.z,      1],
        ])
    }

    inverse(){

    }

    mxm(m:Matrix){
        var matrix = Matrix.zero();
		for (var c = 0; c < 4; c++)
			for (var r = 0; r < 4; r++)
				matrix.vals[r][c] = this.vals[r][0] * this.vals[0][c] + this.vals[r][1] * m.vals[1][c] + this.vals[r][2] * m.vals[2][c] + this.vals[r][3] * m.vals[3][c];
		return matrix;
    }


    //matrix bottomleft
    //vector vertical topright
    mxv(v:Vector){
        var x = v.x * this.vals[0][0] + v.y * this.vals[0][1] + v.z * this.vals[0][2] + this.vals[0][3]
        var y = v.x * this.vals[1][0] + v.y * this.vals[1][1] + v.z * this.vals[1][2] + this.vals[1][3]
        var z = v.x * this.vals[2][0] + v.y * this.vals[2][1] + v.z * this.vals[2][2] + this.vals[2][3]
        var w = v.x * this.vals[3][0] + v.y * this.vals[3][1] + v.z * this.vals[3][2] + this.vals[3][3]
        v.x = x; v.y = y; v.z = z;
        // if(w != 0){
        //     v.scale(1/w)
        // }
    }

}