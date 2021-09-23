class RigidBody{
  constructor(m, p0, v0){
    this.m = m
    this.p = p0
    this.v = v0
    this.a = createVector(0, 0)
    this.f = createVector(0, 0)
    this.lastUpdate = millis()
    this.radius = m/100
  }
  
update(){
    let t = (millis()-this.lastUpdate)/1000
    
    //Sum of forces
    this.f = p5.Vector.add(createVector(0, g.value()/100*this.m))
    if(mouseIsPressed && mouseY < boxHeight){
      let attraction = createVector(mouseX-this.p.x, mouseY-this.p.y)
      attraction.setMag(attractionForce)
      this.f.add(attraction)
    }
    
    //a = F/m
    this.a = p5.Vector.div(this.f, this.m)
    this.v.add(p5.Vector.mult(this.a, t))
    this.p.add(p5.Vector.mult(this.v, t))
    
    this.lastUpdate = millis()
  }
  
  draw(){
    strokeWeight(this.radius*2)
    point(this.p.x, this.p.y)
    
    strokeWeight(1)
    
    if(showVel.checked()){
      stroke(3, 240, 252)
      line(this.p.x, this.p.y, this.p.x+this.v.x, this.p.y+this.v.y)
    }
    if(showAcc.checked()){
      stroke(0, 255, 110)
      line(this.p.x, this.p.y, this.p.x+this.a.x, this.p.y+this.a.y)
    }
    
    stroke(255)
  }
}
