class LineOfSightTargetter {

    constructor(Kinetic, kineticLayer, kineticFactory) {

        this.Kinetic = Kinetic;
        this.kineticLayer = kineticLayer;
        this.kineticFactory = kineticFactory;
        
        this.leftEdgeBlocker = kineticFactory.leftEdgeBlocker;
        this.rightEdgeBlocker = kineticFactory.rightEdgeBlocker;
        this.blockerCenterLine = kineticFactory.blockerCenterLine;
        
        this.orthogLines = Array(6).fill().map(x => kineticFactory.initBlockerLine('yellow'));
        
        // Usable once target(..) is called
        this.blockerCenterPoint = null;
        this.blockerVertOrthogLines = {};
    }
    
    target(centerPoint) {

        this.blockerCenterPoint = centerPoint;
        centerPoint.adjIntersections.sort();
        centerPoint.adjIntersections.map((id, index) => this.blockerVertOrthogLines[id] = this.orthogLines[index]);
    }

    leftEdgeBlocker() { return this.leftEdgeBlocker }
    rightEdgeBlocker() { return this.rightEdgeBlocker }
    blockerCenterLine() { return this.blockerVertOrthogLines }
}

export default LineOfSightTargetter;