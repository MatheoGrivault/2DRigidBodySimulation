class RigidBody{
  constructor(m, p0, v0){
    this.m = m
    this.p = p0
    this.v = v0
    this.lastUpdate = millis()
    this.radius = m/100
  }
  
update(){
    let t = (millis()-this.lastUpdate)/1000
    
    //Sum of forces
    let netForce = p5.Vector.add(createVector(0, g.value()/100*this.m))
    if(mouseIsPressed && mouseY < boxHeight){
      let attraction = createVector(mouseX-this.p.x, mouseY-this.p.y)
      attraction.setMag(attractionForce)
      netForce.add(attraction)
    }
    
    //a = F/m
    let a = p5.Vector.div(netForce, this.m)
      
    this.v.add(p5.Vector.mult(a, t))
    this.p.add(p5.Vector.mult(this.v, t))
    
    this.lastUpdate = millis()
  }
  
  draw(){
    strokeWeight(this.radius*2)
    point(this.p.x, this.p.y)
  }
}