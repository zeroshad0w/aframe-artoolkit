//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

AFRAME.registerSystem('artoolkitsystem', {
	schema: {
                debug : {
                        type: 'boolean',
                        default: false
                },
                sourceType : {
                        type: 'string',
                        default: 'video'                        
                },
                sourceUrl : {
                        type: 'string',
                }
	},
	init: function () {
                console.log('init system artoolkit')
                var _this = this
                this.srcElement = null
                this.arController = null;
                this.cameraParameters = null
		this._markerElements = []
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
console.log('AFRAME-ARTOOLKIT: _initSourceImage')
                var srcElement = document.createElement('img')
		document.body.appendChild(srcElement)
		srcElement.src = this.data.sourceUrl
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
console.log('AFRAME-ARTOOLKIT: _initSourceVideo')
		var srcElement = document.createElement('video');
		document.body.appendChild(srcElement)
		srcElement.src = this.data.sourceUrl
		srcElement.src = 'videos/output_4.mp4';
		// srcElement.src = 'videos/headtracking.mp4';
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
console.log('AFRAME-ARTOOLKIT: _initSourceWebcam')
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
                console.log('AFRAME-ARTOOLKIT: _onSourceReady width', width, 'height', height)
                _this.cameraParameters = new ARCameraParam('data/camera_para.dat', function() {
                
                        var arController = new ARController(width, height, _this.cameraParameters);
                        _this.arController = arController
                        
                        if( _this.data.debug === true ){
				arController.debugSetup();
				arController.canvas.style.position = 'absolute'
				arController.canvas.style.top = '0px'
				arController.canvas.style.opacity = '0.6'
			}

			var camera = _this.sceneEl.camera
                        console.log('camera is THREE.Object3D', camera)

                        var projectionMatrix = arController.getCameraMatrix();
                        camera.projectionMatrix.elements.set(projectionMatrix);

                        // TODO to remove later
			
			// arController.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);

                        // load kanji pattern
                        arController.loadMarker('data/patt.kanji', function(markerId) {
                                var markerWidth = 1
                                var markerTracker = arController.trackPatternMarkerId(markerId, markerWidth);
                        });
                        
                        // load hiro pattern
                        arController.loadMarker('data/patt.hiro', function(markerId) {
                                var markerWidth = 1
                                var markerTracker = arController.trackPatternMarkerId(markerId, markerWidth);
                        });
                        
                        onCompleted && onCompleted()
                
                })		
        },
        
        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        tick : function(now, delta){
                var arController = this.arController

                if (!arController) return;

		// mark all markers to invisible
		this._markerElements.forEach(function(markerElement){
			markerElement.el.object3D.visible = false
		})

		arController.process(this.srcElement)
	},
        tickProut : function(now, delta){
                var arController = this.arController

                if (!arController) return;
		// - use arController.process
		// - it handle all the marker type

		arController.detectMarker(this.srcElement);

                if( this.data.debug === true )	arController.debugDraw();

		// mark all markers to invisible
		this._markerElements.forEach(function(markerElement){
			markerElement.el.object3D.visible = false
		})

		// update markerRoot with the found markers
		var nMarkersFound = arController.getMarkerNum();
                // console.log('nMarkersFound', nMarkersFound)

		if( nMarkersFound === 0 )	return

		// var i = 0
		for( var markerIndex = 0; markerIndex < nMarkersFound; markerIndex++){
			var markerInfo = arController.getMarker(markerIndex)
			// console.dir(markerInfo)
			// console.log('markerInfo.id', markerInfo.id)
			
			var markerElement = this._markerElements.find(function(markerElement){
				if( markerElement.data.type === 'any' )	return true
				return markerElement.markerId === markerInfo.id ? true : false
			})
			if( markerElement === undefined )	continue
			// console.log(markerElement)
			// var markerElement = this._markerElements[0]
			var markerRoot = markerElement.el.object3D
			// console.log(markerRoot)

			// debugger
			// if( markerRoot.visible === false ) {
				arController.getTransMatSquare(markerIndex /* Marker index */, 1 /* Marker width */, markerRoot.userData.markerMatrix);
			// } else {
				// arController.getTransMatSquareCont(markerIndex, 1, markerRoot.userData.markerMatrix, markerRoot.userData.markerMatrix);
			// }
			arController.transMatToGLMat(markerRoot.userData.markerMatrix, markerRoot.matrix.elements);
			markerRoot.visible = true			
console.log('getMarker', Date.now(), markerRoot.matrix)
		}
        },

	////////////////////////////////////////////////////////////////////////////////
	//          Code Separator
	////////////////////////////////////////////////////////////////////////////////
	addMarker : function(markerElement){
		console.log('add marker for', markerElement)	
		this._markerElements.push(markerElement)	
	},
	removeMarker : function(markerElement){
		console.log('remove marker for', markerElement)
		var index = this.markerElements.indexOf(markerElement);
		console.assert(index !== index )
		this._markerElements.splice(index, 1)
	}

});

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
AFRAME.registerComponent('artoolkitmarker', {
        dependencies: ['artoolkitsystem'],
	schema: {
		size: {
			type: 'number',
			value: 1
		},
		type: {
			type: 'string',
			default: 'any'
		}
	},
	init: function () {
		var _this = this
                // debugger;
                var artoolkitsystem = this.el.components.artoolkitsystem
                // if( artoolkitsystem === undefined ) return

                // create the marker Root
        	var markerRoot = this.el.object3D;
        	markerRoot.name = 'Marker Root'
        	markerRoot.userData.markerMatrix = new Float64Array(12);
        	markerRoot.matrixAutoUpdate = false;
        	markerRoot.visible = true

		var artoolkitsystem = this.el.sceneEl.systems.artoolkitsystem
		artoolkitsystem.addMarker(this)
		
		if( this.data.type === 'kanji' ){
			this.markerId = 0
		}else if( this.data.type === 'hiro' ){
			this.markerId = 1
		}else if( this.data.type === 'any' ){
			this.markerId = -1
		}else{
			console.assert(false)
		}
		
		var delayedInitTimerId = setInterval(function(){
			// check the init is done
			var artoolkitsystem = _this.el.sceneEl.systems.artoolkitsystem
			var arController = artoolkitsystem.arController
			// 
			if( arController === null )	return
			// stop looping
			clearInterval(delayedInitTimerId)
			delayedInitTimerId = null

			// console.log('arController', arController)
			// debugger;
			arController.addEventListener('getMarker', function(event){
				var data = event.data
				if( data.type === artoolkit.BARCODE_MARKER ){
					console.log('barcode marker', data.marker)
				}else if( data.type === artoolkit.PATTERN_MARKER ){
					console.log('pattern marker', data.marker)
				}else{
					console.log('marker type', data.type)
				}
				// is it for me ?
				// console.log('getMarker', data.matrix)
				// console.log('getMarker', Date.now(), data.matrix)
				markerRoot.matrix.fromArray(data.matrix)
				markerRoot.visible = true
			})
		}, 1000/10)
	},
	remove : function(){
		var artoolkitsystem = this.el.components.artoolkitsystem
		artoolkitsystem.removeMarker(this)
	},
	tick : function(now, delta){
	},
	update: function () {
        	var markerRoot = this.el.object3D;
        	markerRoot.userData.size = this.data.size;
	},
});
