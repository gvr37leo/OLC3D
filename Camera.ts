class Camera{
    pos:Vector
    forward:Vector
    rotspeed = 1
    movespeed = 1
    constructor(){

    }

    update(dt){
        if(keys[87]){
            this.pos.z += dt * this.rotspeed
        }
        if(keys[83]){
            this.pos.z -= dt * this.rotspeed
        }
        if(keys[65]){
            this.pos.add(this.right().scale(dt * this.movespeed))
        }
        if(keys[68]){
            this.pos.add(this.right().scale(dt * this.movespeed * -1))
        }
    }

    right():Vector{
        return null
    }
}