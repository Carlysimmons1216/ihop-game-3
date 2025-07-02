let score = 0;
let lives = 3;
let flashRed = false;
let flashTimer = 0;
let gameStarted = false;
let gameOver = false;
let restartButton;
let pancakeFallSpeed = 2;
let tomatoeFallSpeed = 3;
let aliasInput;
let aliasButton;
let playerAlias = '';
let aliasEntered = false;
let showInstructions = false;
let finalScore;

let pancakes = [];
let tomatoes = [];
let dogImg, pancakeImg, tomatoeImg;
let dog = {
  x: 170,
  y: 300,
  speed: 5
};
//updateUserScore();

async function updateUserScore(finalScore) {
  console.log('insideUpdate');
    try {
    await fetch('https://023344d8-6faf-4043-a87e-35c1ccd1a9e9-00-3eg2ra5nb4m09.kirk.replit.dev/submit-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Score__c: finalScore })
    });
    console.log('Score saved to Salesforce:', finalScore);
  } catch (error) {
    console.error('Error saving score to Salesforce:', error);
  }
}

function preload() {
  pancakeImg = loadImage("https://cdn-icons-png.flaticon.com/512/7763/7763317.png");
  dogImg = loadImage("https://www.pitchandpup.com/cdn/shop/files/18.png?v=1697312888&width=1445");
  tomatoeImg = loadImage("https://png.pngtree.com/png-clipart/20240305/original/pngtree-tomatoes-cartoon-with-transparent-background-png-image_14510393.png");
}

function setup() {
  createCanvas(400, 400);

  // Create Alias Input
  aliasInput = createInput('');
  aliasInput.position(100, 270);
  aliasInput.attribute('placeholder', 'Enter your Alias');

  // Create Button
  aliasButton = createButton('Submit');
  aliasButton.position(160, 290);
  aliasButton.mousePressed(submitAlias);

  // Initialize falling items
  for (let i = 0; i < 2; i++) {
    pancakes.push({ x: random(0, width - 60), y: random(-200, -60) });
    tomatoes.push({ x: random(0, width - 50), y: random(-300, -100) });
  }
}

