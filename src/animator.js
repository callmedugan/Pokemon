const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

//how many sprites wide is each different overworld character
const spriteSheetWidth = 4;

export class Animator{
    constructor(spriteID){
        this.directionFacing = directions.DOWN;
        this.animationFrameCount = 2;
        this.usingRightFoot = false;
        this.spriteID = spriteID;
    }

    tickStart(){
        this.usingRightFoot = !this.usingRightFoot;
    }

    update(img, ctx, game, drawX, drawY, sizeX, sizeY, direction, isMoving, xOffset = 0, yOffset = 0){
        const tTimer = game.tickTimer;
        const t = game.tick;
        //find the percentage between the tick timer and tick length and use it to pick a sprite
        let spriteX = isMoving ? Math.floor((tTimer/t) * this.animationFrameCount) : 0;
        //alternate feet
        if(spriteX === 1 && this.usingRightFoot) spriteX = 3;
        //draw player
        ctx.drawImage(img,
            (this.spriteID * spriteSheetWidth * sizeX) + spriteX * sizeX,
            direction * sizeY, sizeX, sizeY,
            drawX + xOffset, drawY + yOffset, sizeX, sizeY);
        
    }

    getAnimationMovementOffset(game, isMoving){
        if(!isMoving) return 0;
        const tTimer = game.tickTimer;
        const t = game.tick;
        //find the percentage between the tick timer and tick length and use it to pick a sprite
        return Math.floor((tTimer/t) * 16);
    }
}