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

        if (typeof(intersectionId) !== 'undefined' && intersectionId !== null) {

            let isAlreadyIn = this.adjIntersections.some(x => intersectionId === x);

            if (isAlreadyIn === false) {
                this.adjIntersections.push(intersectionId);
            }
        }
    }

    addNeighborCenterPoint(centerPointId) {

        if (typeof(centerPointId) !== 'undefined' && centerPointId !== null) {

            let isAlreadyIn = this.adjCenters.some(x => centerPointId === x);

            if (isAlreadyIn === false) {
                this.adjCenters.push(centerPointId);
            }
        }
    }
}

export default Intersection;