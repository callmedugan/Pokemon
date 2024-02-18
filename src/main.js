import { Player } from "./player.js";
import { Map } from "./map.js";
import { InputHandler } from "./input.js";
import { MapHandler } from "./mapHandler.js";
import { EventHandler } from "./EventHandler.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

//set the width and height since the canvas is not inherently set by css
canvas.style.height = '400px'
canvas.style.width = '400px'
canvas.width = 400;
canvas.height = 400;

class Game{

    constructor(){
        this.width = canvas.width;
        this.height = canvas.height;
        //scale
        this.scale = 1;
        //create an instance of a player class
        this.player = new Player(this);
        this.tick = 300;
        this.oldTimeStamp = 0;
        this.tickTimer = 0;
        //create a map instance
        this.map = new MapHandler(this);
        //create input handler
        this.input = new InputHandler(this, ctx);
        //create event handler which will override functionality in multiple components
        this.eventHandler = new EventHandler(this, this.map, this.player, this.input);

    }

    //runs calculations every frame
    update(deltaTime, ctx){
        //run updates for all components - run player first and draw on top because player position determines map
        //drawing position
        ctx.globalCompositeOperation = 'destination-over';
        //run updates
        this.player.update(this.input.keys, ctx, deltaTime);
        this.map.update(ctx, deltaTime);
        
    }

    //runs calculations every frame
    tickStart(deltaTime, ctx){
        //run updates for all components
        this.player.tickStart(this.input.keys, ctx, deltaTime);
    }

}



//add listener for when all imgs and resources are loaded
window.addEventListener('load', function(){

    //create new instance of a game class
    const game = new Game();

    function mainUpdateLoop(timeStamp){
        //set your tick time
        const deltaTime = timeStamp - game.oldTimeStamp;
        game.oldTimeStamp = timeStamp;
        game.tickTimer += deltaTime;
        //reset the tickTimer and run tick start on all components
        if(game.tickTimer >= game.tick){
            game.tickTimer -= game.tick;
            game.tickStart(deltaTime, ctx);
        }
        //clear the screen
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //update runs every frame
        game.update(deltaTime, ctx);
        requestAnimationFrame(mainUpdateLoop);

    }

    //main start of animate loop
    mainUpdateLoop(0);

});

