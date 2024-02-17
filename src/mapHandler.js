import { Map } from "./map.js";

const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
}

export class MapHandler{
    constructor(game){
        this.game = game;
        this.player = this.game.player;
        
        //used for marking the target tile
        this.isMouseHovering = false;
        this.mouseHoverX = 0;
        this.mouseHoverY = 0;
        this.mouseHoverPath = [[]];

        //animating tiles
        this.animTimer = 0;
        this.animFrameTick = 450;

        //controlled by player animator
        this.pixelOffsetX = 0;
        this.pixelOffsetY = 0;

        //this will be the current rendered map
        this.currentMapID = 0;
        this.map = new Map(game, this.currentMapID);
    }

    update(ctx, deltaTime){
        
        //draw the map based off of player position
        ctx.translate(  (-this.player.positionX + this.player.drawX) * 16 - this.pixelOffsetX,
                        (-this.player.positionY + this.player.drawY) * 16 - this.pixelOffsetY
                        );

        //drawing the tile markers
        if(this.player.hasMoveTarget)
        this.drawTileMarker(ctx, this.player.moveTargetX, this.player.moveTargetY, true);
            
        if(this.isMouseHovering){
            for (let i = 0; i < this.mouseHoverPath.length; i++) {
                this.drawTileMarker(ctx, this.mouseHoverPath[i][0], this.mouseHoverPath[i][1], false);
            }
        }

        //draw the tilemap
        this.drawTileMap(ctx, deltaTime);

        //reset the translations
        ctx.setTransform(1, 0, 0, 1, 0, 0);
       
    }

    drawTileMarker(ctx, x, y, isClicked){
        ctx.fillStyle = isClicked ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 0, 255, 0.1)';
        ctx.fillRect(   x * 16, y * 16, 16, 16);
    }

    onClickedTile(x, y){
        const mapDrawX = (-this.player.positionX + this.player.drawX) * 16;
        const mapDrawY = (-this.player.positionY + this.player.drawY) * 16;

        let clickedMapTileX = Math.floor((x - mapDrawX)/16);
        let clickedMapTileY = Math.floor((y - mapDrawY)/16);

        //check the map event tiles to see if we clicked an event and
        const clickedEvent = this.map.checkClickedTileForEvent(clickedMapTileX, clickedMapTileY);
        if(clickedEvent) this.player.setEventTarget(clickedMapTileX, clickedMapTileY);
        else this.player.setMoveTarget(clickedMapTileX, clickedMapTileY);
    }

    onHoverTile(x, y){
        if(this.isMouseHovering && this.mouseHoverX === x && this.mouseHoverY === y) return;
        this.isMouseHovering = true;
        const mapDrawX = (-this.player.positionX + this.player.drawX) * 16;
        const mapDrawY = (-this.player.positionY + this.player.drawY) * 16;

        this.mouseHoverX = Math.floor((x - mapDrawX)/16);
        this.mouseHoverY = Math.floor((y - mapDrawY)/16);

        //USE THIS TO DEBUG PATHS
        //this.mouseHoverPath = this.player.getPath(this.mouseHoverX, this.mouseHoverY);
    }

    noLongerHoveringOverTile(){
        this.isMouseHovering = false;
    }

    drawTileMap(ctx, deltaTime){

        //get the building tileset
        const buildingTileSetImg = document.getElementById('buildingTiles');
        this.actuallyDrawTileMap(ctx, this.map.building, buildingTileSetImg, false);

        //ground tiles
        const tileSetImg = document.getElementById('tileSet');
        this.actuallyDrawTileMap(ctx, this.map.ground, tileSetImg, false);

        //animated tiles
        const tileSetWidth = tileSetImg.width/16;
        this.animTimer += deltaTime;
        const animCycleDuration = tileSetWidth * this.animFrameTick;
        if(this.animTimer >= animCycleDuration) this.animTimer -= animCycleDuration;
        const animIndex = Math.floor(this.animTimer/this.animFrameTick);

        this.actuallyDrawTileMap(ctx, this.map.animated, tileSetImg, true, animIndex);

        //overheads
        //reset the ctx drawing method
        ctx.globalCompositeOperation = 'source-over';

        this.actuallyDrawTileMap(ctx, this.map.overhead, buildingTileSetImg, false);

        //reset the ctx drawing method
        ctx.globalCompositeOperation = 'destination-over';

    }

    actuallyDrawTileMap(ctx, tileArray, tileImg, isAnimated = false, animIndex = 0){
        //needed to properly loop values not on the first row
        const tileMapImgWidth = tileImg.width/16;
        for (let x = 0; x < tileArray.length; x++) {
            for (let y = 0; y < tileArray[x].length; y++) {
                const tile = tileArray[x][y];
                //skip empty tiles
                if(tile !== -1){
                    //convert tile number to x,y number - if animated, use the passed anim index
                    const tileY = Math.floor(tile/tileMapImgWidth);
                    const tileX = isAnimated ? animIndex : tile % tileMapImgWidth;
                    //draw the image
                    ctx.drawImage(tileImg, tileX*16, tileY*16, 16, 16, y*16, x*16, 16, 16);
                }
            };
        }
    }

    getCollisionMatrixAsBinary(playerX, playerY){
        const collision = this.map.collision;
        const playerTile = collision[playerX][playerY];
        //convert tile number to x,y number
        const playerDepth = Math.floor(playerTile/2);
        //const tileX = playerTile % 2;
        let matrix = Array.from(collision);
        //loop through the collision array to return a 0-1 matrix of walkable vs non-walkable tiles
        for (let x = 0; x < collision.length; x++) {
            for (let y = 0; y < collision[x].length; y++) {
                const tile = collision[x][y];
                //if tile is odd, it is not walkable
                if(tile % 2 === 1) matrix[x][y] = 1;
                //else compare the depth and if it is lower, you can walk
                else matrix[x][y] = playerDepth >= Math.floor(tile/2) ? 0 : 1;
            };
        };
        return matrix;
    }

    setMapPixelOffset(offset, direction){
        if(direction === directions.DOWN){
            this.pixelOffsetX = 0;
            this.pixelOffsetY = offset;
        }
        else if(direction === directions.UP){
            this.pixelOffsetX = 0;
            this.pixelOffsetY = -offset;
        }
        else if(direction === directions.LEFT){
            this.pixelOffsetX = -offset;
            this.pixelOffsetY = 0;
        }
        else{ //direction === directions.RIGHT
            this.pixelOffsetX = offset;
            this.pixelOffsetY = 0;
        }
    }

    mapWarp(mapID){
        this.map.setMapByID(mapID);
    }

}