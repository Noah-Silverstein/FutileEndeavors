/*
    ABANDON ALL HOPE YE WHO ENTER
    there are no answers here. there is only despair
   
 canvas.height = 300  
 
 COLLISION_COLLICION
    *   Fix the bumpy thing while going right or left probably best worked out by elaborate switches
            -->if you're at a wall to your right you shouldn't be allowed to add to you velocityX
    *   Fix get rect -->i think this is origin of falling through block but not sure,!Possibly fixable through the y if statement cycle through all blocks instead of finding the relevant one through getRect
    *   Rework terrain  -> Rework create terrain want an option for unshift    
                        -> Rework draw terrain so it looks nicer (set array[2,4,6,8,..])
    *   https://www.youtube.com/watch?v=NZHzgXFKfuY ->FOR COLLISION DETECTION
    *   Fix when to create terrain box, cuurently making boxes for every millisecond that you press right key at border
*/

window.requestAnimFrame = (function(){                  
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();   //API for animating

var myRandom = {
    
    randFromInterval: function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    },
     randFromArray: function(array){
        return array[Math.floor(Math.random() * array.length)];
    },
}


var myChar,
    rectCoor = [],       //[x,y,width,height]
    backgrCoor =[]
    
    
//-------
//  START GAME
//-------
function startGame(){
    gameArea.init();                        
    terrain.init("canvasTerrain");terrain.createTerrain(rectCoor,"push");terrain.drawRect("#a6a6a6",rectCoor);
    myChar = new createChar("blue",gameArea.canvas.width/2,10,6,6)

    terrain.init("canvasBackground");terrain.createTerrain(backgrCoor,"push");terrain.drawRect("#8c8c8c",backgrCoor);
    gameArea.animate();
    console.log(backgrCoor);
}
//-----
//  SETUP GAME
//-----
var gameArea = {
    init : function() {
        this.canvas = document.getElementById("canvasChar");
        this.canvas.width = window.innerWidth-20;
        this.canvas.height = 300;
        this.ctx = this.canvas.getContext("2d");
        document.body.addEventListener("keydown", function(e) { //creates an array of all keycodes set to false at myChar
            myChar.keys[e.keyCode] = true;                      //and if a "keydown" of a key happens it will 
        });                                                     //change that keycode to true
        document.body.addEventListener("keyup", function(e) {
            myChar.keys[e.keyCode] = false;
        });
    },
    
    animate : function(){ //BASICALLY REPEATS the gameArea.animate function
        requestAnimFrame( gameArea.animate ); //not sure why this.animate doesn't work
        myChar.draw();
    },
    clear : function(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    }
    
}

//-------
//  CREATE CHAR
//--------

function createChar(color,x,y,width,height){
    this.x = x;             //current pos
    this.y = y;             //
    this.width = width;     //
    this.height = height;   //
    this.velX = 0;
    this.velY = 0;
    this.topSpeed = 3;
    this.friction = 0.7;   //higher ->slippier, lower->slower
    this.gravity = 0.7;
    this.jumping = false;
    this.grounded = false;
    this.colDir = null;
    this.keys = [];
    this.index = null;
    //this.relRect = [rectCoor[index-1],rectCoor[index],rectCoor[i+1]]
    this.draw = function(){
        
        if (this.keys[38]){                      //UP KEY
            if (!this.jumping && this.grounded){
                this.jumping = true;
                this.grounded = false;
                this.velY = -this.topSpeed*3    //the two is for extra kick
            }
        };
        if(this.keys[39]){                       //RIGHT KEY
            if(this.velX<this.topSpeed ){    //&& !this.zeroOutR
                this.velX++
            }
        };
        if(this.keys[37]){                       //LEFT KEY
            if(this.velX >-this.topSpeed){    
                this.velX--
            }
        };
        
        if(this.keys[32]){                       //space KEY
            console.log(backgrCoor)
        };
       
        
        
        this.velY += this.gravity;
        this.velX *= this.friction;
        
        this.findRect(this.x);  //
        
        if(this.keys[39]){                                       //if going right
            if(this.x+this.width + this.velX >= rectCoor[this.index].x+rectCoor[this.index].width && rectCoor[this.index].y > rectCoor[this.index+1].y && this.y+this.height>rectCoor[this.index+1].y){    //if your right edge is over the length of current block && the next block is higher up && your y+height is larger than next blocks y
                this.velX = (rectCoor[this.index].x+rectCoor[this.index].width)-(this.x+this.width + this.velX)
            }
            
            if(this.x+this.width+this.velX >= gameArea.canvas.width-gameArea.canvas.width/4){ //should happen only at keypress so should collision??
                
                terrain.moveTerrain(backgrCoor,"canvasBackground","#8c8c8c",Math.round(-this.velX/2)); //rounding removes small gaps between background
                terrain.moveTerrain(rectCoor,"canvasTerrain","#a6a6a6",Math.round(-this.velX));
               
                this.x = gameArea.canvas.width-gameArea.canvas.width/4;
                
                terrain.createTerrain(backgrCoor,"push")
                terrain.createTerrain(rectCoor,"push")
                
            }
            
        }
        if (this.keys[37]){                                 //if going left
            if(this.x + this.velX + this.velX <= rectCoor[this.index].x && rectCoor[this.index].y > rectCoor[this.index-1].y && this.y+this.height>rectCoor[this.index-1].y){
                this.velX = (rectCoor[this.index].x)-(this.x + this.velX);
            }
            
            if(this.x+this.velX<gameArea.canvas.width/4){   //should happen only at keypress so should collision??

                terrain.moveTerrain(backgrCoor,"canvasBackground","#8c8c8c",Math.round(-this.velX/2));
                terrain.moveTerrain(rectCoor,"canvasTerrain","#a6a6a6",Math.round(-this.velX));
                
                this.x = gameArea.canvas.width/4;
                
            }
        }
       
        this.floorCheck()
       // this. leftCheck()
        this.y += this.velY;
        this.x += this.velX;
        
        
        
        //if collision set old position
        //this.checkBorder();
        gameArea.clear();                       //clear whole canvas

        
        gameArea.ctx.fillStyle = color;         // update canvas
        gameArea.ctx.fillRect(this.x,this.y,this.width,this.height);

    },
    this.floorCheck = function(){
        var botLeft = this.x, 
            botRight = this.x+this.width,
            collBoxR = null ,
            collBoxL = null
            
        for(i=0;i<rectCoor.length;i++){
            if(botRight >= rectCoor[i].x){      //find TerrRect for x+width of char
                collBoxR = i
                
            }
            if(botLeft >= rectCoor[i].x){       //find TerrRect for x of char
                collBoxL = i
                
            }
        }       //THIS COULD JUST BE ONE STATEMENT BY ONLY USING THE ELSE STATEMENT THE IF STATEMENT IS REDUNDANT
        if (collBoxR == collBoxL){              //char is on 1 rect-> b&d are between xand x+width of TerrRect
            if(this.y + this.height + this.velY >= rectCoor[collBoxR].y - 1){ // the 1 is for some buffer
                this.velY = (rectCoor[this.index].y -1)-(this.y+this.height);
                this.jumping = false;
                this.grounded = true;
            }
        } else{                                 //char is on 2 dif rect -> b is on diff rect from d
            if(this.y + this.height + this.velY >= Math.min(rectCoor[collBoxL].y, rectCoor[collBoxR].y)){ 
                this.velY = Math.min(rectCoor[collBoxL].y -1,rectCoor[collBoxR].y -1)-(this.y+this.height);
                this.jumping = false;
                this.grounded = true;
            }
        }
        
        
    },
    this.leftCheck = function(){    //this doesn't really work
        if (this.keys[37]){
            for (i=0;i<rectCoor.length;i++){
                if (this.x + this. velX>= rectCoor[i].x){       //find what box we're at
                    if(this.x + this.velX <= rectCoor[i].x+1 ){ //block  if x is at box start + 1
                        console.log("magic")        //add hight exceptions -> if y of box i-1 > than y pos of b x ==0 else x is whatever
                        this.velX = 0
                    }
                }
            }
        }
    },
    this.rightCheck = function(){
        
    }
    
    
        
        /*
        process for collision detection:
        a|--|c      -->char box 
        b|__|d
            
            --GEN--
            0. run every refresh?
            1. find in rectCoor so that b>= rectCoor[i].x 
                -->set to INDEX
            
            --FLOOR--
            1. check what is x(this.x) of b (bottom left) and find in rectCoor
            2. check what is x(this.x+this.width) of d (bottom right) and find in rectCoor
            -->now you either have 1 or 2 boxes
            3. check what is y(this.y+this.height) if larger than MIN(1 && 2) -> ADJUST this.y
            
            --LEFT--
            0.assume something?
            1. check if keypress == 37
            2. check if rectCoor[index-1].y < b.y
                -->TRUE:  then ADJUST this.x
                -->FALSE: then do nothing(i think)
            3.
            --RIGHT--
            0.assume something?
            1.check if keypress == 39
            2.check if rectCoor[index+1].y < d.y
                -->TRUE:  then ADJUST this.x
                -->FALSE: then do nothing(i think)
        */
        
    

    
    this.findRect = function(x){                //sets index to terrain currently under box (right top)
        for(i=0;i<rectCoor.length;i++){
            if(x < rectCoor[i].x ){
                this.index = i-1;
                break
            }
        }
    } 
}

//-----             ---!!
//  TERRAIN         ---!! NEED TO CREATE METHOD FOR UNSHIFT
//-----             ---!!

var terrain = {
    init: function(canvas) {
        this.canvas = document.getElementById(canvas);
        this.canvas.width = (window.innerWidth-20);
        this.canvas.height = 300; 
        this.ctx = this.canvas.getContext("2d");
    },
    createTerrain: function(array,add){
        var running = true;
        while (running){
            
            //Logs First Values
            if(array.length == 0){
                var firstY =myRandom.randFromInterval(150,200); var firstWidth = myRandom.randFromInterval(10,30);
                
                array.push({x:0,y:firstY,width:firstWidth,height:this.canvas.height-firstY});
                first = false;
            }; 
            //running =false if past canvas width
            
            if ( x > this.canvas.width){
                running = false
            }; 
        
            var x = (array[array.length-1].x) + (array[array.length-1].width);
            var y = array[array.length-1].y + myRandom.randFromArray([myRandom.randFromInterval(-20,-10),myRandom.randFromInterval(10,20)]);
            var width = myRandom.randFromInterval(10,30);
            
            
            if( y > this.canvas.height - 25){
                var y = array[array.length-1].y + myRandom.randFromInterval(-20,-10);
            };
            if (y < 25){
                var y = array[array.length-1].y + myRandom.randFromInterval(10,20);
            };
            
            var height = this.canvas.height-y; //calculate hight after adjustments for y
            
            if (add == undefined || add == "push"){
                array.push({x:x,y:y,width:width,height:height});
            } else if( add == "unshift"){
                array.unshift({x:x,y:y,width:width,height:height});
            }
            
        }
    },
    drawRect: function(color,array){
        for(i=0;i<array.length;i++){
            this.ctx.fillStyle = color;
            this.ctx.fillRect(array[i].x,array[i].y,array[i].width,array[i].height);
        }
    },
    moveTerrain: function(array,canvas,color,speed){
        this.init(canvas);
        this.update(array,speed);
        
        this.drawRect(color,array);
        
    },
    update: function(array,speed){
        for(i=0;i<array.length;i++){
            array[i].x += speed;
            
        }
    },
    
    clear: function(canvas){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

////------------
//  USABLE_UNUSABLE CODE FOR NOW
////------------
/*
        if(this.keys[39]){                                       //if going right
            if(this.x+this.width + this.velX >= rectCoor[this.index].x+rectCoor[this.index].width && rectCoor[this.index].y > rectCoor[this.index+1].y && this.y+this.height>rectCoor[this.index+1].y){    //if your right edge is over the length of current block && the next block is higher up && your y+height is larger than next blocks y
                //console.log(this.x+this.width)
                //console.log(rectCoor[this.index].x+rectCoor[this.index].width)
                this.velX = (rectCoor[this.index].x+rectCoor[this.index].width)-(this.x+this.width + this.velX)
                //console.log(this.velX)
                //console.log("---")
                this.zeroOutR = true;
            }
            
            if(this.x+this.width+this.velX>gameArea.canvas.width-gameArea.canvas.width/4){ //should happen only at keypress so should collision??
                console.log("start movingback ground");
                this.backgroundIndex++
                terrain.moveTerrain(backgrCoor,"canvasBackground","#8c8c8c",Math.round(-this.velX/2));
                terrain.moveTerrain(rectCoor,"canvasTerrain","#a6a6a6",Math.round(-this.velX));
                this.x = gameArea.canvas.width-gameArea.canvas.width/4;
                terrain.createTerrain(backgrCoor,"push")
                terrain.createTerrain(rectCoor,"push")
                
            }
            
        }
        if (this.keys[37]){
            if(this.x + this.velX + this.velX <= rectCoor[this.index].x && rectCoor[this.index].y > rectCoor[this.index-1].y && this.y+this.height>rectCoor[this.index-1].y){
                this.velX = (rectCoor[this.index].x)-(this.x + this.velX);
                
            }
            if(this.x+this.velX<gameArea.canvas.width/4){ //should happen only at keypress so should collision??
                console.log("start movingback ground");
                terrain.moveTerrain(backgrCoor,"canvasBackground","#8c8c8c",Math.round(-this.velX/2));
                terrain.moveTerrain(rectCoor,"canvasTerrain","#a6a6a6",Math.round(-this.velX));
                this.x = gameArea.canvas.width/4;
                
            }
        }
    */