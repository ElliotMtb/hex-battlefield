import LineOfSightTargetter from './LineOfSightTargetter.js';

class GameBoardController {

    constructor(spacialData, kineticLayer, Kinetic, lineOfSightTargetter) {
        this.Kinetic = Kinetic;
        this.kineticLayer = kineticLayer;
        this.spacialData = spacialData;

        this.lineOfSightTargetter = lineOfSightTargetter;
        kineticLayer.add(this.lineOfSightTargetter.blockerCenterLine);
        kineticLayer.add(this.lineOfSightTargetter.leftEdgeBlocker);
        kineticLayer.add(this.lineOfSightTargetter.rightEdgeBlocker);
        lineOfSightTargetter.orthogLines.map(o => kineticLayer.add(o));

        this.faceTrailingEdge = new this.Kinetic.Line(
            {
                points: [0,0,0,0],
                stroke: 'red'
            }
        );

        this.faceLeadingEdge = new this.Kinetic.Line(
            {
                points: [0,0,0,0],
                stroke: 'blue'
            }
        );
        this.kineticLayer.add(this.faceLeadingEdge);
        this.kineticLayer.add(this.faceTrailingEdge);

        this.selectedHex = '';
    }

    bindEmAll() {
        this.bindAllHexClicks(this.bindOn);
        document.onkeydown = (e) => {
            
            if (this.selectedHex !== '' && this.selectedHex.occupyingPiece !== null) {

                let allNeighbors = this.spacialData.centerPoints.filter(x => this.selectedHex.adjCenters.some(y => y === x.id));
                let movingTo;

                // left
                if (e.keyCode === 37) {
                    movingTo = allNeighbors.find(
                        cp =>
                            cp.x < this.selectedHex.x &&
                            cp.y === this.selectedHex.y
                        );
                }
                // up
                else if (e.keyCode === 38) {
                    movingTo = allNeighbors.find(
                        cp =>
                            cp.x > this.selectedHex.x &&
                            cp.y < this.selectedHex.y
                        );
                }
                // right
                else if (e.keyCode === 39) {
                    movingTo = allNeighbors.find(
                        cp =>
                            cp.x > this.selectedHex.x &&
                            cp.y === this.selectedHex.y
                        );
                }
                // down
                else if (e.keyCode === 40) {
                    movingTo = allNeighbors.find(
                        cp =>
                            cp.x < this.selectedHex.x &&
                            cp.y > this.selectedHex.y
                        );
                    
                }

                if (typeof(movingTo) !== 'undefined') {

                    let thePiece = this.selectedHex.occupyingPiece;
                    this.selectedHex.occupyingPiece = null;
        
                    this.spacialData.setOccupyingPiece(movingTo.id, thePiece);
                    this.selectHex(movingTo);
                    thePiece.moveTo(movingTo.hex.getAttr('x'), movingTo.hex.getAttr('y'));
                    this.kineticLayer.draw();
                }
            }
        }
    }

    bindAllHexClicks(binder) {

        for (var prop in this.spacialData.centerPoints) {
                
            let cp = this.spacialData.centerPoints[prop];
            
            if (cp.hex instanceof this.Kinetic.RegularPolygon) {
                
                binder.call(this, cp);
                
                if (this.selectedHex !== '' && this.selectedHex.id === cp.id) {
                    
                    this.toggleSelectedHex(cp.id);
                }
            }
        }
    }

    bindOn = function(centerPoint) {
        this.bindHexClick(centerPoint.hex);
    }
    
    bindOff = function(hex) {
        hex.off("click");
    }

    bindHexClick(hex) {
        let that = this;

        hex.on('click', function(e) {

            let x = this.getAttr('x');
            let y = this.getAttr('y');
            let cp = that.spacialData.getCenterPointByXy(x,y);

            that.selectHex(cp);
        });
    }

