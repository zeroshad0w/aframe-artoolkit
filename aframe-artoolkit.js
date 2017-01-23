

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

AFRAME.registerSystem('artoolkit', {
	schema: {
                debug : {
                        type: 'boolean',
                        default: false
                },
                sourceType : {
                        type: 'string',
                        default: 'webcam',        
			parse: function (value) {
				var possibleValues = ['webcam', 'image', 'video' ]
				console.assert(possibleValues.indexOf(value) !== -1, 'illegal value', value)
				return value
			}               
                },
                sourceUrl : {
                        type: 'string',
                },
		detectionMode : {
			type: 'string',
			default: 'color_and_matrix',
			parse: function (value) {	// check if the value is valid
				var possibleValues = ['color', 'color_and_matrix', 'mono', 'mono_and_matrix' ]
				console.assert(possibleValues.indexOf(value) !== -1, 'illegal value', value)
				return value
			}               
		},
		matrixCodeType : {
			type: 'string',
			default: '3x3',
			parse: function (value) {	// check if the value is valid
				var possibleValues = ['3x3', '3x3_HAMMING63', '3x3_PARITY65', '4x4', '4x4_BCH_13_9_3', '4x4_BCH_13_5_5' ]
				console.assert(possibleValues.indexOf(value) !== -1, 'illegal value', value)
				return value
			}               
		},
		cameraParametersUrl : {
			type: 'string',
			default: 'data/camera_para.dat'
		},
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
                this.srcElement.style.zIndex = '-2'
        },
        _initSourceImage: function(onReady){
                var srcElement = document.createElement('img')
		document.body.appendChild(srcElement)
		srcElement.src = this.data.sourceUrl

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
		srcElement.src = this.data.sourceUrl

		srcElement.autoplay = true;
		srcElement.webkitPlaysinline = true;
		srcElement.controls = false;
		srcElement.loop = true;

		srcElement.width = 640;
		srcElement.height = 480;
		
		// wait until the video stream is ready
		var interval = setInterval(function() {
			if (!srcElement.videoWidth)	return;
			onReady()
			clearInterval(interval)
		}, 1000/100);
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
                console.log('AFRAME-ARTOOLKIT: _onSourceReady width', width, 'height', height)
                _this.cameraParameters = new ARCameraParam(_this.data.cameraParametersUrl, function() {
                	// init controller
                        var arController = new ARController(width, height, _this.cameraParameters);
                        _this.arController = arController
                        
			// honor this.data.debug
                        if( _this.data.debug === true ){
				arController.debugSetup();
				arController.canvas.style.position = 'absolute'
				arController.canvas.style.top = '0px'
				arController.canvas.style.opacity = '0.6'
				arController.canvas.style.pointerEvents = 'none'
				arController.canvas.style.zIndex = '-1'
			}

			// set projectionMatrix
                        var projectionMatrix = arController.getCameraMatrix();
                        _this.sceneEl.camera.projectionMatrix.fromArray(projectionMatrix);

			// setPatternDetectionMode
			var detectionModes = {
				'color'			: artoolkit.AR_TEMPLATE_MATCHING_COLOR,
				'color_and_matrix'	: artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX,
				'mono'			: artoolkit.AR_TEMPLATE_MATCHING_MONO,
				'mono_and_matrix'	: artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX,
			}
			var detectionMode = detectionModes[_this.data.detectionMode]
			console.assert(detectionMode !== undefined)
			arController.setPatternDetectionMode(detectionMode);

			// setMatrixCodeType
			var matrixCodeTypes = {
				'3x3'		: artoolkit.AR_MATRIX_CODE_3x3,
				'3x3_HAMMING63'	: artoolkit.AR_MATRIX_CODE_3x3_HAMMING63,
				'3x3_PARITY65'	: artoolkit.AR_MATRIX_CODE_3x3_PARITY65,
				'4x4'		: artoolkit.AR_MATRIX_CODE_4x4,
				'4x4_BCH_13_9_3': artoolkit.AR_MATRIX_CODE_4x4_BCH_13_9_3,
				'4x4_BCH_13_5_5': artoolkit.AR_MATRIX_CODE_4x4_BCH_13_5_5,
			}
			var matrixCodeType = matrixCodeTypes[_this.data.matrixCodeType]
			console.assert(matrixCodeType !== undefined)
			arController.setMatrixCodeType(matrixCodeType);

			console.warn('arController fully initialized')

        		// notify
                        onCompleted && onCompleted()                
                })		
        },
        
        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        tick : function(now, delta){
		// be sure arController is fully initialized
                var arController = this.arController
                if (!arController) return;

		// mark all markers to invisible
		this._markerElements.forEach(function(markerElement){
			markerElement.el.object3D.visible = false
		})

		arController.process(this.srcElement)
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
        dependencies: ['artoolkit'],
	schema: {
		size: {
			type: 'number',
			default: 1
		},
		type: {
			type: 'string',
			default : 'unknown',
			parse: function (value) {	// check if the value is valid
				var possibleValues = ['pattern', 'barcode', 'unknown' ]
				console.assert(possibleValues.indexOf(value) !== -1, 'illegal value', value)
				return value
			}               
		},
		patternUrl: {
			type: 'string',
		},
		barcodeValue: {
			type: 'number'
		},
		changeMatrixMode: {
			type: 'string',
			default : 'modelViewMatrix',
			parse: function (value) {	// check if the value is valid
				var possibleValues = ['modelViewMatrix', 'cameraTransformMatrix' ]
				console.assert(possibleValues.indexOf(value) !== -1, 'illegal value', value)
				return value
			},
		}
	},
	init: function () {
		var _this = this
		this.markerId = null

                // create the marker Root
        	var markerRoot = this.el.object3D;
        	markerRoot.name = 'Marker Root'
        	markerRoot.userData.markerMatrix = new Float64Array(12);
        	markerRoot.matrixAutoUpdate = false;
        	markerRoot.visible = true

		// add this marker to artoolkitsystem
		var artoolkitsystem = this.el.sceneEl.systems.artoolkit
		artoolkitsystem.addMarker(this)
		
		var delayedInitTimerId = setInterval(function(){
			// check if arController is init
			var artoolkitsystem = _this.el.sceneEl.systems.artoolkit
			var arController = artoolkitsystem.arController
			if( arController === null )	return
			// stop looping if it is init
			clearInterval(delayedInitTimerId)
			delayedInitTimerId = null

			// start tracking this pattern
			if( _this.data.type === 'pattern' ){
	                        arController.loadMarker(_this.data.patternUrl, function(markerId) {
					_this.markerId = markerId
	                                arController.trackPatternMarkerId(_this.markerId, _this.data.size);
	                        });				
			}else if( _this.data.type === 'barcode' ){
				_this.markerId = _this.data.barcodeValue
				arController.trackBarcodeMarkerId(this.markerId, _this.data.size);
			}else if( _this.data.type === 'unknown' ){
				_this.markerId = null
			}else{
				console.log(false, 'invalid data type', _this.data.type)
			}

			// listen to the event 
			arController.addEventListener('getMarker', function(event){
				var data = event.data
				if( data.type === artoolkit.PATTERN_MARKER && _this.data.type === 'pattern' ){
					if( _this.markerId === null )	return
					if( data.marker.idPatt === _this.markerId ) updateMarker()
				}else if( data.type === artoolkit.BARCODE_MARKER && _this.data.type === 'barcode' ){
					// console.log('BARCODE_MARKER idMatrix', data.marker.idMatrix, _this.markerId )
					if( _this.markerId === null )	return
					if( data.marker.idMatrix === _this.markerId )  updateMarker()
				}else if( data.type === artoolkit.UNKNOWN_MARKER && _this.data.type === 'unknown'){
					updateMarker()
				}

				function updateMarker(){
					// data.matrix is the model view matrix
					var modelViewMatrix = new THREE.Matrix4().fromArray(data.matrix)

					markerRoot.visible = true

					if( _this.data.changeMatrixMode === 'modelViewMatrix' ){
						markerRoot.matrix.copy(modelViewMatrix)						
					}else if( _this.data.changeMatrixMode === 'cameraTransformMatrix' ){
						var cameraTransformMatrix = new THREE.Matrix4().getInverse( modelViewMatrix )
						markerRoot.matrix.copy(cameraTransformMatrix)						
					}else {
						console.assert(false)
					}
				}

			})
		}, 1000/50)
	},
	remove : function(){
		var artoolkitsystem = this.el.sceneEl.systems.artoolkit
		artoolkitsystem.removeMarker(this)
		
		// TODO remove the event listener if needed
		// unloadMaker ???
	},
	update: function () {
		// FIXME this mean to change the recode in trackBarcodeMarkerId ?
        	// var markerRoot = this.el.object3D;
        	// markerRoot.userData.size = this.data.size;
	},
});

//////////////////////////////////////////////////////////////////////////////
//                Code Separator
//////////////////////////////////////////////////////////////////////////////

AFRAME.registerPrimitive('a-marker', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
        defaultComponents: {
                artoolkitmarker: {},
        },
        mappings: {
                'type': 'artoolkitmarker.type',
                'size': 'artoolkitmarker.size',
                'url': 'artoolkitmarker.patternUrl',
                'value': 'artoolkitmarker.barcodeValue',
        }
}));
