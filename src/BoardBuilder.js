import RadialSweepVertex from "./RadialSweepVertex";
import RadialSweepHex from "./RadialSweepHex";

class BoardBuilder {

    constructor (hexFactory, spacialData, intersectionBuilder) {
        this.hexFactory = hexFactory;
        this.spacialData = spacialData;
        this.intersectionBuilder = intersectionBuilder;
    }

    build (kineticLayer) {

        let startx = 75;
        let initialY = 75;

        let r = this.hexFactory.hexRadius;

        // Array(10).fill.map(..) is a trick to get a range
        Array(10).fill().map((_, i) => {

            let starty = initialY + i * (r + (1/2 * r));
            
            if (i % 2 === 1) {
                startx = startx - r/2 * Math.sqrt(3);
            }
            else {
                startx = startx + r/2 * Math.sqrt(3);
            }

            Array(10).fill().map((_, j) => {

                let x = startx  +  j * r * Math.sqrt(3);
                let hex = this.hexFactory.getNewHex(x, starty, 'green');
                //hex.rotateDeg(30);
                kineticLayer.add(hex);

                let lastCenterPoint = this.spacialData.addCenterPoint(hex);

                let sweepStepper = new RadialSweepVertex(this.hexFactory, this.spacialData, kineticLayer);
                this.intersectionBuilder.radialSweep(lastCenterPoint, sweepStepper);

                let otherStepper = new RadialSweepHex(this.hexFactory, this.spacialData, kineticLayer);
                this.intersectionBuilder.radialSweep(lastCenterPoint, otherStepper);

            });
      });

      kineticLayer.draw();
    }
}

export default BoardBuilder;