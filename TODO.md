- init artoolkit source and load camera parameters in // in systems.init
  - fix the no aspect update - ask fill
- import hatsune miku
- import md2 character
- interaction with the inspector ?
- if i move the camera based on the marker, and not the marker in space
  - suddently it is possible to have kinda webvr, compatible with more scenes
  - it become just a small code to paste on your scene
  - it cant support multiple distinct marker
  - <a-marker-controls>
        <a-entity camera></a-entity>
    </a-marker-controls>

- DONE check this.data are correct. with schema parse stuff
- DONE in examples/aframe-artoolkit.html add the debug/detectionMode/matrixCodeType system
- DONE expose camera params url
  artoolkit='cameraParamsUrl: data/camera_para.dat'
- DONE rename artoolkitsystem into artoolkit
- DONE fix the video as source... it doesnt work for whatever reason
  - important to debug
  - the object isnt displayed the same way or the camera isnt
  - works if i delay the onReady! how come ?
- DONE fix the source initialisation
  - work if set by default, but not if explicitly given in html
  - double init ?
  - why it doesnt work in the video
