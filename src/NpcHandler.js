import { Npc } from "./npc.js";

export class NpcHandler{
    constructor(game){
        this.game = game;

        //stores all of the npcs for the current map
        this.npc = [new Npc(this.game, 15, 10, 1, 0),
                    new Npc(this.game, 20, 10, 1, 1)];

        //events
        window.addEventListener('populateNpcData', e => {
            this.onMapWarp(e);
        });
    }

    tickStart(){
        this.npc.forEach(n => {
            n.tickStart();
        });
    }

    update(ctx){
        this.npc.forEach(n => {
            n.update(ctx);
        });
    }

    onMapWarp(e){
        this.npc = [];
        //return if the map has no event data
        if(!e.detail.data) return;
        //otherwise add each to the array
        e.detail.data.forEach(i => {
            this.addNpc(i[0], i[1], i[2]);
        });
    }

    addNpc(x, y, spriteID){
        const id = this.npc.length - 1;
        const n = new Npc(this.game, x, y, spriteID, id);
        this.npc.push(n);
    }

    removeNpc(n){
        const id = n.id;
        let index = -1;
        //find the index given the npc id
        for (let i = 0; i < this.npc.length; i++) {
            if(this.npc[i].id === id){
                index = i;
                break;
            }
        }
        //remove
        if(index !== -1) this.npc.splice(index, 1);
    }

}