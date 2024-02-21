import {Animator} from "./animator.js";
import { Character } from "./character.js";

const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

export class Npc extends Character{
    constructor(game, posX, posY, spriteID){
        super(game, spriteID);
        //map position
        this.positionX = posX;
        this.positionY = posY;
        //movement stuff
        this.wanderRadius = 2;
        this.wanderChance = 0.2;
    }

    update(ctx){
        //get the offset to make the npc stand on the tile instead of be below it
        const xOffset = 16 - this.sizeX;
        const yOffset = 16 - this.sizeY;
        const isAnimatingThisTick = this.hasAnimation && this.movePath.length > 1;
        const smoothOffset = Math.floor(this.animator.getAnimationMovementOffset(this.game, isAnimatingThisTick) / 16);
        const directionOffset = this.getPixelOffset(smoothOffset);
        this.animator.update(   this.img, ctx, this.game,
                                this.positionX * 16 + xOffset,
                                this.positionY * 16 + yOffset, 
                                this.sizeX, this.sizeY, this.moveDirection, isAnimatingThisTick,
                                directionOffset[0], directionOffset[1]);
    }

    tickStart(){
        //if we pass the movement random roll, set move target
        if(!this.hasMoveTarget && Math.random() <= this.wanderChance){
            const x = Math.floor(Math.random() * this.wanderRadius * 2 - this.wanderRadius);
            const y = Math.floor(Math.random() * this.wanderRadius * 2 - this.wanderRadius);
            const targetX = this.positionX + x;
            const targetY = this.positionY + y;
            this.setMoveTarget(targetX, targetY);
        }
        this.base_tickStart();
    }

    getPixelOffset(offset){
        const r = [0,0];
        if(this.direction === directions.DOWN){
            r[0] = 0;
            r[1] = offset;
        }
        else if(this.direction === directions.UP){
            r[0] = 0;
            r[1] = -offset;
        }
        else if(this.direction === directions.LEFT){
            r[0] = -offset;
            r[1] = 0;
        }
        else{ //direction === directions.RIGHT
            r[0] = offset;
            r[1] = 0;
        }
        return r;
    }

}