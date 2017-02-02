# TODO merge this one into master
- make the size in the normal options
- port to all examples
- merge to master


# How to keep source image aspect
- can we change the videoAspectRatio dynamically ?
- there is 3 ratio: videoAspectRatio, artoolkitAspectRatio, screenAspectRatio
- screenAspectRatio should be equal to artoolkitAspectRatio
  - this doesnt imply to have the same resolution
  - so technically i could definitly extract a part of video which has screenAspectRatio
  - well find the algo lazy mother fucker

- Xmin, Ymin, Xmax, Ymax
- coordinates are in video canvas 



# Fix resolution issue
- issue: aspect is not visually respected
- issue: not dynamic, handle window resize

- LATER relation with stereo display ?
- LATER to have the video in webgl ? or in DOM ? should i care now ?


- DONE issue: the screen resolution and the image resolution should NOT be the same
  - displayWidth/displayHeight to have the resolution
  - imageWidth/Height are faster when smaller
- DONE the size is set in the renderer and then propagated
- DONE able to set whatever resolution at start
- DONE video aspect ratio should be the same as the 3d canvas one

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
