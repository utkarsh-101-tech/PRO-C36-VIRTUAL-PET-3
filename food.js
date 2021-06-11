class Food {
    constructor(){
      this.image = loadImage("images/milk.png");//milk bottle image
      this.foodStockRef;
    }
    
    

async getFoodStock(){          
  this.foodStockRef =await database.ref('foodStock');
  this.foodStockRef.on("value", function(data){
  foodStock=data.val();
 } )
}

bedRoom(){
  background(bedRoom);
}

garden(){
  background(garden);
}

washRoom(){
  background(washRoom);
}

updateFoodStock(){         //called in add food's mousePressed function. it increases total food 
  foodStock=foodStock+1;
  database.ref('/').update({
  foodStock:foodStock
   })
}

deductFoodStock(){          // it is called in givetime function and it deducts total no of food
  foodStock=foodStock-1;
   database.ref('/').update({
  'foodStock':foodStock
  })
  doggy.addImage(happyDog);
  
 }

 display(){       //display for milk bottles
  var x=80 , y=100;
  if(foodStock!==0){
    for(var i=0; i<foodStock; i++){
      x= x+30;
      if(i%10==0){
        y=y+50;
        x= 80;
        }
      imageMode(CENTER);
      image(this.image,x,y,50,50);
      
    }
  }
 }
}
