class Foundation {

    constructor (Kinetic) {

        this.stage = new Kinetic.Stage({
            container: 'gameBoardContainer',
            width: 1200,
            height: 750
          });

        this.layer = new Kinetic.Layer();

        this.stage.add(this.layer);
    }
}

export default Foundation;