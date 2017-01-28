# TODO
- webvr-polyfill.js as a base
  - https://github.com/jeromeetienne/recording-webvr/blob/master/src/players/webvr-polyfill-generic.js
- create a framedataProvider based on the position of the arMarkers controls
  - it will contains a object3d
  - with a markercontrols on it, in mode cameraTransformMatrix
  - use .object3d.position and .quaternion for vrframedata.pose.position vrframedata.pose.quaternion
  - modelViewMatrix is inverse of transformMatrix
- demo simple: webvr with a vrcontrols looking to the center. with a cube in the middle
  - test it with the webvr extension
- then remove the extension, add your polyfill
- make it work


# change all aframe-artoolkit.js into 2 threex
- make threex examples
  - started... not completed
- DONE THREEx.ArMarkerControls is a controls. put controls in th ename

- put 

- add baseUrl in aframe system






# TODO

- make it run in codepen
  - issue with cors
  - aframe/examples/noinstall.html
  - https://codepen.io/jeromeetienne/pen/mRqqzb?editors=1000#0
  
- import hatsune miku
  - copy hatsune files on repo
- import md2 character
  - there is a threex md2character already
  - update it with other characters and new three.js
- interaction with the inspector ?
  - use .update more cleverly

- init artoolkit source and load camera parameters in // in systems.init
- fix the no aspect update - ask phill
