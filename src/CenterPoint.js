class CenterPoint {

    constructor (id) {
        this.id = id;
        this.adjIntersections = [];
        this.adjCenters = [];
        this.hex = null;
    }

    get uiElem() { return this.hex; }

    set uiElem(kineticHex) { this.hex = kineticHex; }

    get x() { return this.hex.attrs.x };
    get y() { return this.hex.attrs.y };
}

export default CenterPoint;