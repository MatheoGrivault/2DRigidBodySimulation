
let boxHeight
let bodies = []
let attractionForce = 100000

let numberOfBodies
let g
let cor
let showVel
let showAcc

function setup() {
  createCanvas(windowWidth, windowHeight);
  boxHeight = windowHeight-40
  numberOfBodies = newSlider(1, 100, 30, 55, boxHeight+1)
  numberOfBodies.input(function(){
    let delta = numberOfBodies.value()-bodies.length
    if(delta < 0){
      for(let i = 0; i<-delta; i++){
        bodies.pop()
      }
    }else if(delta > 0){
      for(let i = 0; i<delta; i++){
        addBody()
      }
    }
  })
  g = newSlider(0, 10000, 981, 55, boxHeight+12)
  cor = newSlider(0, 20, 6, 55, boxHeight+23)
  showVel = newCheckbox(width-25, boxHeight+3)
  showAcc = newCheckbox(width-25, boxHeight+15)
  
  for(let i = 0; i<30; i++){
    addBody()
  }
}

function draw() {
  background(0);
  stroke(255)
  textAlign(LEFT, TOP)
  textSize(12)
  strokeWeight(0)
  
  //Show checkboxes
  fill(3, 240, 252)
  text("Show velocity", width-100, boxHeight+7)
  fill(0, 255, 110)
  text("Show acceleration", width-125, boxHeight+19)
  
  fill(255)
  
  //Show sliders
  text("# bodies", 5, boxHeight+5)
  text(numberOfBodies.value(), 190, boxHeight+5)
  text("g", 5, boxHeight+15)
  text(g.value()/100, 190, boxHeight+15)
  text("COR", 5, boxHeight+25)
  text(cor.value()/10, 190, boxHeight+25)
  
  text(windowWidth+"x"+boxHeight+" meters", width/2, height-15)
  
  //Show attraction force
  if(mouseIsPressed && mouseY < boxHeight){
    textSize(24)
    textAlign(CENTER, CENTER)
    text(round(attractionForce)+" N", mouseX, mouseY-20)
  }
  
  //Update
  for(let i = 0; i<bodies.length; i++){
    let body = bodies[i]
    //Check for collisions
    for(let j = 0; j<bodies.length; j++){
      if(i == j) continue
      let body2 = bodies[j]
      
      if(mag(body.p.x-body2.p.x, body.p.y-body2.p.y) < body.radius+body2.radius){
        solveCollision(body, body2)
      }
    }
      
    if(body.p.y+body.radius > boxHeight){
      body.v.y *= -cor.value()/10
      body.p.y = boxHeight-body.radius
    }
    if(body.p.y-body.radius < 0){
      body.v.y *= -cor.value()/10
      body.p.y = body.radius
    }
    if(body.p.x+body.radius > width){
      body.v.x *= -cor.value()/10
      body.p.x = width-body.radius
    }
    if(body.p.x-body.radius < 0){
      body.v.x *= -cor.value()/10
      body.p.x = body.radius
    }
      
    body.update()
    body.draw()
  }
}

function solveCollision(body1, body2){
  let v1 = body1.v
  let v2 = body2.v
  let m1 = body1.m
  let m2 = body2.m
  
  //Normal vector
  let normal = createVector(body1.p.x-body2.p.x, body1.p.y-body2.p.y)
  normal.normalize()

  //Tangent vector
  let tangent = createVector(-normal.y, normal.x)

  //Projections
  let v1n = p5.Vector.dot(normal, v1)
  let v2n = p5.Vector.dot(normal, v2)
  let v1t = p5.Vector.dot(tangent, v1)
  let v2t = p5.Vector.dot(tangent, v2)

  //Compute normal velocities
  let v1n_ = (v1n*(m1-m2)+2*m2*v2n)/(m1+m2)
  let v2n_ = (v2n*(m2-m1)+2*m1*v1n)/(m1+m2)

  //Final vectors
  let v1nVec = p5.Vector.mult(normal, v1n_)
  let v2nVec = p5.Vector.mult(normal, v2n_)
  let v1tVec = p5.Vector.mult(tangent, v1t)
  let v2tVec = p5.Vector.mult(tangent, v2t)

  body1.v = p5.Vector.add(v1nVec, v1tVec)
  body2.v = p5.Vector.add(v2nVec, v2tVec)
}

function addBody(){
  let m = random(300, 1000)
  let p0 = createVector(random(0, width), random(0, height))
  let v0 = createVector(random(-100, 100), random(-100, 100))
  bodies.push(new RigidBody(m, p0, v0))
}

function newSlider(min, max, def, x, y){
  let s = createSlider(min, max, def)
  s.position(x, y)
  return s
}

function newCheckbox(x, y){
  let c = createCheckbox()
  c.position(x, y)
  return c
}

function mouseWheel(e){
  attractionForce -= e.delta*4
}
