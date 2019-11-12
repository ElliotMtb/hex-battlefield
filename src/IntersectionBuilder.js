import Intersection from "./Intersection";

class IntersectionBuilder {

    constructor(hexFactory, spacialData, kineticLayer) {
        this.hexFactory = hexFactory;
        this.spacialData = spacialData;
        this.kineticLayer = kineticLayer;
    }

    radialSweep(centerPoint) {

        // Get range of 0 to 6
        // ES6 ... 'spread' operator
        var fwdIndices = [...Array(7).keys()];

        // Forward radial vertex-index sweep
        this.sweep(
            fwdIndices,
            centerPoint
        );

        // Reverse radial vertex-index sweep
        this.sweep(
            fwdIndices.reverse(),
            centerPoint
        );
    }

    getHexVertexCoords(centerX, centerY, radialIndex) {

        // -60 degree offset (negative is for counter-clockwise direction)
        var angleIncrement = -2 * Math.PI / 6;
        
        // -30 degree offset (negative is for counter-clockwise direction)
        var angleOffset = -2 * Math.PI / 12;

        var angleToVertex = radialIndex * angleIncrement - angleOffset;

        var xyPair = this.getXyatArcEnd(centerX, centerY, this.hexFactory.hexRadius, angleToVertex);
        
        return xyPair;
    }

    getXyatArcEnd = function(c1,c2,radius,angle) {
        
        return [c1+Math.cos(angle)*radius,c2+Math.sin(angle)*radius];
    };

    sweep(indicesSeq, centerPoint) {

        let lastIntersectionInSweep;        

        indicesSeq.map((_, radialIndex) => {

            let vertexCoords = this.getHexVertexCoords(centerPoint.x, centerPoint.y, radialIndex);

            let existing = this.spacialData.getIntersectionByXy(vertexCoords[0], vertexCoords[1]);
            let current;
            // Collision
            if (existing) {
                current = existing;
                console.log("Collision!");
            }
            // No Collision
            else {

                console.log("No Collision!");
                // Add new Intersection
                let vertex = this.hexFactory.getNewVertex(vertexCoords[0], vertexCoords[1]);

                this.kineticLayer.add(vertex);
                let newInter =  this.spacialData.addIntersection(vertex);
                
                current = newInter;
            }

            // Add neighbor etc.
            current.addNeighborIntersection(current.id);

            if (lastIntersectionInSweep) {
                current.addNeighborIntersection(lastIntersectionInSweep.id);
            }

            current.addNeighborCenterPoint(centerPoint)
            lastIntersectionInSweep = current;
        });
    }


}

export default IntersectionBuilder;