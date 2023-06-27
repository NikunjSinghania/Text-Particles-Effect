const canvas = document.getElementById('effect')
const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

let particleArray = []

let adjustX = 10
let adjustY = 0

const mouse = {
    x: null,
    y: null,
    radius: 50
}

window.addEventListener('mousemove', (e)=>{
    mouse.x = e.x
    mouse.y = e.y
});

ctx.fillStyle = 'white'
ctx.font = '40px comic san ms'
ctx.fillText('PFLOW', 0, 40)

//ctx.strokeStyle = 'white'
//ctx.strokeRect(0, 0, 100, 100)
const textCoord = ctx.getImageData(0, 0, 100, 100)

class Particle{
    constructor(x, y){
        this.x = x
        this.y = y
        this.size = 2
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 30) + 50
    }
    draw(){
        ctx.fillStyle = '#f0f'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
        ctx.closePath()
        ctx.fill()
    }

    update(){
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx*dx + dy*dy)
        let forceDirectionX = dx/distance
        let forceDirectionY = dy/distance
        let maxDistance =  mouse.radius
        let force = (maxDistance - distance) / maxDistance
        let directionX = forceDirectionX * force * this.density
        let directionY = forceDirectionY * force * this.density

        if(distance < mouse.radius)
        {
            this.x -= directionX
            this.y -= directionY
        }
        else
        {
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX
                this.x -= dx/10
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY
                this.y -= dy/10
            }
        }
    }
}

function init(){
    particleArray = []
    /*
    for(let i=0;i<1000;i++){
        let x = Math.random() * canvas.width
        let y = Math.random() * canvas.height
        particleArray.push(new Particle(x, y))
    }*/


    for(let y=0, y2 = textCoord.height; y < y2; y++){
        for(let x=0,x2 = textCoord.width; x < x2; x++){
            if(textCoord.data[(y*4*textCoord.width) + (x*4) + 3] > 128){
                let positionX = x + adjustX
                let positionY = y + adjustY

                particleArray.push(new Particle(positionX*14, positionY*14))
            }
        }
    }
}

init()
console.log(particleArray);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for(let i=0;i<particleArray.length;i++){
        particleArray[i].draw()
        particleArray[i].update()
    }
    connect()
    requestAnimationFrame(animate)
}

animate()


function connect(){
    let opacityValue = 1
    for(let a=0;a<particleArray.length;a++){
        for(let b=a;b<particleArray.length;b++){
            let dx = particleArray[a].x - particleArray[b].x
            let dy = particleArray[a].y - particleArray[b].y
            let distance = Math.sqrt(dx*dx + dy*dy)
            opacityValue = 1- (distance/50)
            if(distance < 20){
                ctx.strokeStyle = 'rgba(255,255,'+distance+','+opacityValue+')'
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(particleArray[a].x, particleArray[a].y)
                ctx.lineTo(particleArray[b].x, particleArray[b].y)
                ctx.stroke()
            }
        }
    }
}