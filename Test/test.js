//thank you to ->http://www.somethinghitme.com/2013/01/09/creating-a-canvas-platformer-tutorial-part-one/
// thank you to ->https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
/*
 canvas.height = 300  


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
    //random from interval (thanks to stackoverflow)
    randFromInterval: function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    },
     randFromArray: function(array){
        return array[Math.floor(Math.random() * array.length)];
    },
}

var myChar,
    terrainCoor = [],   //[x,y]
    rectCoor = [],      //[x,y,width,height]
    testRectCoor = [{x:20,y:280,width:50,height:20},{x:60,y:240,width:50,height:60}]
//-------
//  START GAME
//-------
function startGame(){
    gameArea.init();           
    testTerrain.init();
    //terrain.init();terrain.logTerrain();
    myChar = new createChar("blue",gameArea.canvas.width/2,10,5,5)
    //terrain.drawTerrain();
    //console.log(rectCoor);
    testTerrain.drawTerrain();

    gameArea.animate();
     
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
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velX = 0;
    this.velY = 0;
    this.topSpeed = 3;
    this.friction = 0.8;   //higher ->slippier, lower->slower
    this.gravity = 0.4;
    this.jumping = false;
    this.keys = [];
    this.draw = function(){
    
        if (this.keys[38]){                      //UP KEY
            if (!this.jumping){
                this.jumping = true;
                this.velY = -this.topSpeed*2    //the two is for extra kick
            }
        };
        if(this.keys[39]){                       //RIGHT KEY
            if(this.velX<this.topSpeed){    
                this.velX++
            }
        };
        if(this.keys[37]){                       //LEFT KEY
            if(this.velX >-this.topSpeed){    
                this.velX--
            }
        };
       
        this.velX *= this.friction;             //decreases topSpeed IF no keys are pressed -> Zeno's Paradox 
        this.velY += this.gravity;
        this.x += this.velX;
        this.y += this.velY;
        
        this.checkBorder();

        gameArea.clear();                       //clear whole canvas
        gameArea.ctx.fillStyle = color;         // update canvas
        gameArea.ctx.fillRect(this.x,this.y,this.width,this.height);

    }
    this.checkBorder = function(){              
        if (this.x >= gameArea.canvas.width-this.width){        //checks right side of canvas
            this.x = gameArea.canvas.width-this.width;
        } else if (this.x <= 0){                                //checks left side of canvas       
            this.x = 0
        };
        
        if (this.y >= gameArea.canvas.height - this.height){    //checks bottom side of canvas
            this.y = gameArea.canvas.height - this.height;
            this.jumping = false;
        }
    }
    this.getRelevant = function(){
        for(i=0;i<rectCoor.length;i++){
            if (this.x <= rectCoor[i].x+rectCoor[i].width){
                return i    // returns position in array ->x is between i-1 and i+1(probably not)
            }
        }   
    }
}

var testTerrain = {
    init: function() {
        this.canvas = document.getElementById("canvasTerrain");
        this.canvas.width = (window.innerWidth-20);
        this.canvas.height = 300; 
        this.ctx = this.canvas.getContext("2d");
    },
    drawTerrain: function() {
        for (i=0;i<testRectCoor.length;i++){
                this.ctx.fillStyle = "#ccffff";
                this.ctx.fillRect(testRectCoor[i].x,testRectCoor[i].y,testRectCoor[i].width,testRectCoor.height);
        }
    }
}



//-----
//  TERRAIN
//-----

var terrain = {
    init: function() {
        this.canvas = document.getElementById("canvasTerrain");
        this.canvas.width = (window.innerWidth-20);
        this.canvas.height = 300; 
        this.ctx = this.canvas.getContext("2d");
    },
    logTerrain: function(){
        var running = true;
        terrainCoor.push({x:0,y:myRandom.randFromInterval(180,280)})
    
        while (running){
            var direction = myRandom.randFromInterval(1,3);
            var random = myRandom.randFromInterval(10,20);
            var prevX = terrainCoor[terrainCoor.length-1].x;
            var prevY = terrainCoor[terrainCoor.length-1].y;
            
            if (direction == 1 && prevY > 20){
                terrainCoor.push({x:prevX,y:prevY-random});
                terrainCoor.push({x:prevX+myRandom.randFromInterval(10,20),y:prevY-random})
            }   
            
                //stayin flat
            else if (direction == 2) {
                terrainCoor.push({x:prevX+random,y:prevY});
            }
                //going down
            else if(direction==3 && prevY < this.canvas.height-50){
                terrainCoor.push({x:prevX,y:prevY+random});
                terrainCoor.push({x:prevX+myRandom.randFromInterval(10,20),y:prevY+random})

            } 
            
            if (prevX > this.canvas.width){
                running = false
            }
        }
    },
    drawTerrain: function(){
        for (i=0;i<terrainCoor.length-1;i++){
            this.ctx.moveTo(terrainCoor[i].x,terrainCoor[i].y);
            this.ctx.lineTo(terrainCoor[i+1].x,terrainCoor[i+1].y);
            this.ctx.stroke();
        };
        for (i=0;i<terrainCoor.length-1;i++){
            if(terrainCoor[i].y == terrainCoor[i+1].y){
                this.ctx.fillStyle = "#ccffff";
                this.ctx.fillRect(terrainCoor[i].x,terrainCoor[i].y,terrainCoor[i+1].x - terrainCoor[i].x,this.canvas.height - terrainCoor[i].y);
                rectCoor.push({x:terrainCoor[i].x,y:terrainCoor[i].y,width:terrainCoor[i+1].x - terrainCoor[i].x,height:this.canvas.height - terrainCoor[i].y});
            }
        }
    }
}


