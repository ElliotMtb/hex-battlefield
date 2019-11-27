import GamePiece from './GamePiece.js';

class PiecesFactory {

    constructor(kineticFactory) {
        this.kineticFactory = kineticFactory;
    }

    getTank(playerId, x, y) {
        let tank = this.kineticFactory.getTank(x, y);
        let piece = new GamePiece('tank', 1, tank);

        return piece;
    }
}

export default PiecesFactory;