    selectHex(cp){

        if (this.selectedHex !== '' && this.selectedHex.id === cp.id)
        {
            this.toggleSelectedHex(cp);
        }
        else
        {
            if (this.selectedHex !== '')
            {
                this.deselectHex(this.selectedHex);
                this.deselectAllHexes();
                this.toggleSelectedHex(cp);
            }
            else
            {
                this.toggleSelectedHex(cp);
            }
        }
    }

    toggleSelectedHex(cp) {

        if (cp.hex.getAttr('selected'))
        {
            cp.hex.setStroke("black");
            cp.hex.setStrokeWidth("1");
            cp.hex.setAttr('selected', false);
            this.selectedHex = '';
        }
        else
        {
            cp.hex.setStroke("blue");
            cp.hex.setStrokeWidth("3");
            cp.hex.setAttr('selected', true);
            this.selectedHex = cp;

            this.onHexSelect(cp)
        }

        this.kineticLayer.draw();
        cp.hex.draw();
    }
    
    deHighlightNeighbors(cp) {

        console.log(cp.adjCenters);

        for (var nid in cp.adjCenters) {
            let id = cp.adjCenters[nid];
            let neighbor = this.spacialData.centerPoints[id].hex;
            neighbor.setFill('green');
        }
    }

    deselectAllHexes() {

        this.spacialData.centerPoints.map(cp => this.deselectHex(cp));
    }

    deselectHex(cp) {

        cp.hex.setStroke("black");
        cp.hex.setStrokeWidth("1");
        cp.hex.setAttr('selected', false);
        cp.hex.setFill('green');
        this.deHighlightNeighbors(cp);
    };

    placeUnit(unit, cp) {
     
        this.spacialData.setOccupyingPiece(cp.id, unit);
        this.kineticLayer.add(unit.image);
        this.kineticLayer.draw();
    }

    
    onHexSelect(cp) {

        if (cp.occupyingPiece !== null) {

            let occupyingPiece = cp.occupyingPiece;
            
            // Show range of movements
            if (occupyingPiece.type === 'tank') {
                let inRange = [];
                this.spacialData.getNeighborsInRange(cp, 0, 3, inRange);

                inRange.map(x => x.hex.setFill('limegreen'));
            }
        }

        // direction
        let dirSector = 5;
        if (this.selectedHex.occupyingPiece.facingDir ==='right') { dirSector = 2 }

        this.drawLineOfSightInSector(cp, dirSector);
    }

