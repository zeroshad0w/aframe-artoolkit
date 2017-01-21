- make good examples
  - some WOW examples
  - some exposing all the feature of the libray
    - various source: examples images/videos/webcam
    - include various possible content: moving cube, minecraft
    - various markers kanji/hiro/barcode
    - allow to change the options with UI
    - use usual context in url stuff
- check this.data are correct. with data parse stuff
  
- expose camera params url
  artoolkit='cameraParamsUrl: data/camera_para.dat'
- fix the no aspect update - ask fill
- import hatsune miku/minecraft
- interaction with the inspector ?
- <a-marker type='pattern' url='data/patt.kanji'> if no type defined, but url is ? then default to pattern
- <a-marker type='barcode' value=20'> if no type defined, but value is ? then default to barcode

- DONE rename artoolkitsystem into artoolkit
- DONE fix the video as source... it doesnt work for whatever reason
  - important to debug
  - the object isnt displayed the same way or the camera isnt
  - works if i delay the onReady! how come ?
- DONE fix the source initialisation
  - work if set by default, but not if explicitly given in html
  - double init ?
  - why it doesnt work in the video
