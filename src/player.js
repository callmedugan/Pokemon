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

        //events
        window.addEventListener('onMapWarp', e => {
            this.onMapWarp(e);
        });

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
        this.game.mapHandler.setMapPixelOffset(offset, this.moveDirection);
        //call animator update
        this.animator.update(this.img, ctx, this.game, this.drawX * 16 + xOffset, this.drawY * 16 + yOffset, this.sizeX, this.sizeY, this.moveDirection, isAnimatingThisTick);
    }

    setEventTarget(x, y){
        this.setMoveTarget(x, y);
        this.targetIsEvent = true;
    }

    //called when we reach the target - this overrides the character ontargetreached method
    onTargetReached(){
        if(this.targetIsEvent){
            this.setFaceDirection();
            //this.game.eventHandler.startEvent(this.moveTargetX, this.moveTargetY);
            const onClickedTile = new CustomEvent('startEvent', {
                detail: {
                    x: this.moveTargetX,
                    y: this.moveTargetY
                },
            });
            window.dispatchEvent(onClickedTile);
        }
        this.hasMoveTarget = false;
        this.hasAnimation = false;
        this.targetIsEvent = false;
    }

    onMapWarp(e){
        this.positionX = e.detail.x;
        this.positionY = e.detail.y;
        this.moveDirection = e.detail.dir;
        this.movePath = [];
    }

}