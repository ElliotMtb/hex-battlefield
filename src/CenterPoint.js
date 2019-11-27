class CenterPoint {

    constructor (id) {
        this.id = id;
        this.adjIntersections = [];
        this.adjCenters = [];
        this.hex = null;
        this.piece = null;
    }

    get occupyingPiece() { return this.piece }
    set occupyingPiece(piece) { this.piece = piece }
    
    get uiElem() { return this.hex; }

    set uiElem(kineticHex) { this.hex = kineticHex; }

    get x() { return this.hex.attrs.x };
    get y() { return this.hex.attrs.y };

    addNeighborCenterPoint(centerPointId) {

        if (typeof(centerPointId) !== 'undefined' && centerPointId !== null) {

            let isAlreadyIn = this.adjCenters.some(x => centerPointId === x);

            if (isAlreadyIn === false) {
                this.adjCenters.push(centerPointId);
            }
        }
    }
}

export default CenterPoint;