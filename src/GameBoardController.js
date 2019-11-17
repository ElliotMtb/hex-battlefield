class GameBoardController {

    constructor(spacialData, kineticLayer, Kinetic) {
        this.spacialData = spacialData;
        this.kineticLayer = kineticLayer;
        this.selectedHex = '';
        this.Kinetic = Kinetic;
    }

    bindEmAll() {
        this.bindAllHexClicks(this.bindOn);
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

           this.highlightNeighbors(cp);
        }

        this.kineticLayer.draw();
        cp.hex.draw();
    }

    highlightNeighbors(cp) {

        console.log(cp.adjCenters);

        for (var nid in cp.adjCenters) {
            let id = cp.adjCenters[nid];
            let neighbor = this.spacialData.centerPoints[id].hex;
            neighbor.setFill('limegreen');
        }
    }

    deHighlightNeighbors(cp) {

        console.log(cp.adjCenters);

        for (var nid in cp.adjCenters) {
            let id = cp.adjCenters[nid];
            let neighbor = this.spacialData.centerPoints[id].hex;
            neighbor.setFill('green');
        }
    }

    deselectHex(cp) {

        cp.hex.setStroke("black");
        cp.hex.setStrokeWidth("1");
        cp.hex.setAttr('selected', false);

        this.deHighlightNeighbors(cp);
    };
}

export default GameBoardController;