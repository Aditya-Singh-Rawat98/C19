var PLAY = 1;
var END = 0;
var GameState = PLAY;

var trex,trex_collided, trex_running;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudsImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
 var score = 0;

 var gameOver, restart;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  text("Score :"+score, 500, 50);

  if(GameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    trex.changeAnimation("running", trex_running);

    gameOver.visible = false;
    restart.visible = false;

    if(keyDown("space")  &&  trex.y >= 159){
      trex.velocityY = -5;
    }

    trex.veloxityY = trex.velocityY + 0.8;

    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      GameState = END;
    }
  }
    else if(GameState === END){
      gameOver.visible = true;
      restart.visible = true;

      ground.velocityX = 0;
      trex.velocityY = 0;
      obstaclesGroup.setVelocityEach(0);
      cloudsGroup.setVelocityEach(0);
      trex.changeAnimation("collided", trex_collided);


      obstaclesGroup.setLifetimeEach(2);
      cloudsGroup.setLifetimeEach(-1);

      if(mousePressedOver(restart)){
        reset();
      }
    }

    drawSprites();

  }


 function spawnClouds(){
    if(frameCount % 60 === 0){
      var cloud = createSprite(600,120,40,10);
      cloud.y = Math.round(random(80,120));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;

      cloud.lifetime = 200;

      cloud.depth = trex.depth +1;
      
      cloudsGroup.add(cloud);

    }
  }
  function reset(){
    GameState === PLAY;
    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach;
    score = 0;
  }
  
 function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
 }
