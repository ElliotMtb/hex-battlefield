class GamePiece {

    constructor(type, playerId, image, scale) {
        this.type = type;
        this.playerId = playerId;
        this.image = image;
        this.scale = scale;
    }

    moveTo(x,y) {
        this.image.setX(x-50*this.scale);
        this.image.setY(y-50*this.scale);
    }
}

export default GamePiece;