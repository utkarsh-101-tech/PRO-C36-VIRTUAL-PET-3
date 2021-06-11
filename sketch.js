//Create variables here
var dog, doggy, happyDog,sadDog, database;//doggy is sprite and dog,happyDog are images
var fedTime,lastFed,feed,addFood,foodObj,foodStock,currentTime;
var state,stateRef,bedRoom,garden, washRoom;

function preload()
{	//load images here
  dog = loadImage("images/Dog.png");
  sadDog = loadImage("images/deadDog.png");
  happyDog = loadImage("images/Happy.png");
  bedRoom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washRoom = loadImage("images/Wash Room.png");
}

function setup()
 {
    createCanvas(1000,500);
    //creating image of dog
    doggy = createSprite(width/2+150,height/2+50,50,50);
    doggy.addImage(dog,doggy.x,doggy.y);
    doggy.scale= 0.25;
    
    database = firebase.database();
    
    foodObj = new Food();
}

function draw()
 {  
    background(rgb(46, 138, 87));
    textSize(30);
    fill("black");

    getTime();//returns last fed time from database
    
    currentTime = hour();//gets the current time

    if(currentTime<lastFed+1){  //at different times different backgrounds are given and updating states as well
    foodObj.garden();     
    state="playing";
    updateState(state);
    }else if(currentTime>lastFed+2 && currentTime<lastFed+4){
      foodObj.washRoom();
      state="bathing";
      updateState(state);
    }else{
      foodObj.display();
      state="hungry";
      updateState(state);
    }

    //condition for displaying time as in 12 hour clock
    if(lastFed>12){
      lastFed=lastFed-12
      text("Last Fed : "+lastFed+" pm" ,100,100 );
    }
    else if(lastFed<12){
      text("Last Fed : "+lastFed+" am" ,100,100 );  
    }
    else if(lastFed==12){
      text("Last Fed : "+12+" noon" ,100,100 );
    }

    //display of milk botttles
    foodObj.display();
    
    //button for feeding the dog
    feed = createButton("Feed")
    feed.position(800,100);
    feed.mousePressed(giveTime);//give time function adds new fed time to the database and deducts food  
    
    foodObj.getFoodStock();//returns total food from database 

    //button for adding food 
    addFood = createButton("Add Food");
    addFood.position(600,100);
    addFood.mousePressed(foodObj.updateFoodStock);
    
    getState();//recieving state from database

    if(state!=="hungry"){           //if state is hungry ,it hides buttons and dog else shows them
     feed.hide();
     addFood.hide();
     doggy.remove();
     console.log("if");
     }
    else{
      feed.show();
      addFood.show();
      doggy.addImage(sadDog);
      doggy.scale= 0.5;
      console.log("else")
     }

    drawSprites();
}

async function giveTime(){
    timeRef = await database.ref('/').update({
    feedTime: hour()
    });
   foodObj.deductFoodStock();
}

async function getTime(){  
  fedTime = await database.ref('feedTime');
  fedTime.on("value",function(data){
  lastFed= data.val();
  })  
}

function updateState(state){       // updates game satae in database
    database.ref('/').update({
    gameState:state
  });
}

async function getState(){       // returns game state from database
  stateRef =await database.ref('gameState');
  stateRef.on("value",function(data){
  state = data.val();
  })
}