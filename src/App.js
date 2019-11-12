import React from 'react';
import logo from './logo.svg';
import './App.css';
import BoardBuilder from './BoardBuilder.js';
import IntersectBuilder from './IntersectionBuilder.js';
import Foundation from './Foundation.js';
import HexFactory from './HexFactory.js';
import SpacialData from './SpacialData.js';

// React Component lifecycle methods are only available with "Component" syntaac (not function syntax)
class App extends React.Component {

    constructor(props) {
      super(props);
      // I added Kinetic as a <script> in index.html and so it got added to the window scope.
      // Passing it in here
      this.state = {
        spacialData: new SpacialData(),
        hexFactory: null,
        foundation: null
      };
    }

    componentDidMount() {
      console.log("Component mounted!");
      let game_container = document.getElementById('gameBoardContainer');
      game_container.innerText = 'This is the text';
      game_container.style.display = 'block';
     
      // It seems Kinetic isn't fully ready in constructor of the App component,
      // so waiting until here to set the Stage and Layer
      this.state.hexFactory = new HexFactory(window.Kinetic);
      this.state.foundation = new Foundation(window.Kinetic);
      
      let intersectBuilder = new IntersectBuilder(this.state.hexFactory, this.state.spacialData, this.state.foundation.layer);
      let builder = new BoardBuilder(this.state.hexFactory, this.state.spacialData, intersectBuilder);

      builder.build(this.state.foundation.layer);
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
