var ground,groundImage;
var trex,trexRunning,trexCollided;
var edges;
var invisibleground;
var cloud,cloudImage;
var       obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,obstacle;
var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var cloudsGroup,obstaclesGroup;
var restart,restartImage;
var gameOver,gameOverImage;
var jumpSound;
var dieSound;
var checkPointSound;

function preload(){
  trexRunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trexCollided = loadImage("trex_collided.png");
  restart = loadImage("restart.png");
  gameOver = loadImage("gameOver-1.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup(){
    createCanvas(600,200);
    trex = createSprite(50,160,20,20);
    trex.addAnimation("running",trexRunning);
    trex.addAnimation("collided",trexCollided);
    trex.scale = 0.45;
    //trex.x = 50;
    ground = createSprite(200,180,600,20);
    ground.addImage(groundImage);
    ground.velocityX = -7;
    edges = createEdgeSprites();
    invisibleground = createSprite(200,195,400,20);
    invisibleground.visible = false;
    restartImage = createSprite(300,100,20,20);
    restartImage.addImage(restart);
    restartImage.scale = 0.5;
    gameOverImage = createSprite(300,50,50,50);
    gameOverImage.addImage(gameOver);
    gameOverImage.scale = 0.5;
    console.log(Math.round(random(1,50)));
    score = 0;
    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();
    trex.debug = true;
    trex.setCollider("rectangle",0,0,300,trex.height);
}

function draw(){
    background("red");
    text("Score - "+score,20,20);
    if(gameState===PLAY){
    restartImage.visible = false;
    gameOverImage.visible = false;
    ground.velocityX = -(7+3*score/100);  
    score = score+Math.round(frameCount/60);
    if(score>0&&score%100===0){
      checkPointSound.play();
    }
    if(keyDown("space")&& trex.y>=100){
      trex.velocityY = -5 ;
      jumpSound.play(); 
    }
    //LINE BELOW IS FOR GRAVITY
    trex.velocityY = trex.velocityY + 0.5;
    if(ground.x<0){
      ground.x = ground.width/2;
    }
    spawnClouds();
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
      //gameState = END;
      jumpSound.play();
      trex.velocityY = -5;
    }
}
    else if(gameState===END){
    restartImage.visible = true;
    gameOverImage.visible = true;
    trex.changeAnimation("collided",trexCollided);
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
}
    trex.collide(invisibleground);
    drawSprites();
}

function spawnClouds(){
    if(frameCount%100===0){
    cloud = createSprite(590,60,20,20);  
    cloud.velocityX = -2;
    cloud.y = Math.round(random(30,60));
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.lifetime = 300;
    cloudsGroup.add(cloud);
}
}

function spawnObstacles(){
  if(frameCount%150===0){
    obstacle = createSprite(590,160,20,20);
    obstacle.velocityX = -(7+3*score/100);
    var rand = Math.round(random(1,6));
    switch(rand){
    case 1:obstacle.addImage(obstacle1);
    break;
    case 2:obstacle.addImage(obstacle2);
    break;
    case 3:obstacle.addImage(obstacle3);
    break;
    case 4:obstacle.addImage(obstacle4);
    break;
    case 5:obstacle.addImage(obstacle5);
    break;
    case 6:obstacle.addImage(obstacle6);
    break;
    }
    obstacle.scale = 0.5
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}