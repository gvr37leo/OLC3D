class Matrix{
    vals:number[][]

    constructor(){

    }

    mxm(m:Matrix){
        


    }

    mxv(v:Vector){
        var x = v.x * this.vals[0][0] + v.y * this.vals[1][0] + v.z * this.vals[2][0] + this.vals[3][0]
        var y = v.x * this.vals[0][1] + v.y * this.vals[1][1] + v.z * this.vals[2][1] + this.vals[3][1]
        var z = v.x * this.vals[0][2] + v.y * this.vals[1][2] + v.z * this.vals[2][2] + this.vals[3][2]
        var w = v.x * this.vals[0][3] + v.y * this.vals[1][3] + v.z * this.vals[2][3] + this.vals[3][3]
        v.x = x; v.y = y; v.z = z;
        if(w != 0){
            v.scale(1/w)
        }
    }

}