export class InputHandler{
    constructor(game, ctx){
        this.game = game;
        this.canvas = ctx.canvas;
        this.canvasRect = new DOMRect(0, 0, this.game.virtualWidth, this.game.virtualHeight);
        this.allowPlayerMovement = true;

        window.addEventListener('touchstart', e => {
            //determine if touch was within the canvas
            if(this.allowPlayerMovement && this.isMouseEventInCanvas(e))
            {
                const onClickedTile = new CustomEvent('onClickedTile', {
                    detail: {
                    x: e.pageX - this.canvasRect.x,
                    y: e.pageY - this.canvasRect.y
                    },
                });
                window.dispatchEvent(onClickedTile);
            }
        })

        window.addEventListener('mousedown', e => {
            //determine if click was within the canvas
            if(this.allowPlayerMovement && this.isMouseEventInCanvas(e))
            {
                const onClickedTile = new CustomEvent('onClickedTile', {
                    detail: {
                    x: e.pageX - this.canvasRect.x,
                    y: e.pageY - this.canvasRect.y
                    },
                });
                window.dispatchEvent(onClickedTile);
            }
        })

        window.addEventListener('mousemove', e => {
            //determine if mouse click was within the canvas
            if(this.allowPlayerMovement && this.isMouseEventInCanvas(e)) {
                const onHoverTile = new CustomEvent('onHoverTile', {
                    detail: {
                    x: e.pageX - this.canvasRect.x,
                    y: e.pageY - this.canvasRect.y
                    },
                });
                window.dispatchEvent(onHoverTile);
            }
            else {
                const onHoverTileStopped = new CustomEvent('onHoverTileStopped');
                window.dispatchEvent(onHoverTileStopped);
            }
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