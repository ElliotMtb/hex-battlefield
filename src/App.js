import React from 'react';
import logo from './logo.svg';
import './App.css';
import BoardBuilder from './BoardBuilder.js';
import IntersectBuilder from './IntersectionBuilder.js';
import Foundation from './Foundation.js';
import PiecesFactory from './PiecesFactory.js';
import HexFactory from './HexFactory.js';
import SpacialData from './SpacialData.js';
import GameBoardController from './GameBoardController';

// React Component lifecycle methods are only available with "Component" syntaac (not function syntax)
class App extends React.Component {

    constructor(props) {
      super(props);
      // I added Kinetic as a <script> in index.html and so it got added to the window scope.
      // Passing it in here
      this.state = {
        spacialData: new SpacialData(),
        hexFactory: null,
        piecesFactory: null,
        foundation: null
      };
    }

    componentDidMount() {
      console.log("Component mounted!");
      let game_container = document.getElementById('gameBoardContainer');
      game_container.innerText = 'This is the text';
      game_container.style.display = 'block';
     
      let img = new Image();
      img.src = './sherman.png';

      // Quirk of KineticJS is that you have to make sure the images are
      // loaded before they can be drawn. So, I wait for the onload evant
      // to do anything. I'd love to figure out a better way to preload the images.
      img.onload = () =>
      {
        console.log('Tank image loaded!');
        // It seems Kinetic isn't fully ready in constructor of the App component,
        // so waiting until here to set the Stage and Layer
        this.state.hexFactory = new HexFactory(window.Kinetic, img);
        this.state.piecesFactory = new PiecesFactory(this.state.hexFactory);
        this.state.foundation = new Foundation(window.Kinetic);
        
        let intersectBuilder = new IntersectBuilder(this.state.hexFactory, this.state.spacialData, this.state.foundation.layer);
        let builder = new BoardBuilder(this.state.hexFactory, this.state.spacialData, intersectBuilder);

        builder.buildTabular(
          this.state.foundation.layer,
          {
            rowCount: 10,
            colCount: 10,
            initialX: 75,
            initialY: 75
          }
        );
        
        let controller = new GameBoardController(this.state.spacialData, this.state.foundation.layer, window.Kinetic);
        controller.bindEmAll();

        // Game setup begins
        let targetHex = this.state.spacialData.centerPoints[12];
        let player1Tank = this.state.piecesFactory.getTank(1, targetHex.x, targetHex.y);
        controller.placeUnit(player1Tank, targetHex);
      };
    }

    render() {
      return (
        <div className="App">
          <div style={{width: '550px', display: 'none'}} id="gameBoardContainer" height="1200" width="1400">
          </div>
        </div>
      );
    }
}

export default App;
