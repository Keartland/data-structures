class Particle {
    constructor(x, y, r, speed){
        this.x = x;
        this.y = y;
        this.r = r;
        this.goal = this.genRandom();
        this.speed = speed;
        this.colour = '#000000'
    }
    setGoal(goal){
        var newX = goal.x
        var newY = goal.y
        this.goal = {x:newX > canvas.width ? canvas.width : newX, y:newY > canvas.height ? canvas.height : newY};
    }
    genRandom(){
        var newX = canvas.width
        var newY = canvas.height
        while (newX == canvas.width || newY == canvas.height) {
            newX = (this.x+ Math.random()*canvas.width - canvas.width/2)
            newY = (this.y + Math.random()*canvas.height - canvas.height/2)
            newX = newX > canvas.width || newX < 0 ? canvas.width : newX
            newY = newY > canvas.height || newY < 0 ? canvas.height : newY
        }
        return {x:newX > canvas.width ? canvas.width : newX, y:newY > canvas.height ? canvas.height : newY}
    }
    setColour(col){
        this.colour = col
    }
    move(dt){
        this.x += dt*(this.goal.x - this.x)/this.speed
        this.y += dt*(this.goal.y - this.y)/this.speed
        if(this.intersects(new Particle(this.goal.x, this.goal.y, this.r, 0))){
            this.goal = this.genRandom();
        }
    }
    intersects(other) {
        return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2) < this.r + other.r
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }
}

class Rect {
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.colour = '#FFFFFF';
    }
    setColour(col){
        this.colour = col;
    }
    contains(p){
        return (p.x > this.x &&
            p.x < this.x + this.w &&
            p.y > this.y &&
            p.y < this.y + this.h
        );
    }
    intersects(other){
        return !(
            this.x > other.x + other.w ||
            other.x > this.x + this.w ||
            this.y > other.y + other.h ||
            other.y > this.y + this.h
        );
    }
    draw(){
        ctx.beginPath();
        ctx.strokeStyle = this.colour;
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
    }
}

class QuadTree {
    constructor(bounds, bucket){
        this.bounds = bounds;
        this.bucket = bucket;
        this.points = [];
        this.divided = false;
        this.dBounds = true;
    }
    subdivide(){
        var tl = new Rect(this.bounds.x, this.bounds.y, this.bounds.w /2, this.bounds.h/2 );
        this.topleft = new QuadTree(tl, this.bucket);
        var tr = new Rect(this.bounds.x + this.bounds.w/2, this.bounds.y, this.bounds.w /2, this.bounds.h/2 );
        this.topright = new QuadTree(tr, this.bucket);
        var bl = new Rect(this.bounds.x, this.bounds.y + this.bounds.h/2, this.bounds.w /2, this.bounds.h/2 );
        this.bottomleft = new QuadTree(bl, this.bucket);
        var br = new Rect(this.bounds.x + this.bounds.w/2, this.bounds.y + this.bounds.h/2, this.bounds.w /2, this.bounds.h/2 );
        this.bottomright = new QuadTree(br, this.bucket);
        this.divided = true;
    }
    add(p){
        if (!this.bounds.contains(p)){
            return;
        }
        if (this.points.length < this.bucket){
            this.points.push(p)
        } else {
            if(!this.divided){
                this.subdivide()
            }
            this.topleft.add(p)
            this.topright.add(p)
            this.bottomleft.add(p)
            this.bottomright.add(p)
        }
    }

    getPoints(range, found){
        if (!found){ var found = []; }
        if (this.bounds.intersects(range)){
            for (var p of this.points){
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided){
                this.topleft.getPoints(range, found)
                this.topright.getPoints(range, found)
                this.bottomleft.getPoints(range, found)
                this.bottomright.getPoints(range, found)
            }
        }
        return found;
    }

    draw(){
        this.bounds.draw()
        if(this.divided){
            this.topleft.draw();
            this.topright.draw();
            this.bottomleft.draw();
            this.bottomright.draw();
        }
    }
}

function background(){
    // draw background
    ctx.beginPath();
    ctx.fillStyle = '#293241';
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

}
function update(){
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now

    frames++;
    background();
    var quadTree = new QuadTree(new Rect(0, 0, canvas.width, canvas.height), 1);
    for(p of particles) {
        p.move(dt);
        p.setColour("#000000")
        quadTree.add(p);
    }
    for(p of particles) {
        let others = quadTree.getPoints(new Rect(p.x - 2*p.r, p.y - 2*p.r, 4*p.r, 4*p.r), []);
        if (document.getElementById('drawQuad').checked) { new Rect(p.x - 2*p.r, p.y - 2*p.r, 4*p.r, 4*p.r).draw() }

        for(o of others) {
            if(o != p && p.intersects(o)){
                p.setColour("#FFFFFF")
                o.setColour("#FFFFFF")
            }
        }
        p.draw();
    }
    if (document.getElementById('drawQuad').checked) { quadTree.draw(); }
    if (Math.abs(new Date().getTime()/1000 - lastsecond) > 1){
        lastFrames = frames
        lastsecond = new Date().getTime()/1000 ;
        frames = 0
    }
    ctx.font = "30px Arial";
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText("framerate: "+lastFrames, 10, 50);
}
function regenParticles(){
    document.getElementById('sliderLabel').innerHTML = document.getElementById('particlesCount').value
    particles =[]
    for (var i = 0; i < document.getElementById('particlesCount').value; i++) {
        var p = new Particle(Math.random()*canvas.width + 1, Math.random()*canvas.height + 1, Math.random()*10 + 4, Math.random()*1000+500)
        particles.push(p)
    }
}
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
lastFrames=0
frames=0
lastsecond = new Date().getTime();
particles =[]
for (var i = 0; i < 250; i++) {
    var p = new Particle(Math.random()*canvas.width + 1, Math.random()*canvas.height + 1, Math.random()*10 + 4, Math.random()*1000+500)
    particles.push(p)
}
document.onmousedown = function(e){
    for(p of particles) {
        p.setGoal({x:e.pageX, y:e.pageY})
    }
}
var lastUpdate = Date.now();
var myInterval = setInterval(update,0)
