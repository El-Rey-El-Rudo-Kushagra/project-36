var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var fedtime

var gameState=0

//create feed and lastFed variable here


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
washroom=loadImage("Wash Room.png")
garden=loadImage("Garden.png")
bedroom=loadImage("Bed Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  

  foodObj = new Food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feeddog=createButton("Feed the dog")
  feeddog.position(700,95)
  feeddog.mousePressed(feedDog)

  addFood=createButton("Add Food");
  addFood.position(800,95); 

}

function draw() {
  background(46,139,87);
  foodObj.display();
  database.ref("lastfed").on("value",function (data){
    fedtime=data.val()
  })

  
  fill(255,255,254); 
  textSize(15); 
  if(fedtime>=12){ text("Last Feed : "+ fedtime%12 + " PM", 350,30); 
}
else if(fedtime==0)
{ text("Last Feed : 12 AM",350,30); }
  else{ text("Last Feed : "+ fedtime + " AM", 350,30); }
  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  if (gameState!="Hungry"){
    feeddog.hide();
    addFood.hide();
    dog.addImage(sadDog);
  }
  currentTime=hour();
    if(currentTime==(fedtime+1)){
      update("Playing");
      foodObj.garden();
    }else if(currentTime==(fedtime+2)){
      update("Sleeping")
      foodObj.bedroom();
    }else if (currentTime>(fedtime+2)&&currentTime<=(fedtime+4)){
      update("Bathing");
      foodObj.washroom();
    }else{
      update("Hungry")
      foodObj.display()
    }
  //write code to read fedtime value from the database 
  
 
  //write code to display text lastFed time here

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  console.log(foodS)
}


function feedDog(){
  dog.addImage(happyDog);
  var stock=foodObj.getFoodStock()
  if(stock<=0){
    stock=stock*0
  }
  else{
    stock=stock-1
  }
  foodObj.updateFoodStock(stock)
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    lastfed:hour ()
  })
  //write code here to update food stock and last fed time

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

//function to update gamestate in database
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
