/*
This script generates a room with a random amount of doors

things to add,
    - ALL DOORS SHOULD BE DEFAULT CLOSED -->if "go back" that means you will see X amount of closed doors and X amount of open doors if X (should this effect "go back" posibility?) 
    - open the door v open another door v open the other door v onward
    - workout how best to say no doors in room and add it to code--> 0 doors means you have to go back
    - Should buttons effect layout?
    - CLEAN UP ALL FUNCTIONS--> PUT BIG 3 IN 1 OBJECT
*/


//Random from Array 
function getRandom(array){
    return array[Math.floor(Math.random() * array.length)];
}

//percent chance calculator
function chanceCalc(percent){
    if((Math.floor(Math.random()*100)+1)<percent)
        return true
    
}

//Singular or Plural? ->when expanding maybe use more 
function spelling(amount){
    if (amount > 1)
        return "more doors"
    else 
        return "other door"
}

//get object out of an array of objects based on PATH number 
function getByPath(array,value){
    for(i=0;i<array.length;i++){
        for(j=0;j<array[i].path.length;j++){
            if(array[i].path[j] == value) {
                return(array[i])
            }
        }
    }
}
    
//get object out of array of objects based on ROOM number 
function getByRoom(array,value){
    for (i=0;i<array.length;i++)
        if(array[i].room == value) 
            return array[i]
}

//have we taken this door before
function doorTakenCheck(array,value){
    for (i=0;i<array.length;i++)
        if (array[i] == value)
            return true
}

//return object in array of certain doorTaken number
function roomRevisited(doorTaken,path){
    
    var roomInfo=getByPath(mainHistory,path)
    for (i=0;i<roomInfo.doorsTaken.length;i++){
        if (roomInfo.doorsTaken[i] == doorTaken){
            console.log('roominfo.path[i]'+roomInfo.path[i])
            return roomInfo.path[i]+1
        }
    }
}

function addHighscore(highscoreVal,roomNumberVal){
    if (roomNumberVal > highscoreVal){
        highscore++
    }
}



var mainHistory =[{ path:[0],           //room should count every new room 
                    room:0,          //should count how many doors in the room 
                    doors:1,           //every time you move forward or back path goes up->this way going back means finding path-1 and getting info out of that object
                    doorsTaken:[1],  //counts what doors have been opened in that room
                 }]

var highscore = 0

var reverseVal = 0 //value that tells you how many times you've consecutively reversed

var roomNumber = 0 //every time you open a door you create a new roomNumber gets added to history

var blockedVar = 0

var path = 0

var doorNumberEnter = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];

var doorsInRoom =['one','two','three','four','five','six','seven','eight','nine','ten'];

//-----------
// LISTS OF WITTY DIALOG is there a better way to do this?
//-----------

var youDied=[
    "and die of "+getRandom(["boredom","thirst","hunger","lack of oxygen","old age","mesothelioma","an infected papercut","a nail to the gut"]),
    "and fall into the bodemless pit that has opened up before you",
    "You see an orangutan who promptly relieves you of your legs",
    "You trip on the doorstep and slam your head on the hardwood floor never to rise again ",
    "A wise old man tells you death is but the beginning as he stabs you repeatedly with a metal teacup",
    "and get crushed by a metric ton of cocain",
    "and a swarm of bees decides to make a new hive in your "+getRandom(["anus","eye socket","genitalia","nucleus accumbens"])
]

var revisitThoughts=[
    "You've been here before",
    "This room seems familiar to you",
    "Yes..Yes..It's all coming back to me now",
    
]

var turnBackVerbs=[
    "turn back",
    "retrace your steps",
    "gracefully stumble out of the room",
    "slowly walk backwards",
    "hastily moonwalk away",
]

var turnBackThoughts=[
    'Mistakes are a part of life',
    'You suddenly recall a certain fondness for the previous room',
    'Perhaps you should turn back',
    'What was that sound?',
    ''
    
]

