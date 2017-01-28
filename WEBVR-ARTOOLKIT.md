# change all aframe-artoolkit.js into 2 threex
- make threex examples
  - started... not completed
- DONE reorga repo ala threex
- DONE file threex.artoolkitcontext.js threex.artoolkitmarker.js
- DONE make aframe-artoolkit to use that so same base
- DONE issue with parameters

- add baseUrl in aframe system


# TODO
- webvr-polyfill.js as a base
  - https://github.com/jeromeetienne/recording-webvr/blob/master/src/players/webvr-polyfill-generic.js
- create a framedataProvider based on the position of the arMarkers controls
  - it will contains a object3d
  - with a markercontrols on it, in mode cameraTransformMatrix
  - use .object3d.position and .quaternion for vrframedata.pose.position vrframedata.pose.quaternion
  - modelViewMatrix is inverse of transformMatrix
- demo simple: webvr with a vrcontrols looking to the center. with a cube in the middle
