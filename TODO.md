- finish the resize
  - push it all in context on a onResize
  - make the renderer copy the canvas css, after the onResize
  - remove the 640x480 of aframe demo

- how to detect if there is a new image in source video
  - it isnt that simple


- add the webworkers with this release ?
- add the nft ?
- how to handle the performance loss 


# How to do motion prediction
- when no new image to detect new pose, do a motion prediction
- do a threex.motionpredictioncontrols
  - do that in /threex.motionpredictioncontrols.js
  - /examples/motionpredictioncontrols.html
  - move targetObject to the left 10 per seconds
  - display the controls.object which should move smoothly at 60fps
- this is a controls with 2 objects, both have the same parent
- controls.update() periodically, move the object toward the target
  - console.assert(this.object.parent === this.targetObject.parent)
  - at the begining do simply a copy of this.object/.targetObject
- .setPosition


# Idea about performance
- more than 70% of the time is used to copy the image in the HEAP
  - .drawImage, .getImageData
  - this.dataHeap.set( data ) is 43% of the total
  - if i can send just a pointer on the data... i gain 43% in one shot
- ctx.imageSmoothingEnabled = false - what is the influence on performance and result ?
- performance remove copy to heap
  - http://kapadia.github.io/emscripten/2013/09/13/emscripten-pointers-and-pointers.html
  - this explains how to pass a pointer from a typearray to c++ 
  - this would avoid the dataHeap.set() - 43%
  
# Fix resolution issue
- issue: aspect is not visually respected
- issue: not dynamic, handle window resize

- LATER relation with stereo display ?
- LATER to have the video in webgl ? or in DOM ? should i care now ?
- LATER support .setThresholdMode(), put it in demo to test
- LATER support .setLabelingMode()


- DONE simply set the maxDetectionRate, in artoolkit context
  - and set this value to the video fps
  - if we want to reduce cpu usage, we can set maxDetectionRate below sourceVideo fps
- how to get the sourceVideo fps
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
