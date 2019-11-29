class GameBoardController {

    constructor(spacialData, kineticLayer, Kinetic) {
        this.spacialData = spacialData;
        this.kineticLayer = kineticLayer;
        this.selectedHex = '';
        this.Kinetic = Kinetic;
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
    }
}

export default GameBoardController;