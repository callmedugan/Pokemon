export class InputHandler{
    constructor(game, ctx){
        //track pressed keys in a array
        this.game = game;
        this.canvas = ctx.canvas;
        this.canvasRect = new DOMRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        window.addEventListener('touchstart', e => {
            //determine if touch was within the canvas
            if(this.isMouseEventInCanvas(e))
            this.game.map.onClickedTile(e.pageX - this.canvasRect.x, e.pageY - this.canvasRect.y);
        })

        window.addEventListener('mousedown', e => {
            //determine if mouse click was within the canvas
            if(this.isMouseEventInCanvas(e))
            this.game.map.onClickedTile(e.pageX - this.canvasRect.x, e.pageY - this.canvasRect.y);
        })

        window.addEventListener('mousemove', e => {
            //determine if mouse click was within the canvas
            if(this.isMouseEventInCanvas(e))
            this.game.map.onHoverTile(e.pageX - this.canvasRect.x, e.pageY - this.canvasRect.y);
            else
            this.game.map.noLongerHoveringOverTile();
        })

        //only recalculate the canvas rect if the page has been modified in some way
        window.addEventListener('load', this.calculateCanvasRect());
        window.addEventListener('scroll', this.calculateCanvasRect());
        window.addEventListener('resize', this.calculateCanvasRect());
    };

    //returns if mouse event was within the canvas
    isMouseEventInCanvas(e){
        return e.pageX >= this.canvasRect.left &&
            e.pageX <= this.canvasRect.right &&
            e.pageY >= this.canvasRect.top &&
            e.pageY <= this.canvasRect.bottom;
    }


    //called when the window is modified to get the true canvas rect to see if we click insde
    calculateCanvasRect(){
        let totalOffsetX = 0;
        let totalOffsetY = 0;
        let currentElement = this.canvas;

        //loop through all parents and accumulate the offset values
        do{
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent)

        //set the rect
        this.canvasRect.x = totalOffsetX;
        this.canvasRect.y = totalOffsetY;
    }

}