    drawLineOfSightInSector(cp, sector) {

        // From selected hex
        // Calulate line of sight for first 60deg sectore, defined as the sector between the 0th 60 deg vector
        //    and the 1st 60 deg vector (i.e. runnign through vertexes 0 and 1)
        //
        // 1. Define the 0th vector line (y = mx + b)
        //      Slope (rise over run) is:
        //          opposite/adjacent = tan(theta)  ....therefore
        //          m = tan(theta)
        //          
        //      Then plug in a point and calculate y-intercept:
        //          cp.y = m(cp.x) + b
        //          so...
        //          b = cp.y - m(cp.x)
        //
        // 2. Define the 1st vector line (y = mx + b)
        // 3. Find all hexes who's center points fall between these 2 lines.
        //      Start with origin hex immediate neighbors and work outward
        //          If n.cp.y > f0(n.cp.x) && neighbor.cp.y < f1(n.cp.x) (where n.cp is the neighbor hex center point, and f0 and f1 are the 0th and 1st vector line functions, respectively)
        //              Then neighbor hex y IS candidate for line of sight
        //          If n.cp.x > origin.cp.x
        //              Then neighbor hex X IS candidate for line of sight
        //          If neighbor hex X AND Y are BOTH candidates for line of sight
        //              Then neighbor hex IS fully in line of sight
        // 4. Amongst all possible hexes in sector line of sight, find hexes that block line of sight
        //      For each blocker, calculate blocking sector and exclude those hexes that fall in the blocking sector.
        //          To determine the blocking sector, draw a line from origin center to blocker center
        //              Sweep radial to the left and right to find the edge points and slopes that define the blocking sector
        //                  Sweep left to find left-most point, each blocker-hex vertex to the left is a candidate
        //                      ...keep trying vertices until one is found for which all other vertices are to the right
        //                      Sweep right to find right-most point, each vertex to the right is a candidate
        //                      ...keep trying vertices until one is found for which all other vertices are to the left
        //
        // NOTE: Must use trig to flip the signs from positive to negative accordingly, based on which quadrant we are dealing with

        let vector1 = sector - 1;
        let vector2 = sector;

        let angleToVector1 = this.spacialData.getVertexAngle(cp.x, cp.y, vector1);
        let [arcEndX1, arcEndY1] = this.spacialData.getXyatArcEnd(cp.x, cp.y, 200, angleToVector1);
        let v0 = this.spacialData.getLineData(arcEndX1, arcEndY1, cp.x, cp.y);

        let angleToVector2 = this.spacialData.getVertexAngle(cp.x, cp.y, vector2);
        let [arcEndX2, arcEndY2] = this.spacialData.getXyatArcEnd(cp.x, cp.y, 200, angleToVector2);
        let v1 = this.spacialData.getLineData(arcEndX2, arcEndY2,cp.x, cp.y);

        // Draw line from f(cp.x) to f(xMax)

        // f(cp.x)
        let xTarget = cp.x + 300;
        if (angleToVector1 < -1 *  Math.PI/2 && angleToVector1 > -3 * Math.PI/2) {
            xTarget = cp.x - 300;
        }
        let [fOfX0, fOfMax0] = this.spacialData.calcLineYs(cp.x, xTarget, v0);

        let x2Target = cp.x + 300;
        if (angleToVector2 < -1 * Math.PI/2 && angleToVector2 > -3 * Math.PI/2) {
            x2Target = cp.x - 300;
        }
        let [fOfX1, fOfMax1] = this.spacialData.calcLineYs(cp.x, x2Target, v1);

        [xTarget, fOfMax0] = this.spacialData.adjustYForInfinity(v0['slope'], xTarget, fOfMax0, cp.x);

        [x2Target, fOfMax1] = this.spacialData.adjustYForInfinity(v1['slope'], x2Target, fOfMax1, cp.x);

        let yTarget = fOfMax0;
        let y2Target = fOfMax1;

        this.faceTrailingEdge.setPoints([cp.x, cp.y, xTarget, yTarget]);

        this.faceLeadingEdge.setPoints([cp.x, cp.y, x2Target, y2Target]);

        // let blocker = this.spacialData.centerPoints[44];
        let blocker = this.spacialData.centerPoints[110];
        blocker.hex.setStroke('red');
        blocker.hex.setFill('red');
        blocker.hex.setStrokeWidth(3);
        this.kineticLayer.draw();

        // Find centerline from selected centerPoint through blocker-centerPoint
        let centerLineFunc = this.spacialData.getLineData(blocker.x, blocker.y, cp.x, cp.y);
        let centerLineEndX = blocker.x + 150;
        if (blocker.x < cp.x) { centerLineEndX = blocker.x -150; }

        let centerLineEndY = this.spacialData.calcY(centerLineEndX, centerLineFunc);

        this.lineOfSightTargetter.target(blocker);

        this.lineOfSightTargetter.blockerCenterLine.setPoints([cp.x, cp.y, centerLineEndX, centerLineEndY]);

        let compareRight = (vertexY, fOfVertexX) => { return vertexY < fOfVertexX };
        let compareLeft = (vertexY, fOfVertexX) => { return vertexY > fOfVertexX };

        let findVertsToSideOfCenterLine = (blocker, centerLineFunc, compareFunc) => {

            // Get vertices where vert.y > f(vert.x)
            let setOfVerts = blocker.adjIntersections.filter(interId => {
    
                let theVert = this.spacialData.intersections[interId];
                // f(vert.x)
                let fOfVertX = this.spacialData.calcY(theVert.x, centerLineFunc);
    
                return compareFunc(theVert.y, fOfVertX);
            });

            return setOfVerts;
        }

        let rightOfTheLine = findVertsToSideOfCenterLine(blocker, centerLineFunc, compareRight);
        let leftOfTheLine = findVertsToSideOfCenterLine(blocker, centerLineFunc, compareLeft);

        rightOfTheLine.map(x => this.spacialData.intersections[x].vertex.show());
        leftOfTheLine.map(x => this.spacialData.intersections[x].vertex.show());

        let rightOfTheLineInts = rightOfTheLine.map(x => this.spacialData.intersections[x]);
        let leftOfTheLineInts = leftOfTheLine.map(x => this.spacialData.intersections[x]);

        let drawSideEdge = (sideVertexSet, edgeBlockerLine, sideVertColor, blockerVertOrthogLines) => {

            let orthogonals = sideVertexSet.map(inter => {
                return {
                    'formula': this.spacialData.getPerpendicular(inter.x, inter.y, centerLineFunc),
                    'intersection': inter
                };
            });
    
            orthogonals.map((vertForm, i) => {
    
                let [orthInterCentX, orthInterCentY] = this.spacialData.getIntersect(centerLineFunc, vertForm['formula']);
    
                let currentVert = vertForm['intersection'];
    
                let orthLine = blockerVertOrthogLines[currentVert.id];
                orthLine.setPoints([orthInterCentX, orthInterCentY, currentVert.x, currentVert.y]);
            });
    
            let longestOrth = orthogonals.reduce((a, b, index) => {
    
                let [interAx, interAy] = this.spacialData.getIntersect(centerLineFunc, a['formula']);
                let [interBx, interBy] = this.spacialData.getIntersect(centerLineFunc, b['formula']);
    
                let currentVertA = a['intersection'];
                let currentVertB = b['intersection'];
    
                let distA = this.spacialData.distance(interAx, interAy, currentVertA.x, currentVertA.y);
                let distB = this.spacialData.distance(interBx, interBy, currentVertB.x, currentVertB.y);
    
                let longest = a;
    
                if (distB > distA)
                    longest = b
    
                return longest;
            });
    
            let leftMostVertex = longestOrth['intersection'];
    
            leftMostVertex.vertex.setStroke(sideVertColor);
            leftMostVertex.vertex.setStrokeWidth('3');        
            leftMostVertex.vertex.moveToTop();
    
            let edgeFormula = this.spacialData.getLineData(leftMostVertex.x, leftMostVertex.y, cp.x, cp.y);

            // Let's project out to the edge of the game board
            let edgeEndX = this.spacialData.boardWidth;
            if (leftMostVertex.x < cp.x) { edgeEndX = 0 }

            let edgeEndY = this.spacialData.calcY(edgeEndX, edgeFormula);

            edgeBlockerLine.setPoints([cp.x, cp.y, edgeEndX, edgeEndY]);
            
            return edgeFormula;
        };

        let rightEdge = this.lineOfSightTargetter.rightEdgeBlocker;
        let leftEdge = this.lineOfSightTargetter.leftEdgeBlocker;

        let rightEdgeFormula = drawSideEdge(rightOfTheLineInts, rightEdge, rightEdge.getAttr('stroke'), this.lineOfSightTargetter.blockerVertOrthogLines);
        let leftEdgeFormula = drawSideEdge(leftOfTheLineInts, leftEdge, leftEdge.getAttr('stroke'), this.lineOfSightTargetter.blockerVertOrthogLines);

        this.spacialData.centerPoints.map(candidate => {

            let fOfRight = this.spacialData.calcY(candidate.x, rightEdgeFormula);
            let fOfLeft = this.spacialData.calcY(candidate.x, leftEdgeFormula);

            let distToCand = this.spacialData.distance(candidate.x, candidate.y, cp.x, cp.y);
            let distToBlocker = this.spacialData.distance(cp.x, cp.y, blocker.x, blocker.y);

            if (Math.abs(distToCand) > Math.abs(distToBlocker) && candidate.id !== cp.id) {

                if (fOfRight < candidate.y && fOfLeft > candidate.y) {
                    candidate.hex.setFill('black');
                }
            }
        });

        this.kineticLayer.draw();
    }
}

export default GameBoardController;