

var myRandom = {
    //random from interval (thanks to stackoverflow)
    randFromInterval: function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    randFromArray: function(array){
        return array[Math.floor(Math.random() * array.length)];
    },
}

//array of coordinates [x0,y0],[x1,y1],...
var terrainCoor = [[0,200]]

function logTerrain(){
    
    var canvas = document.getElementById("newCanvas");
    var ctx = canvas.getContext("2d");
    var running = true;
    
        while (running){
            var direction = myRandom.randFromArray([1,2,3]);
            var random = myRandom.randFromInterval(0,10);
            var prevX = terrainCoor[terrainCoor.length-1][0];
            var prevY = terrainCoor[terrainCoor.length-1][1];
                //going up
            if (direction == 1 && prevY > 30){
                terrainCoor.push([prevX+random,prevY-random]);
            }   
            
                //stayin flat
            else if (direction == 2) {
                terrainCoor.push([prevX+random,prevY]);
            }
                //going down
            else if(direction==3 && prevY < canvas.height-30){
                terrainCoor.push([prevX+random,prevY+random]);
            } 
            
            if (prevX > canvas.width){
                running = false
            }
        }
}
    
function drawTerrain(){
    console.log(terrainCoor)
    for (i=0;i<terrainCoor.length-1;i++){
        var canvas = document.getElementById("newCanvas");
        var ctx = canvas.getContext("2d");
        ctx.moveTo(terrainCoor[i][0],terrainCoor[i][1]);
        ctx.lineTo(terrainCoor[i+1][0],terrainCoor[i+1][1]);
        ctx.stroke();
    }
}