function draw() {

  // 1️⃣ Alias input screen
  if (!aliasEntered) {
    background(160, 230, 270);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("🐶 iHop Doggy Days", width / 2, height / 2 - 60);
    textSize(20);
    text("Catch pancakes 🍽️ — Avoid tomatoes 🍅", width / 2, height / 2 - 20);
    text("Enter your Alias Below:", width / 2, height / 2);
    return;
  }

  // 2️⃣ Instruction screen (after alias)
  if (showInstructions) {
    background(160, 230, 270);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("🐶 iHop Doggy Days", width / 2, height / 2 - 80);
    textSize(20);
    text("Alias: " + playerAlias, width / 2, height / 2 - 40);
    text("Press SPACE to start", width / 2, height / 2);
    text("Speed increases every 10 points", width / 2, height / 2 + 40);
    text("Use ← → arrows to move", width / 2, height / 2 + 80);
    return;
  }

  // 3️⃣ Game Over check
  if (gameOver) {
    background(0, 192, 255);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Game Over", width / 2, height / 2 - 20);
    textSize(24);
    text("Final Score: " + score, width / 2, height / 2 + 20);

    if (!restartButton) {
      restartButton = createButton("Restart");
      restartButton.position(width / 2 - 30, height / 2 + 40);
      restartButton.mousePressed(restartGame);
    }

    noLoop();
    return;
  }

  // ✅ Running game
  if (flashRed && millis() - flashTimer < 2000) {
    background(255, 100, 100);
  } else {
    background(160, 210, 240);
    flashRed = false;
  }

  // Score
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);

  // Lives
  textAlign(RIGHT, TOP);
  text("Lives: " + lives, width - 10, 10);

  // Clouds
  drawCloud(100, 80);
  drawCloud(300, 60);
  drawCloud(500, 100);

  // Grass
  noStroke();
  fill(60, 179, 113);
  rect(0, height - 60, width, 60);

  // Pancakes
  for (let i = 0; i < pancakes.length; i++) {
    image(pancakeImg, pancakes[i].x, pancakes[i].y, 60, 60);
    pancakes[i].y += pancakeFallSpeed;
    if (pancakes[i].y > height - 60) {
      pancakes[i].y = random(-200, -60);
      pancakes[i].x = random(0, width - 60);
    }

    let distance = dist(pancakes[i].x, pancakes[i].y, dog.x, dog.y + 40);
    if (distance < 50) {
      score += 1;
      pancakes[i].y = random(-300, -100);
      pancakes[i].x = random(0, width - 50);
    }
  }

  // Tomatoes
  for (let i = 0; i < tomatoes.length; i++) {
    image(tomatoeImg, tomatoes[i].x, tomatoes[i].y, 50, 50);
    tomatoes[i].y += tomatoeFallSpeed;

    let distance = dist(tomatoes[i].x, tomatoes[i].y, dog.x + 50, dog.y + 40);
    if (distance < 50) {
      lives -= 1;
      flashRed = true;
      flashTimer = millis();
      if (lives <= 0) {
        gameOver = true;
      }
      tomatoes[i].y = random(-300, -100);
      tomatoes[i].x = random(0, width - 50);
    }

    if (tomatoes[i].y > height - 60) {
      tomatoes[i].y = random(-300, -100);
      tomatoes[i].x = random(0, width - 50);
    }
  }

  // Dog movement
  if (keyIsDown(LEFT_ARROW)) {
    dog.x -= dog.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    dog.x += dog.speed;
  }
  dog.x = constrain(dog.x, 0, width - 100);
  image(dogImg, dog.x, dog.y, 100, 80);

  // Increase difficulty
  if (score >= 10) {
    pancakeFallSpeed = 4;
    tomatoeFallSpeed = 5;
  }
  if (score >= 20) {
    pancakeFallSpeed = 5;
    tomatoeFallSpeed = 6;
  }
  if (score >= 30) {
    pancakeFallSpeed = 6;
    tomatoeFallSpeed = 7;
  }
  if (score >= 40) {
    pancakeFallSpeed = 7;
    tomatoeFallSpeed = 8;
  }
  if (score >= 50) {
    pancakeFallSpeed = 8;
    tomatoeFallSpeed = 9;
  }
  if (score >= 60) {
    pancakeFallSpeed = 9;
    tomatoeFallSpeed = 10;
  }
}

function keyPressed() {
  if (!gameStarted && showInstructions && key === " ") {
    gameStarted = true;
    showInstructions = false;
    loop();
  }

  if (gameOver && key === " ") {
    restartGame();
    
  }
}

function restartGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  flashRed = false;
  flashTimer = 0;
  pancakeFallSpeed = 2;
  tomatoeFallSpeed = 3;

  tomatoes = [];
  pancakes = [];
  for (let i = 0; i < 2; i++) {
    tomatoes.push({ x: random(0, width - 50), y: random(-300, -100) });
    pancakes.push({ x: random(0, width - 60), y: random(-200, -60) });
  }

  dog.x = 170;
  if (restartButton) {
    restartButton.remove();
    restartButton = null;
    
    //before beginning
    console.log('beforeinsideUpdate')
    updateUserScore(score)
    console.log('afterinsideUpdate')
    
  }

  loop();
}

function submitAlias() {
  playerAlias = aliasInput.value();

  if (playerAlias.trim() !== '') {
    aliasEntered = true;
    showInstructions = true;

    aliasInput.hide();
    aliasButton.hide();
  }
}

function drawCloud(x, y) {
  fill(255);
  noStroke();
  ellipse(x, y, 60, 60);
  ellipse(x + 30, y + 10, 50, 50);
  ellipse(x - 30, y - 10, 50, 50);
}
