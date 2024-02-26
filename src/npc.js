import {Animator} from "./animator.js";
import { Character } from "./character.js";

const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

export class Npc extends Character{
    constructor(game, posX, posY, spriteID, npcID){
        super(game, spriteID);
        //map position
        this.positionX = posX;
        this.positionY = posY;
        //movement stuff
        this.wanderRadius = 2;
        this.wanderChance = 0.2;
        //tracking
        this.id = npcID;
    }

    update(ctx){
        //get the offset to make the npc stand on the tile instead of be below it
        const xOffset = 16 - this.sizeX;
        const yOffset = 16 - this.sizeY;
        const isAnimatingThisTick = this.hasAnimation && this.movePath.length > 1;
        const smoothOffset = this.animator.getAnimationMovementOffset(this.game, isAnimatingThisTick);
        const directionOffset = this.getPixelOffset(smoothOffset);
        const drawX = this.positionX * 16 + xOffset + directionOffset.x;
        const drawY = this.positionY * 16 + yOffset + directionOffset.y;
        this.animator.update(   this.img, ctx, this.game,
                                drawX, drawY,
                                this.sizeX, this.sizeY,
                                this.moveDirection, isAnimatingThisTick);
    }

    tickStart(){
        //if we pass the movement random roll, set move target
        if(!this.hasMoveTarget && Math.random() <= this.wanderChance){
            const x = Math.floor(Math.random() * this.wanderRadius * 2 - this.wanderRadius);
            const y = Math.floor(Math.random() * this.wanderRadius * 2 - this.wanderRadius);
            const targetX = this.positionX + x;
            const targetY = this.positionY + y;
            if(this.game.mapHandler.checkIfTileIsWithinMap(targetX, targetY))
                this.setMoveTarget(targetX, targetY);
        }
        this.base_tickStart();
    }

    getPixelOffset(offset){
        if(this.moveDirection === directions.DOWN)
            return {x: 0, y: offset};
        else if(this.moveDirection === directions.UP)
            return {x: 0, y: -offset};
        else if(this.moveDirection === directions.LEFT)
            return {x: -offset, y: 0};
        else 
            return {x: offset, y:0};
    }

}