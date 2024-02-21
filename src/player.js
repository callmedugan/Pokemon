import { Character } from "./character.js";

const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

export class Player extends Character{
    constructor(game, posX, posY){
        super(game, 0);
        //used to draw the player center of the screen
        this.drawX = Math.floor((this.canvasWidth/16) * 0.5);;
        this.drawY = Math.floor((this.canvasHeight/16) * 0.5);
        //these are the player position on the map
        this.positionX = posX;
        this.positionY = posY;

        //events and states
        this.targetIsEvent = false;
        this.playerCanMove = true;

    }

    //called at the beginning of every tick
    tickStart(){
        this.base_tickStart();
    }

    //called every frame
    update(ctx){

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

    setEventTarget(x, y){
        this.setMoveTarget(x, y);
        this.targetIsEvent = true;
    }

    mapWarp(playerX, playerY, direction){
        this.positionX = playerX;
        this.positionY = playerY;
        this.moveDirection = direction;
        this.movePath = [];
    }

}