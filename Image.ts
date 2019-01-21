class Sprite{

    
    size:Vector
    image:HTMLImageElement
    constructor(public imageData:ImageData){
        this.size = new Vector(imageData.width,imageData.height)
    }

    static fromString(url:string):Promise<Sprite>{
        var image = new Image()
        image.src = url
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        
        var promise = new Promise<Sprite>((res,rej) => {
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0 );
                var myData = context.getImageData(0, 0, image.width, image.height);
                var sprite = new Sprite(myData)
                sprite.image = image
                res(sprite)
            }    
        })
        return promise
    }


    index(x,y){
        return (this.imageData.width * y + x) * 4
    }

    getUV(u,v):number[]{
        return this.getPixel(Math.floor(this.size.x * u), Math.floor(this.size.y * v))
    }

    getPixel(x,y):number[]{
        var i = this.index(x,y)
        return this.imageData.data.slice(i,i + 4) as any
    }

    putPixel(){

    }
}