var forwardThoughts=[
    'This room smells of elderberries',
    'A rat scurries past you',
    'You get a slight feeling of deja vu',
    'Your stomach growls loudly...or is that something else?',
    'A man in a business suit eyes you warely',
    'Perhaps it will be different this time',
    'The air appears to be getting thinner',
    'A red mold covers the wall in front of you',
    
    
]

var blocked=[
    'The door must have locked behind you',
    "You push the door, it doesn't budge",
    'As you grasp the doorhandle it disintegrates in your hand',
    'You temporarily forget how doors operate, also that pool of water is starting to look rather ominous',
]

//---------
// ROOM GENERATOR 
//---------

function roomGenerator(){
    
    
    if (mainHistory.length < 2 ){
        
        var doors = Math.floor(Math.random() * 10)+1
        
        path++;
        roomNumber++;
        addHighscore(highscore,roomNumber);
        
        mainHistory.push({            //
            path: [path],             // pushes new object into history
            room: roomNumber,         //
            doors: doors,             //
            doorsTaken:[]             //
        });
        
        document.getElementById('doorOpened').innerHTML = 'you open the door and see '+ doorsInRoom[doors-1] + ' ' +spelling(doors);
        document.getElementById('buttonDoor').innerHTML = 'Open the Door'
        document.getElementById('buttonReverse').style.visibility = 'visible';
        document.getElementById('highscore').innerHTML = highscore;
        document.getElementById('uniqueRooms').innerHTML = roomNumber;
    }
    
    
    else {
        
        //choose door you took exiting the last room 
        var doorEntered = Math.floor(Math.random() * getByPath(mainHistory,path).doors)+1;
        
        //checks if you've been here before
        if (doorTakenCheck(getByPath(mainHistory,path).doorsTaken,doorEntered)){

            //to find room compare doortaken[i] to path [i] and the room you need wil be at path[i+1]
            var roomInfo = getByPath(mainHistory,roomRevisited(doorEntered,path))
            path++
            getByRoom(mainHistory,roomInfo.room).path.push(path)
            
            document.getElementById('thoughtsBack').innerHTML = "";
            document.getElementById('doorOpened').innerHTML = 'you open the '+ doorNumberEnter[doorEntered-1] +' door again and see '+ doorsInRoom[roomInfo.doors-1]+' '+spelling(roomInfo.doors);
            document.getElementById('thoughtsForward').innerHTML = getRandom(revisitThoughts);
            document.getElementById('buttonReverse').style.visibility = 'visible';
            
        }
        //Create a new room
        else {
            
            //adds door taken to previous object based on what the last path number was
            getByPath(mainHistory,path).doorsTaken.push(doorEntered); 
        
            //create doors you see
            var doors = Math.floor(Math.random() * 10)+1

            reverseVal = 0 //set reversal back to zero->the next time you go back you'll go back to path -1 and then path - 3

            path++;
            roomNumber++;
            addHighscore(highscore,roomNumber);
            
            mainHistory.push({               //
                path: [path],                // 
                room: roomNumber,            // pushes new object into history
                doors: doors,                // 
                doorsTaken:[]                //
            });

             //will you die?
            if(chanceCalc(5)){
                document.getElementById('thoughtsBack').innerHTML = "";
                document.getElementById('doorOpened').innerHTML = 'you open the '+ doorNumberEnter[doorEntered-1] +' door'
                document.getElementById('thoughtsForward').innerHTML = getRandom(youDied);
                document.getElementById('buttonReverse').style.visibility = 'hidden';
                document.getElementById('buttonDoor').style.visibility = 'hidden';   
                document.getElementById('buttonRestart').style.display = 'inline';

                document.getElementById('highscore').innerHTML = highscore;
                document.getElementById('uniqueRooms').innerHTML = roomNumber;
                
            }
            
            else {
                //writes to screen the door you took and the doors you see + thoughts
                document.getElementById('thoughtsBack').innerHTML = "";   
                document.getElementById('doorOpened').innerHTML = 'you open the '+ doorNumberEnter[doorEntered-1] +' door and see '+ doorsInRoom[doors-1]+' '+spelling(doors);
                document.getElementById('thoughtsForward').innerHTML = getRandom(forwardThoughts);
                document.getElementById('buttonReverse').style.visibility = 'visible';
                document.getElementById('highscore').innerHTML = highscore;
                document.getElementById('uniqueRooms').innerHTML = roomNumber;


            }
        }
    }  
    
    
    //changes buttons
    if (doors > 1){
        document.getElementById('buttonDoor').innerHTML = "Open a Door"
    }
    else{
        document.getElementById('buttonDoor').innerHTML = "Open the Door"
    }
    
    console.log(mainHistory)

    
    
}

