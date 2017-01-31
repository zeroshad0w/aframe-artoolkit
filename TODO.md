# Fix resolution issue
- able to set whatever resolution at start
- video aspect ratio should be the same as the 3d canvas one
- relation between video resolution and cpu performance
- first it would be good to centralize this data
  - easier to modify
  - easier to keep track

# Performance
- a 320x240 video is doing 30fps on nexus6p, without webassembly and webworker
- does the webworker version 

# TODO
- webvr-polyfill support present with stereo and good projectionMatrix
  - so the video source should be in 3d
  - isnt that silly to support that and not the resize ?
- add baseUrl in aframe system
- interaction with aframe inspector ?
  - use .update more cleverly
- init artoolkit source and load camera parameters in // in systems.init
- split in 3 repositories
  - three.artoolkit controls
  - aframe-artoolkit
  - artoolkit-webvr-polyfill
- fix the no aspect update - ask phill
- make it aframe-artoolkit in codepen
  - issue with cors
  - aframe/examples/noinstall.html
  - https://codepen.io/jeromeetienne/pen/mRqqzb?editors=1000#0
  
- import hatsune miku
  - works only on aframe.master
  - copy hatsune files on repo
- import md2 character
  - there is a threex md2character already
  - update it with other characters and new three.js
