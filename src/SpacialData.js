import CenterPoint from './CenterPoint.js';
import Intersection from './Intersection.js';
import IdGenerator from './IdGenerator.js';

class SpacialData {

    constructor (boardWidth, boardHeight) {
        this.centerPoints = [];
        this.intersections = [];
        this.idGen = new IdGenerator();
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
    }

    setOccupyingPiece(centerPointId, piece) {
        let cp = this.centerPoints[centerPointId];
        cp.occupyingPiece = piece;
    }
    
    addCenterPoint(kineticHex) {

        let cp = new CenterPoint(this.idGen.nextCenterPointId());
        cp.uiElem = kineticHex;

        this.centerPoints.push(cp);

        return cp;
    }

    addIntersection(kineticVertex) {
        
        let intersect = new Intersection(this.idGen.nextIntersectionId());
        intersect.uiElem = kineticVertex;

        this.intersections.push(intersect);

        return intersect;
    }

    /*
    Determine if 2 coordinate pairs can be considered equivalent i.e. "collide".

    Note: It's very important to account for precision differences such as:
        X value 449.99999999999994 must be considered equivalent to 450
        ...therefore I have chosen a more than generous collision margin of 2
    */
    isCollision(testX, testY, x, y) {

        if (this.distance(testX, testY, x, y) < 2)
        {
            return true;
        }

        return false;
    }

    getXyatArcEnd = function(c1,c2,radius,angle) {
        let x = c1+Math.cos(angle)*radius;
        let y = c2+Math.sin(angle)*radius;
        return [x,y];
    };

    distance(fromX, fromY, toX, toY) {
        
        var aSqr = Math.pow(fromX - toX, 2);
        var bSqr = Math.pow(fromY - toY, 2);
    
        var c = Math.sqrt(aSqr + bSqr);
    
        return c;
    }

    lookupByXy(x, y, lookupList) {

        // Find any colliding vertices
        var collisions = lookupList.filter(point => this.isCollision(point.x, point.y, x, y));

        if (collisions.length > 1) {
            throw "ERROR: Single point should never collide with more than 1 vertex.";
        }
        
        // Return the index of the first vertex collision
        // findIndex returns -1 if not found
        // TODO: Perhaps should use a VertexProxy
        if (collisions.length === 0) {
            return null;
        }
        else {
            return collisions[0];
        }
    }

    getCenterPointByXy(x, y) {
        return this.lookupByXy(x, y, this.centerPoints);
    }

    getIntersectionByXy(x, y) {
        return this.lookupByXy(x, y, this.intersections);
    }

    getNeighborsInRange(cp, depthCounter, endDepth, neighborsInRange) {
        
        if (depthCounter === endDepth) {
            return;
        }
        
        for (var nid in cp.adjCenters) {
            let id = cp.adjCenters[nid];
            let neighbor = this.centerPoints[id];
            
            if (neighborsInRange.indexOf(id) === -1) {
                neighborsInRange.push(neighbor);
            }

            this.getNeighborsInRange(neighbor, depthCounter + 1, endDepth, neighborsInRange);
        }
    }

    /*
        Return hexes that are in line of sight
    */
    getLineOfSight(centerPoint, sector) {
        
    }

    getVertexAngle(centerX, centerY, radialIndex) {

        // -60 degree increment (negative is for counter-clockwise direction)
        var angleIncrement = -2 * Math.PI / 6;
        
        // -30 degree offset (negative is for counter-clockwise direction)
        var angleOffset = -2 * Math.PI / 12;

        var angleToVertex = radialIndex * angleIncrement - angleOffset;

        return angleToVertex;
    }

    adjustYForInfinity(slope, x, y, defaultX) {

        let adjustedY = y;
        let adjustedX = x;

        if (slope === Number.NEGATIVE_INFINITY) {
            adjustedY = 0;
            adjustedX = defaultX;
        }
        else if (slope === Number.POSITIVE_INFINITY) {
            adjustedY = this.boardHeight;
            adjustedX = defaultX;
        }

        return [adjustedX, adjustedY];
    }

    getLineData(angleToVector, originX, originY) {
        
        let formula = {};

        // If angle = 90deg or 270, slope will be huge (near infinite)
        //let slope = Math.tan(angleToVertex);

        let [arcEndX, arcEndY] = this.getXyatArcEnd(originX, originY, 200, angleToVector);

        // Rounding to 10 places behind the decimal (to more easily cause Infinity/-Infinity via divided by zero)
        let arcEndXRound = Math.round(arcEndX * 10000000000)/10000000000;
        let originXRound = Math.round(originX * 10000000000)/10000000000;

        let slope = (arcEndY - originY) / (arcEndXRound - originXRound);

        formula['yInter'] = originY - slope * originX;
        formula['slope'] = slope;

        return formula;
    }

    calcY(x, lineCofficients) {
        return lineCofficients['slope'] * x + lineCofficients['yInter'];
    }

    calcLineYs(x1, x2, coefficients) {
        return [this.calcY(x1, coefficients), this.calcY(x2, coefficients)];
    }
}

export default SpacialData;