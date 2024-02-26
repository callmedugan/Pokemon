
const eventTypes = {
    WARP: 0,
}

export class EventHandler{
    constructor(game, mapHandler, player, input){
        this.game = game;
        this.mapHandler = mapHandler;
        this.player = player;
        this.input = input;

        this.currentEvent = null;

        //called when player reaches an event target
        window.addEventListener('startEvent', e => {
            this.startEvent(e);
        });

    }

    startEvent(e){
        const x = e.detail.x;
        const y = e.detail.y;
        this.currentEvent = this.mapHandler.map.getEventData(x, y);
        //console.log(this.currentEvent);
        if(this.currentEvent){
            this.dispatchWarpEvent();
        }
    }

    dispatchWarpEvent(){
        const onMapWarp = new CustomEvent('onMapWarp', {
            detail: {
                id: this.currentEvent[1],
                x: this.currentEvent[2],
                y: this.currentEvent[3],
                dir: this.currentEvent[4]
            }
        });
        window.dispatchEvent(onMapWarp);

        // this.mapHandler.mapWarp(this.currentEvent[1]);
        // this.player.mapWarp(this.currentEvent[2], this.currentEvent[3], this.currentEvent[4]);
    }

}