//----------
//  REVERSE
//----------

function reverse(){
    
    //you are outside and have never moved forward -> Nothing gets added
    if (mainHistory.length == 1){
        
        document.getElementById('thoughtsBack').innerHTML = "";
        document.getElementById('doorOpened').innerHTML = "There is no turning back";
        document.getElementById('thoughtsForward').innerHTML = "";
        document.getElementById('buttonReverse').style.visibility = 'hidden';
        
    }
    
    //you are in the anteRoom. You can not retrace your steps further
    /*else if (mainHistory.length == 2){
        
        path++
        currentRoom--                                         
        
        getByRoom(mainHistory,currentRoom).path.push(path)
        
        var roomInfo=getByPath(mainHistory,path)
        
        document.getElementById('thoughtsBack').innerHTML = "";
        document.getElementById('thoughtsForward').innerHTML = "";
        document.getElementById('doorOpened').innerHTML = "There is no turning back";
        document.getElementById('buttonReverse').style.visibility = 'hidden';
    }*/
    
    //best way would be to get a object 
    
    else {
        
        //object of the room you are going back to 
        
        var roomInfo=getByPath(mainHistory,path-(1+2*reverseVal))
        reverseVal++
        
        //adds path to the current room
        path++
        getByRoom(mainHistory,roomInfo.room).path.push(path)
                
        document.getElementById('thoughtsBack').innerHTML = getRandom(turnBackThoughts);
        document.getElementById('doorOpened').innerHTML = 'You '+getRandom(turnBackVerbs)+" and see "+ doorsInRoom[roomInfo.doors-1]+" "+spelling(roomInfo.doors);
        document.getElementById('thoughtsForward').innerHTML = ""
        
        //changes buttons
        if (roomInfo.doors > 1){
            document.getElementById('buttonDoor').innerHTML = "Open a Door"
        }
        else{
            document.getElementById('buttonDoor').innerHTML = "Open the Door"
        }

    }
    console.log(mainHistory)
}

//-----------
//  REINCARNATE
//-----------


function restart(){
    
    document.getElementById('thoughtsBack').innerHTML = "";
    document.getElementById('doorOpened').innerHTML = 'You are standing in front of an old redwood door'
    document.getElementById('thoughtsForward').innerHTML = "";
    document.getElementById('buttonReverse').style.visibility = 'visible';
    document.getElementById('buttonDoor').style.visibility = 'visible';  
    document.getElementById('buttonRestart').style.display = 'none';
    //reset all values (not highscore)
    mainHistory =[{ path:[0],            
                    room:0,          
                    doors:1,         
                    doorsTaken:[1],  
                 }];             
    reverseVal = 0 ;
    roomNumber = 0 ;
    blockedVar = 0;
    path = 0;
    
    document.getElementById('highscore').innerHTML = highscore;
    document.getElementById('uniqueRooms').innerHTML = roomNumber;
console.log(mainHistory)
}

//---------
//  MAP
//----------
function startMap() {
    map.start();
    map.draw(5,50,200,100);
}

var map = {         //create separate for mobile
    start : function(){
        this.canvas = document.getElementById("map");
        this.canvas.width = 400;
        this.canvas.height = 200;
        this.ctx = this.canvas.getContext("2d");
    },
    //draw random polygon function from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
    draw : function(sides,size,Xcenter,Ycenter){
  
        this.ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

        for (var i = 1; i <= sides;i += 1) {
            this.ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / sides), Ycenter + size * Math.sin(i * 2 * Math.PI / sides));
        }

        this.ctx.strokeStyle = "#black";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        
    },
    
}







