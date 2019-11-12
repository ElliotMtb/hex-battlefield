class Intersection {

    constructor (id) {
        this.id = id;
        this.adjIntersections = [];
        this.adjCenters = [];
        this.vertex = null;
    }

    get x() { return this.vertex.attrs.x };
    get y() { return this.vertex.attrs.y };

    get uiElem() { return this.vertex; }

    set uiElem(kineticVertex) { this.vertex = kineticVertex; }

    addNeighborIntersection(intersectionId) {

        if (intersectionId) {

            let isAlreadyIn = this.adjIntersections.some(x => intersectionId === x.id);

            if (isAlreadyIn === false) {
                this.adjIntersections.push(intersectionId);
            }
        }
    }

    addNeighborCenterPoint() {

    }
}

export default Intersection;