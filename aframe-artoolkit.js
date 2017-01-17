//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

AFRAME.registerComponent('artoolkit', {
	schema: {
                debug : {
                        type: 'boolean',
                        default: true
                },
                sourceType : {
                        type: 'string',
                        default: 'webcam'                        
                }
	},
	init: function () {
                console.log('init system artoolkit')
                var _this = this
                this.srcElement = null
                this.arController = null;
                this.cameraParameters = null
                
                this._initSource(function onReady(width, height){
                        console.log('ready')
                        _this._onSourceReady(width, height, function onCompleted(){
                                console.log('completed')
                        })
                })
	},
        
        
        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        
        
        _initSource: function(onReady){
                if( this.data.sourceType === 'image' ){
                        var srcElement = this._initSourceImage(function(){
                                onReady(srcElement.width, srcElement.height)
                        })                        
                }else if( this.data.sourceType === 'video' ){
                        var srcElement = this._initSourceVideo(function(){
                                onReady(srcElement.width, srcElement.height)
                        })                        
                }else if( this.data.sourceType === 'webcam' ){
                        var srcElement = this._initSourceWebcam(function(){
                                onReady(srcElement.videoWidth, srcElement.videoHeight)
                        })                        
                }else{
                        console.assert(false)
                }
                this.srcElement = srcElement
                this.srcElement.style.position = 'absolute'
                this.srcElement.style.top = '0px'
                this.srcElement.style.zIndex = '-1'
        },
        _initSourceImage: function(onReady){
                var srcElement = document.createElement('img')
		document.body.appendChild(srcElement)
		srcElement.src = './images/armchair.jpg'
		// srcElement.src = './images/chalk.jpg'
		// srcElement.src = './images/chalk_multi.jpg'
		// srcElement.src = './images/kuva.jpg'
		// srcElement.src = './images/img.jpg'
		srcElement.width = 640
		srcElement.height = 480

		setTimeout(function(){
			onReady && onReady()
		}, 0)
		return srcElement                
        },
        _initSourceVideo: function(onReady){
		var srcElement = document.createElement('video');
		document.body.appendChild(srcElement)
		// srcElement.src = 'videos/output_4.mp4';
		srcElement.src = 'videos/headtracking.mp4';
		srcElement.autoplay = true;
		srcElement.webkitPlaysinline = true;
		srcElement.controls = false;
		srcElement.loop = true;
		srcElement.width = 640;
		srcElement.height = 480;
		setTimeout(function(){
			onReady && onReady()
		}, 0)
		return srcElement
	},
        _initSourceWebcam: function(onReady){
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

		var srcElement = document.createElement('video');
		document.body.appendChild(srcElement);

		if (navigator.getUserMedia == false )	console.log("navigator.getUserMedia not present in your browser");

	        // get the media sources
	        MediaStreamTrack.getSources(function(sourceInfos) {
	                // define getUserMedia() constraints
	                var constraints = {
				audio: false,
				video: {
					mandatory: {
						maxWidth: 640,
						maxHeight: 480
			    		}
			  	}
	                }

	                // it it finds the videoSource 'environment', modify constraints.video
	                for (var i = 0; i != sourceInfos.length; ++i) {
	                        var sourceInfo = sourceInfos[i];
	                        if(sourceInfo.kind == "video" && sourceInfo.facing == "environment") {
	                                constraints.video.optional = [{sourceId: sourceInfo.id}]
	                        }
	                }
			navigator.getUserMedia(constraints, function success(stream) {
				console.log('success', stream);
				srcElement.src = window.URL.createObjectURL(stream);
				// to start the video, when it is possible to start it only on userevent. like in android
				document.body.addEventListener('click', function(){
					srcElement.play();
				})
				srcElement.play();
			
				// wait until the video stream is ready
				var interval = setInterval(function() {
					if (!srcElement.videoWidth)	return;
					onReady()
					clearInterval(interval)
				}, 1000/100);
			}, function(error) {
				console.log("Can't access user media", error);
				alert("Can't access user media :()");
			});
		})

		return srcElement
	},
        
        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        
        _onSourceReady: function(width, height, onCompleted){
                var _this = this
                console.log(arguments)
                _this.cameraParameters = new ARCameraParam('data/camera_para.dat', function() {
                
                        var arController = new ARController(width, height, _this.cameraParameters);
                        _this.arController = arController
                        
                        if( _this.data.debug === true )	arController.debugSetup();

                        // TODO fix this!!!
                        var cameraElement = document.querySelector('a-entity[camera]');
                        var camera = cameraElement.object3D.children[0]
                        console.log('camera is THREE.Object3D', camera)
                                                

                        var projectionMatrix = arController.getCameraMatrix();
                        camera.projectionMatrix.elements.set(projectionMatrix);

                        // TODO to remove later
                        
                        // load kanji pattern
                        arController.loadMarker('Data/patt.kanji', function(markerId) {
                                var markerWidth = 1
                                var markerTracker = arController.trackPatternMarkerId(markerId, markerWidth);
                        });
                        
                        // load hiro pattern
                        arController.loadMarker('Data/patt.hiro', function(markerId) {
                                var markerWidth = 1
                                var markerTracker = arController.trackPatternMarkerId(markerId, markerWidth);
                        });
                        
                        onCompleted && onCompleted()
                
                })		
        },
        
        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        
        
        
        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        
        tick : function(now, delta){
                var arController = this.arController

                if (!arController) return;

		arController.detectMarker(this.srcElement);

                if( this.data.debug === true )	arController.debugDraw();

                var markerRoot = document.querySelector('[artoolkitmarker]').object3D
// debugger

		// update markerRoot with the found markers
		var markerNum = arController.getMarkerNum();
                // console.log('markerNum', markerNum)
                // return
		if (markerNum > 0) {
			// if( markerRoot.visible === false ) {
				arController.getTransMatSquare(0 /* Marker index */, 1 /* Marker width */, markerRoot.userData.markerMatrix);
			// } else {
				// arController.getTransMatSquareCont(0, 1, markerRoot.userData.markerMatrix, markerRoot.userData.markerMatrix);
			// }
			arController.transMatToGLMat(markerRoot.userData.markerMatrix, markerRoot.matrix.elements);
		}
                
		// objects visible IIF there is a marker
		if (markerNum > 0) {
			markerRoot.visible = true;
		} else {
			markerRoot.visible = false;
		}
        }

});

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
AFRAME.registerComponent('artoolkitmarker', {
        dependencies: ['artoolkit'],
	schema: {
		type: 'string',
		default : 'yes',
	},
	init: function () {
                // debugger;
                var artoolkit = this.el.components.artoolkit
                if( artoolkit === undefined ) return

                // create the marker Root
                // debugger
        	var markerRoot = this.el.object3D;
        	markerRoot.name = 'Marker Root'
        	markerRoot.userData.markerMatrix = new Float64Array(12);
        	markerRoot.matrixAutoUpdate = false;
        	markerRoot.visible = false

                console.log('artoolkit', artoolkit)

                // console.dir(this)
                // var artoolkitComponents = this.el.sceneEl.components.artoolkit
                
                // debugger;
                // this.
	},
	tick : function(now, delta){
	},
	update: function () {
	},
});
