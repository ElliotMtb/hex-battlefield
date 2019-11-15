import Intersection from "./Intersection";
import RadialSweepVertex from "./RadialSweepHex";
import RadialSweepHex from "./RadialSweepHex";

class IntersectionBuilder {

    constructor(hexFactory, spacialData, kineticLayer) {
        this.hexFactory = hexFactory;
        this.spacialData = spacialData;
        this.kineticLayer = kineticLayer;
    }

    radialSweep(centerPoint, sweepStepper) {

        // Get range of 0 to 6
        // ES6 ... 'spread' operator
        var fwdIndices = [...Array(7).keys()];

        // Forward radial vertex-index sweep
        this.sweep(
            fwdIndices,
            centerPoint,
            sweepStepper
        );

        // Reverse radial vertex-index sweep
        this.sweep(
            fwdIndices.reverse(),
            centerPoint,
            sweepStepper
        );
    }

    sweep(indicesSeq, centerPoint, sweepStepper) {

        let previous;

        indicesSeq.map((_, radialIndex) => {

            let sweepCoords = sweepStepper.getNextCoords(centerPoint.x, centerPoint.y, radialIndex);

            let existing = sweepStepper.lookupExistingPoint(sweepCoords[0], sweepCoords[1]);
            let current;
            // Collision
            if (existing) {
                current = existing;
                console.log("Collision!");
                sweepStepper.onCollision(existing, centerPoint);
            }
            // No Collision
            else {

                console.log("No Collision!");
                let newInter = sweepStepper.onNoCollision(sweepCoords[0], sweepCoords[1]);
                
                current = newInter;
            }

            sweepStepper.onEveryStep(centerPoint, current, previous);

            previous = current;
        });
    }

    addNewIntersection(x,y) {
        
    }
}

export default IntersectionBuilder;