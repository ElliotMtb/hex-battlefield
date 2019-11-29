class GamePiece {

    constructor(type, playerId, image, scale) {
        this.type = type;
        this.playerId = playerId;
        this.image = image;
        this.scale = scale;
        this.facingDir = 'left';
    }

    moveTo(x,y) {

        let currentX = this.image.getAttr('x');

        if (x > currentX) {
            if (this.facingDir === 'left') {
                this.flipRight();
                this.facingDir = 'right';
            }
            this.image.setX(x+50*this.scale);
            this.image.setY(y-50*this.scale);
        }
        else if (x < currentX) {
            if (this.facingDir === 'right') {
                this.flipLeft();
                this.facingDir = 'left';
            }
            this.image.setX(x-50*this.scale);
            this.image.setY(y-50*this.scale);
        }

    }

    flipRight() {

        let x = this.image.getAttr('x');
        let y = this.image.getAttr('y');
    
        this.image.setScale({x:-1});
        this.image.rotateDeg(-15);
    }
    
    flipLeft() {
        this.image.setScale({x:1});
        this.image.rotateDeg(15);
    }
}

export default GamePiece;