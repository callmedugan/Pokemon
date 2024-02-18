
const eventTypes = {
    WARP: 0,
}

export class EventHandler{
    constructor(game, map, player, input){
        this.game = game;
        this.map = map;
        this.player = player;
        this.input = input;

        this.currentEvent = null;

    }

    startEvent(x, y){
        this.currentEvent = this.map.map.getEventData(x, y);
        //console.log(this.currentEvent);
        if(this.currentEvent){
            this.doWarpEvent();
        }
    }

    doWarpEvent(){
        //this.input.allowPlayerMovement = false;
        this.map.mapWarp(this.currentEvent[1]);
        this.player.mapWarp(this.currentEvent[2], this.currentEvent[3], this.currentEvent[4]);
    }

}