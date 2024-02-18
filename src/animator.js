const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

export class Animator{
    constructor(){
        this.directionFacing = directions.DOWN;
        this.animationFrameCount = 2;
        this.usingRightFoot = false;
    }

    tickStart(){
        this.usingRightFoot = !this.usingRightFoot;
    }

    update(img, ctx, game, drawX, drawY, sizeX, sizeY, direction, isMoving){
        const tTimer = game.tickTimer;
        const t = game.tick;
        //find the percentage between the tick timer and tick length and use it to pick a sprite
        let spriteX = isMoving ? Math.floor((tTimer/t) * this.animationFrameCount) : 0;
        //alternate feet
        if(spriteX === 1 && this.usingRightFoot) spriteX = 3;
        //draw player
        ctx.drawImage(img,
            spriteX * sizeX, direction * sizeY, sizeX, sizeY,
            drawX, drawY, sizeX, sizeY);
    }

    getAnimationMovementOffset(game, isMoving){
        if(!isMoving) return 0;
        const tTimer = game.tickTimer;
        const t = game.tick;
        //find the percentage between the tick timer and tick length and use it to pick a sprite
        return Math.floor((tTimer/t) * 16);
    }
}