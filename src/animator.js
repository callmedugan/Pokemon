const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

export class Animator{
    constructor(){
        this.directionFacing = directions.DOWN;
        this.animationFrameCount = 4;
    }

    update(img, ctx, game, drawX, drawY, sizeX, sizeY, direction, isMoving){
        const tTimer = game.tickTimer;
        const t = game.tick;
        //find the percentage between the tick timer and tick length and use it to pick a sprite
        const spriteX = isMoving ? Math.floor((tTimer/t) * this.animationFrameCount) : 0;
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