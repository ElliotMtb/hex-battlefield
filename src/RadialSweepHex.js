class RadialSweepHex {

    constructor(hexFactory, spacialData, kineticLayer) {
        this.hexFactory = hexFactory;
        this.spacialData = spacialData;
        this.kineticLayer = kineticLayer;
    }

    getNextCoords(centerX, centerY, radialIndex) {

        // -60 degree offset (negative is for counter-clockwise direction)
        var angleIncrement = -2 * Math.PI / 6;
        
        // start at angle 0
        var angleOffset = 0;

        var angleToVertex = radialIndex * angleIncrement - angleOffset;

        let radius = this.hexFactory.hexRadius * Math.sqrt(3);

        var xyPair = this.spacialData.getXyatArcEnd(centerX, centerY, radius, angleToVertex);
        
        return xyPair;
    }

    lookupExistingPoint(x, y) {
        return this.spacialData.getCenterPointByXy(x, y);
    }

    onCollision(collisionHex, centerPoint) {

        // Add neighbor etc.
        centerPoint.addNeighborCenterPoint(collisionHex.id);
        collisionHex.addNeighborCenterPoint(centerPoint.id);

        // Draw red line showing detected collision 
        // let line = new window.Kinetic.Line({
        //     points: [collisionHex.x, collisionHex.y, centerPoint.x, centerPoint.y],
        //     stroke: "red"
        // });

        // this.kineticLayer.add(line);
    }

    onNoCollision(x, y) {

        // Do nothing
    }

    onEveryStep(centerPoint, currentIntersect, previousIntersect) {
        // Do nothing
    }
}

export default RadialSweepHex;