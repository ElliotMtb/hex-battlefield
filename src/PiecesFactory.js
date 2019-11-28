import GamePiece from './GamePiece.js';

class PiecesFactory {

    constructor(kineticFactory) {
        this.kineticFactory = kineticFactory;
    }

    getTank(playerId, x, y) {
        let scale = this.kineticFactory.hexRadius/120;
        let tank = this.kineticFactory.getTank(x, y, scale);
        let piece = new GamePiece('tank', 1, tank, scale);

        return piece;
    }
}

export default PiecesFactory;