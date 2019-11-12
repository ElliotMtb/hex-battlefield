class HexFactory {

    constructor (kinetic) {
      this.Kinetic = kinetic;
      this.hexRadius = 45;
    }

    getNewHex (x, y, color) {

        return new this.Kinetic.RegularPolygon({
          x: x,
          y: y,
          sides: 6,
          radius: this.hexRadius,
          fill: color,
          //fillPatternImage: hexInfo.image,
          fillPatternOffset: [-78, 70],
          hexType: 'grass',
          hexNumber: 0,
          stroke: 'black',
          strokeWidth: 1,
          opacity: 0.75,
          id: 0
        });
    }

    getNewVertex (x, y) {
      
        return new this.Kinetic.Circle({
            x: x,
            y: y,
            radius: 10,
            fill: 'grey',
            stroke: 'black',
            strokeWidth: 1,
            opacity: 0.75,
            id: 0
        });
    }
}

export default HexFactory;