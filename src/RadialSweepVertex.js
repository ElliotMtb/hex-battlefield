class RadialSweepVertex {

    constructor(hexFactory, spacialData, kineticLayer) {
        this.hexFactory = hexFactory;
        this.spacialData = spacialData;
        this.kineticLayer = kineticLayer;
    }

    getNextCoords(centerX, centerY, radialIndex) {

         // -60 degree offset (negative is for counter-clockwise direction)
         var angleIncrement = -2 * Math.PI / 6;
        
         // -30 degree offset (negative is for counter-clockwise direction)
         var angleOffset = -2 * Math.PI / 12;
 
         var angleToVertex = radialIndex * angleIncrement - angleOffset;
 
         var xyPair = this.spacialData.getXyatArcEnd(centerX, centerY, this.hexFactory.hexRadius, angleToVertex);
         
         return xyPair;
    }

    lookupExistingPoint(x, y) {
        return this.spacialData.getIntersectionByXy(x, y);
    }

    onCollision(existingIntersection) {

    }

    onNoCollision(x, y) {

        // Add new Intersection
        let vertex = this.hexFactory.getNewVertex(x, y);
        vertex.hide();
        this.kineticLayer.add(vertex);
        let newInter =  this.spacialData.addIntersection(vertex);

        return newInter;
    }

    onEveryStep(centerPoint, currentIntersect, previousIntersect) {

        // Add neighbor etc.
        currentIntersect.addNeighborIntersection(currentIntersect.id);

        if (previousIntersect) {
            currentIntersect.addNeighborIntersection(previousIntersect.id);
        }

        currentIntersect.addNeighborCenterPoint(centerPoint.id);
        centerPoint.addNeighborIntersection(currentIntersect.id);
    }
}

export default RadialSweepVertex;