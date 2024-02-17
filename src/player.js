import {Animator} from "./animator.js";

const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

export class Player{
    constructor(game){
        this.game = game;
        //set the canvas size
        this.canvasWidth = game.width;
        this.canvasHeight = game.height;
        this.img = document.getElementById('playerImg');
        //used to draw the player center of the screen
        this.drawX = Math.floor((this.canvasWidth/16) * 0.5);;
        this.drawY = Math.floor((this.canvasHeight/16) * 0.5);
        //these are the player position on the map
        this.positionX = 13;
        this.positionY = 10;
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
        this.animator = new Animator();
        this.waitForTickToAnimate = false;
        this.hasAnimation = false;

        //pathfinding
        this.pathFinder = new PF.AStarFinder();
        this.hasMoveTarget = false;
        this.moveMatrix = [[]];
        this.movePath = [[]];

        //events and states
        this.targetIsEvent = false;
        this.playerCanMove = true;

    }

    //called at the beginning of every tick
    tickStart(input, ctx, deltaTime){
        if(this.waitForTickToAnimate){
            this.hasAnimation = true;
            this.waitForTickToAnimate = false;
            this.updatePathFinding();
        }
        else if(this.hasMoveTarget){
            //find out if we have reached the target
            if(this.positionX === this.moveTargetX && this.positionY === this.moveTargetY){
                this.hasMoveTarget = false;
                this.hasAnimation = false;
            }
            //otherwise we will mvoe the player and update path
            else{
                this.positionX = this.movePath[1][0];
                this.positionY = this.movePath[1][1];
                this.updatePathFinding();
            }
        }
    }

    //called every frame
    update(input, ctx, deltaTime){

       //get the offset to make the player stand on the tile instead of be below it
        const xOffset = 16 - this.sizeX;
        const yOffset = 16 - this.sizeY;
        //update the maps pixel offset - we have to ask if we want to move the map this tick
        const isAnimatingThisTick = this.hasAnimation && this.movePath.length > 1;
        const offset = this.animator.getAnimationMovementOffset(this.game, isAnimatingThisTick);
        this.game.map.setMapPixelOffset(offset, this.moveDirection);
        //call animator update
        this.animator.update(this.img, ctx, this.game, this.drawX * 16 + xOffset, this.drawY * 16 + yOffset, this.sizeX, this.sizeY, this.moveDirection, isAnimatingThisTick);
    }

    setMoveTarget(x, y){
        //this is only set if we are the last step of a current path or we dont have a path
        if(this.movePath.length <= 1) this.waitForTickToAnimate = true;
        this.moveTargetX = x;
        this.moveTargetY = y;
    }

    updatePathFinding(){
        //to find a path
        this.movePath = this.getPath(this.moveTargetX, this.moveTargetY);

        //determine if we found a valid path
        this.hasMoveTarget = (this.movePath !== undefined && this.movePath.length > 0);

        //set direction
        if(this.movePath.length > 1) this.setMoveDirection();
    }

    getPath(x, y){
        //get binary collision map
        let collision = this.game.map.getCollisionMatrixAsBinary(this.positionX, this.positionY);
        //determine if the target is within the pathfinding matrix
        if( x< 0 || y < 0 || x >= collision.length - 1 || y >= collision[0].length - 1){
            return [0, 0];
        }
        //initializing the objects for pathfinding
        let pathFinderGrid = new PF.Grid(collision);
        //to find a path
        return this.pathFinder.findPath(this.positionX, this.positionY, x, y, pathFinderGrid);
    }

    //called after we find a path
    setMoveDirection(){
        const x = this.movePath[1][0] - this.positionX;
        const y = this.movePath[1][1] - this.positionY;
        //default
        //this.moveDirection = directions.DOWN;
        if(x !== 0) this.moveDirection = x > 0 ? directions.RIGHT : directions.LEFT;
        else if (y !== 0) this.moveDirection = y > 0 ? directions.DOWN : directions.UP;

    }

    //called when we reach the target

}