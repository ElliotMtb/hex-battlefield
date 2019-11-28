
class HexFactory {

    constructor (kinetic, img) {
      this.Kinetic = kinetic;
      this.hexRadius = 55;
      this.tank_image = img;
    }

    getTank (x, y) {

      let scale = this.hexRadius/120;
      
      let rect = new this.Kinetic.Rect({
        x: x - 50*scale,
        y: y - 50*scale,
        width: 110*scale,
        height: 75*scale,
        fillPatternOffset: [0, 0],
        strokeWidth: 0,
        opacity: 0.75,
        listening: false
      });
      
      rect.setFillPatternImage(this.tank_image);

      rect.setFillPatternScale(.5 * scale);

      rect.rotateDeg(15);
      
      return rect;
    }

    getNewHex (x, y, color) {

        let poly = new this.Kinetic.RegularPolygon({
          x: x,
          y: y,
          sides: 6,
          radius: this.hexRadius,
          fill: color,
          fillPatternOffset: [-78, 70],
          hexType: 'grass',
          hexNumber: 0,
          stroke: 'black',
          strokeWidth: 1,
          opacity: 0.75,
          id: 0
        });

        return poly;
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