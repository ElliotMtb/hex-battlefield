This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Overview
React is used to store the gameboard data and logic
KineticJS is used to draw the gameboard.

This is a work in progress...it's not a complete game yet, but many of the mechanics necessary to build out the game are in place.

The gameboard can be dynamically drawn at different sizes (varying number of rows and columns of hexes), and the relative/spacial information is automatically generated and stored at each vertex and at each hex center-point. These adjacency matrices allow for path finding elements etc. Each hexagon can have attributes applied to it.

The math and logic is in place to be able calculate spaces that are blocked from line of site for 1 game piece facing in either the up direction, with respect to a fixed line-of-site blocking hexagon (as depicted in the preview below):

<img src="https://user-images.githubusercontent.com/2363880/122866368-0e0cdd80-d2e5-11eb-81e5-3b302e2a58b9.gif" height="400" />
