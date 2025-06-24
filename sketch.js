let score= 0;
let lives= 3;
let flashRed=false;
let flashTimer= 0;
let gameStarted=false;
let gameOver= false;
let restartButton;
let pancakeFallSpeed=2;
let tomatoeFallSpeed=3; 


let foodItems= [];
let pancakes= [];
let tomatoes= [];
let dogImg, pancakeImg, tomatoeImg;// images
let dog ={
x:170,
y:300,
speed: 5
};



function preload (){
 
  pancakeImg= loadImage("https://cdn-icons-png.flaticon.com/512/7763/7763317.png");
  dogImg= loadImage("https://www.pitchandpup.com/cdn/shop/files/18.png?v=1697312888&width=1445");
 tomatoeImg= loadImage("https://png.pngtree.com/png-clipart/20240305/original/pngtree-tomatoes-cartoon-with-transparent-background-png-image_14510393.png");

}
function setup() {
  createCanvas(400, 400);
  
  for (let i=0; i<2;i++) {
    pancakes.push({ x: random(0, width-60), y:random(-200, -60)});
    tomatoes.push({ x: random(0, width-50), y:random(-300, -100)});
  }

}

function draw() {
  
  
  if(!gameStarted){
    background(160, 230, 270);
    fill(0);
    textAlign(CENTER,CENTER);
    textSize(32);
    text("🐶 iHop Doggy Days",width/2,height/2-60);
    textSize(20);
    text("Catch pancakes 🍽️ — Avoid tomatoes 🍅",width/2, height/2-20);
    text("Press SPACE to start", width/2,height/2+50);
    text("Speed increases every 10 points", width/2,height/2+130);
    text("Use ← → arrows to move", width/2, height/2+90);
    return;
  }

  //Game Over check
  if(gameOver){
    background(0,192,255); //dark background
    fill(255,255,255);
    textAlign(CENTER,CENTER);
    textSize(40);
    text("Game over", width/2, height/2-20);
    textSize(24);
    text("Final Score:" + score, width/2, height/2 +20);
    
    //restrat button on Game Over page
    if (!restartButton){
      restartButton=createButton("Restart");
      restartButton.position(width/2-30, height/2+40);
    }
    
    
    noLoop();
    return;
  }
  
  
  
  //background changes
  if (flashRed && millis() - flashTimer < 2000) { // 2000ms = 2 seconds
  background(255, 100, 100); // red flash
} else {
  background(160, 210, 240); // sky blue
  flashRed = false; // reset after 2 seconds
}
 //Score
  
  fill(0);
  textSize(24);
  textAlign(LEFT,TOP);
  text ("Score:" + score, 10,10);
  
  //Lives
   fill(0);
  textSize(24);
  textAlign(RIGHT,TOP);
  text ("Lives:" + lives, width-10,10);

  //clouds
  
  drawCloud(100,80);
  drawCloud(300,60);
  drawCloud(500,100);
  
  //grass
  noStroke();
  fill (60,179,113);
  rect(0,height-60,width,60);
  
  //draw and drop pancakes
  
  for (let i= 0; i<pancakes.length; i++) {
    
    image(pancakeImg, pancakes[i].x, pancakes[i].y,60,60); //pancake
    pancakes[i].y += pancakeFallSpeed; //fall speed
    if(pancakes[i].y>height-60){
      pancakes[i].y=random(-200,60); //reset at top
      pancakes[i].x=random(0,width-60); //new horizontal
    }
    
    let distance= dist(pancakes[i].x, pancakes[i].y, dog.x, dog.y+40);
  if (distance<50){
    score +=1; //add to score
    pancakes[i].y= random(-300,-100);
    pancakes[i].x=random(0,width-50);
  }
  }
  
  // Draw and drop tomatoes
for (let i = 0; i < tomatoes.length; i++) {
  image(tomatoeImg, tomatoes[i].x, tomatoes[i].y, 50, 50);
  tomatoes[i].y += tomatoeFallSpeed;

  // Check if it hits the dog
  let distance = dist(tomatoes[i].x, tomatoes[i].y, dog.x + 50, dog.y + 40);
  if (distance < 50) {
    lives -= 1;
    flashRed = true;
    flashTimer = millis();
    
    //condition for end game 
    if(lives <= 0) {
       gameOver=true;
       }
    
    // Reset tomato
    tomatoes[i].y = random(-300, -100);
    tomatoes[i].x = random(0, width - 50);
  }

  // If it misses the dog and hits the ground, still reset it
  if (tomatoes[i].y > height - 60) {
    tomatoes[i].y = random(-300, -100);
    tomatoes[i].x = random(0, width - 50);
  }
}
  
  
  
  
  //move dog with arrow keys
  if (keyIsDown(LEFT_ARROW)) {
    dog.x -= dog.speed;
  }
 if (keyIsDown(RIGHT_ARROW)){
   dog.x += dog.speed;
 }
  
  // constrain the dog so it doesn't leave the screen
  dog.x = constrain(dog.x, 0, width - 100); 

  // dog
  image(dogImg, dog.x, dog.y, 100, 80); 
  
  
  
  //increase difficulty after 10
  if (score>=10){
    pancakeFallSpeed=4;
    tomatoeFallSpeed=5;
  }
  if(score>=20){
    pancakeFallSpeed=5;
    tomatoeFallSpeed=6;
  }
   if(score>=30){
    pancakeFallSpeed=6;
    tomatoeFallSpeed=7;
  }
   if(score>=40){
    pancakeFallSpeed=7;
    tomatoeFallSpeed=8;
  }
   if(score>=50){
    pancakeFallSpeed=8;
    tomatoeFallSpeed=9;
  }
  if(score>=60){
    pancakeFallSpeed=9;
    tomatoeFallSpeed=10;
}

}


//detect space is pressed

function keyPressed(){
  if (!gameStarted && key === " "){
    gameStarted=true;
    loop();
  }
  
  //restart from game over
  if(gameOver && key=== " "){
    restartGame(); 
  }
}


//restart game

function restartGame(){
  score=0;
  lives=3;
  gameOver=false;
  flashRed=false;
  flashTimer=0;
  
  //reset falling speed
  pancakeFallSpeed=2;
  tomatoeFallSpeed=3;
  
  //restart food
  tomatoes= [];
  pancakes=[];
  for(let i=0; i<2; i++){
    tomatoes.push({x:random(0,width-50),y: random(-300,-100)});
    pancakes.push({x: random(0, width-60), y: random(-200,-60)});
  }
  
  //reset dog position
  dog.x=170;
  
  //hide button
  restartButton.remove();
  restartButton=null;
  
  loop();
}


function drawCloud(x,y) {
  fill (255); //white
  noStroke();
  ellipse(x,y,60,60);
  ellipse(x+30,y+10,50,50);
  ellipse(x-30,y-10,50,50);
  
   
}