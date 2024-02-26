import {Animator} from "./animator.js";

const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

export class Character{
    constructor(game, spriteID){
        this.game = game;
        //set the canvas size
        this.canvasWidth = game.width;
        this.canvasHeight = game.height;
        this.img = document.getElementById('characterImg');
        //used to draw the player center of the screen
        // this.drawX = Math.floor((this.canvasWidth/16) * 0.5);;
        // this.drawY = Math.floor((this.canvasHeight/16) * 0.5);
        // //these are the player position on the map
        // this.positionX = 13;
        // this.positionY = 10;
        //player sprite size
        this.sizeX = 16;
        this.sizeY = 22;
        
        //movement
        this.currentPixelMove = 0;
        this.moveStep = this.gameTick*1000 / 16;
        this.moveTargetX = 0;
        this.moveTargetY = 0;
        this.moveDirection = directions.DOWN;

        //sprite animation
        this.animator = new Animator(spriteID);
        this.waitForTickToAnimate = false;
        this.hasAnimation = false;
        this.spriteID = spriteID;

        //pathfinding
        this.pathFinder = new PF.AStarFinder();
        this.hasMoveTarget = false;
        this.moveMatrix = [[]];
        this.movePath = [[]];

        // //events and states
        // this.targetIsEvent = false;
        // this.playerCanMove = true;
    }

    //called at the beginning of every tick
    base_tickStart(){
        this.animator.tickStart();
        if(this.waitForTickToAnimate){
            this.hasAnimation = true;
            this.waitForTickToAnimate = false;
            this.updatePathFinding();
        }
        else if(this.hasMoveTarget){
            //find out if we have reached the target
            if((this.positionX === this.moveTargetX && this.positionY === this.moveTargetY) ||
                this.targetIsEvent && this.movePath.length <= 1){
                this.onTargetReached();
            }
            //otherwise we will move the player and update path
            else{
                this.positionX = this.movePath[1][0];
                this.positionY = this.movePath[1][1];
                this.updatePathFinding();
            }
        }
    }

    //called every frame
    update(ctx){

    }
 
     setMoveTarget(x, y){
         //this is only set if we are the last step of a current path or we dont have a path
         if(this.movePath.length <= 1) this.waitForTickToAnimate = true;
         this.moveTargetX = x;
         this.moveTargetY = y;
         this.targetIsEvent = false;
     }
 
     updatePathFinding(){
         //to find a path
         this.movePath = this.getPath(this.moveTargetX, this.moveTargetY);
 
         //determine if we found a valid path
         this.hasMoveTarget = (this.movePath !== undefined && this.movePath.length > 0);
 
         //set direction
         this.setFaceDirection();
     }
 
     getPath(x, y){
         //get binary collision map
         let collision = this.game.mapHandler.getCollisionMatrixAsBinary(this.positionX, this.positionY);
 
         //set the event as walkable to find a path to a wall or unwalkable tile
         if(this.targetIsEvent){
             //coordinates are backwards on purpose
             collision[y][x] = 0;
             let pathFinderGrid = new PF.Grid(collision);
             let returnPath = this.pathFinder.findPath(this.positionX, this.positionY, x, y, pathFinderGrid);
             //remove the last tile
             //if(returnPath.length > 1) 
             returnPath.pop();
             return returnPath;
         }
         //init return path - normal route
         let pathFinderGrid = new PF.Grid(collision);
         //initializing the objects for pathfinding
         //to find a path
         return this.pathFinder.findPath(this.positionX, this.positionY, x, y, pathFinderGrid);
     }
 
     //called to face an event or direction we are moving
     setFaceDirection(){
         let x = 0;
         let y = 0;
         if(this.movePath.length > 1){
             x = this.movePath[1][0] - this.positionX;
             y = this.movePath[1][1] - this.positionY;
         }
         else{
             x = this.moveTargetX - this.positionX;
             y = this.moveTargetY - this.positionY;
         }
         //default
         //this.moveDirection = directions.DOWN;
         if(x !== 0) this.moveDirection = x > 0 ? directions.RIGHT : directions.LEFT;
         else if (y !== 0) this.moveDirection = y > 0 ? directions.DOWN : directions.UP;
     }
 
     //called when we reach the target
     onTargetReached(){
         this.hasMoveTarget = false;
         this.hasAnimation = false;
         this.targetIsEvent = false;
     }

     getPosition(){
        return[this.positionX, this.positionY];
     }
 
}