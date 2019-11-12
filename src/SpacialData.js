import CenterPoint from './CenterPoint.js';
import Intersection from './Intersection.js';
import IdGenerator from './IdGenerator.js';

class SpacialData {

    constructor () {
        this.centerPoints = [];
        this.intersections = [];
        this.idGen = new IdGenerator();
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

    distance(fromX, fromY, toX, toY) {
        
        var aSqr = Math.pow(fromX - toX, 2);
        var bSqr = Math.pow(fromY - toY, 2);
    
        var c = Math.sqrt(aSqr + bSqr);
    
        return c;
    }

    getIntersectionByXy(x,y) {

        // Find any colliding vertices
        var collisions = this.intersections.filter(inter => this.isCollision(inter.x, inter.y, x, y));

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
}

export default SpacialData;