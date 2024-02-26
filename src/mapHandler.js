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
        this.currentMapID = 3;
        this.map = new Map(game, this.currentMapID);

        //map tileset imgs
        this.buildingTilesetImg = document.getElementById('buildingTilesetImg');
        this.animatedTilesetImg = document.getElementById('animatedTilesetImg');
        this.groundTilesetImg = document.getElementById('groundTilesetImg');

        //set up listener events
        window.addEventListener('onClickedTile', e => {
            this.onClickedTile(e);
        });

        window.addEventListener('onHoverTile', e => {
            this.onHoverTile(e);
        });

        window.addEventListener('onHoverTileStopped', e =>{
            this.onHoverTileStopped();
        });

        window.addEventListener('onMapWarp', e => {
            this.onMapWarp(e);
        });

    }

    update(ctx, deltaTime){
       
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
       
    }

    setCanvasOffset(ctx){
        //draw the map based off of player position
        ctx.translate(  (-this.player.positionX + this.player.drawX) * 16 - this.pixelOffsetX,
        (-this.player.positionY + this.player.drawY) * 16 - this.pixelOffsetY
        );
    }

    drawTileMarker(ctx, x, y, isClicked){
        ctx.fillStyle = isClicked ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 0, 255, 0.1)';
        ctx.fillRect(   x * 16, y * 16, 16, 16);
    }

    onClickedTile(e){
        const x = e.detail.x;
        const y = e.detail.y;
        //destructure the return array to 2 seperate vars for readability
        const [clickedMapTileX, clickedMapTileY] = this.getTileCoordinatesFromPointerPosition(x, y);

        //check to see if we clicked within the map
        if(     clickedMapTileX < 0 || clickedMapTileY < 0 ||
                clickedMapTileY > this.map.collision.length - 1 ||
                clickedMapTileX > this.map.collision[0].length - 1){
            console.log('clicked out of bounds');
            return;
        }

        //check the map event tiles to see if we clicked an event and
        const clickedEvent = this.map.checkClickedTileForEvent(clickedMapTileX, clickedMapTileY);
        if(clickedEvent) this.player.setEventTarget(clickedMapTileX, clickedMapTileY);
        else this.player.setMoveTarget(clickedMapTileX, clickedMapTileY);
    }

    onHoverTile(e){
        const x = e.detail.x;
        const y = e.detail.y;
        if(this.isMouseHovering && this.mouseHoverX === x && this.mouseHoverY === y) return;
        this.isMouseHovering = true;

        //destructure the return array to 2 seperate vars for readability
        [this.mouseHoverX, this.mouseHoverY] = this.getTileCoordinatesFromPointerPosition(x, y);

        //USE THIS TO DEBUG PATHS
        //this.mouseHoverPath = this.player.getPath(this.mouseHoverX, this.mouseHoverY);
    }

    getTileCoordinatesFromPointerPosition(x, y){
        //x and y are brought in as screen space relative to the canvas and returned as a tile coordinate
        const mapDrawX = (-this.player.positionX + this.player.drawX) * 16 * this.game.scale;
        const mapDrawY = (-this.player.positionY + this.player.drawY) * 16 * this.game.scale;

        let returnX = Math.floor((x - mapDrawX)/(16 * this.game.scale));
        let returnY = Math.floor((y - mapDrawY)/(16 * this.game.scale));

        return[returnX, returnY];
    }

    onHoverTileStopped(){
        this.isMouseHovering = false;
    }

    drawTileMap(ctx, deltaTime){

        ///////everything is rendered top-down and then after, the draw mode is changed to put overheads on top

        //get the building tileset
        if(this.map.building.length > 0)
        this.actuallyDrawTileMap(ctx, this.map.building, this.buildingTilesetImg, false);

        //animated tiles
        if(this.map.animated.length > 0){
            const tileSetWidth = this.animatedTilesetImg.width/16;
            this.animTimer += deltaTime;
            const animCycleDuration = tileSetWidth * this.animFrameTick;
            if(this.animTimer >= animCycleDuration) this.animTimer -= animCycleDuration;
            const animIndex = Math.floor(this.animTimer/this.animFrameTick);
            //draw
            this.actuallyDrawTileMap(ctx, this.map.animated, this.animatedTilesetImg, true, animIndex);
        }   

        //ground tiles
        if(this.map.ground.length > 0)
        this.actuallyDrawTileMap(ctx, this.map.ground, this.groundTilesetImg, false);
        
        //overheads
        if(this.map.overhead.length > 0){
            ctx.globalCompositeOperation = 'source-over';
            this.actuallyDrawTileMap(ctx, this.map.overhead, this.buildingTilesetImg, false);
            ctx.globalCompositeOperation = 'destination-over';
        }

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
        const playerTile = collision[playerY][playerX];
        //convert tile number to x,y number
        const playerDepth = Math.floor(playerTile/2);
        //let matrix = collision[0].map((_, colIndex) => collision.map(row => row[colIndex]));
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

    onMapWarp(e){
        //sets the map
        this.map.setMapByID(e.detail.id);
        //event to npc handler
        const populateNpcData = new CustomEvent('populateNpcData', {
            detail: {
                data: this.map.npcData
            }
        });
        window.dispatchEvent(populateNpcData);
    }

}