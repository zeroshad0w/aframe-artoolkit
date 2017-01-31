var THREEx = THREEx || {}

THREEx.ArToolkitContext = function(parameters, options){
	var _this = this
	
	this.options = {
		imageWidth: options.imageWidth !== undefined ? options.imageWidth : 640,
		imageHeight: options.imageHeight !== undefined ? options.imageHeight : 640,
	}	
	
	// handle default parameters
	this.parameters = {
		debug: parameters.debug !== undefined ? parameters.debug : false,
		sourceType : parameters.sourceType !== undefined ? parameters.sourceType : 'webcam',
		sourceUrl : parameters.sourceUrl !== undefined ? parameters.sourceUrl : null,
		detectionMode: parameters.detectionMode !== undefined ? parameters.detectionMode : 'color_and_matrix',
		matrixCodeType: parameters.matrixCodeType !== undefined ? parameters.matrixCodeType : '3x3',
		cameraParametersUrl: parameters.cameraParametersUrl !== undefined ? parameters.cameraParametersUrl : THREEx.ArToolkitContext.baseURL + 'parameters/camera_para.dat',
	}
	
        this.srcElement = null
        this.arController = null;
        this.cameraParameters = null
	this._arMarkersControls = []
        this._initSource(function onReady(width, height){
                console.log('ready')
                _this._onSourceReady(width, height, function onCompleted(){
                        console.log('completed')
			_this.dispatchEvent( { type: 'ready' } );
                })
        })	
}

THREEx.ArToolkitContext.baseURL = '../'

// Mixin the EventDispatcher.prototype with the custom object prototype
Object.assign( THREEx.ArToolkitContext.prototype, THREE.EventDispatcher.prototype );

THREEx.ArToolkitContext.prototype._initSource = function(onReady) {
        if( this.parameters.sourceType === 'image' ){
                var srcElement = this._initSourceImage(function(){
                        onReady(srcElement.width, srcElement.height)
                })                        
        }else if( this.parameters.sourceType === 'video' ){
                var srcElement = this._initSourceVideo(function(){
                        onReady(srcElement.width, srcElement.height)
                })                        
        }else if( this.parameters.sourceType === 'webcam' ){
                var srcElement = this._initSourceWebcam(function(){
                        onReady(srcElement.videoWidth, srcElement.videoHeight)
                })                        
        }else{
                console.assert(false)
        }
	// attach
        this.srcElement = srcElement
        this.srcElement.style.position = 'absolute'
        this.srcElement.style.top = '0px'
        this.srcElement.style.zIndex = '-2'	
};

THREEx.ArToolkitContext.prototype._initSourceImage = function(onReady) {
	// TODO make it static
        var srcElement = document.createElement('img')
	document.body.appendChild(srcElement)
	srcElement.src = this.parameters.sourceUrl

	srcElement.width = this.options.imageWidth
	srcElement.height = this.options.imageHeight

	setTimeout(function(){
		onReady && onReady()
	}, 0)
	return srcElement                
}

THREEx.ArToolkitContext.prototype._initSourceVideo = function(onReady) {
	// TODO make it static
	var srcElement = document.createElement('video');
	document.body.appendChild(srcElement)
	srcElement.src = this.parameters.sourceUrl

	srcElement.style.objectFit = 'initial'

	srcElement.autoplay = true;
	srcElement.webkitPlaysinline = true;
	srcElement.controls = false;
	srcElement.loop = true;

	srcElement.width = this.options.imageWidth
	srcElement.height = this.options.imageHeight
	
	// wait until the video stream is ready
	var interval = setInterval(function() {
		if (!srcElement.videoWidth)	return;
		onReady()
		clearInterval(interval)
	}, 1000/100);
	return srcElement
}

THREEx.ArToolkitContext.prototype._initSourceWebcam = function(onReady) {
	// TODO make it static
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
					maxWidth: _this.options.imageWidth,
					maxHeight: _this.options.imageHeight
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
}


//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ArToolkitContext.prototype._onSourceReady = function(width, height, onCompleted){
        var _this = this
        console.log('ArToolkitContext: _onSourceReady width', width, 'height', height)
        _this.cameraParameters = new ARCameraParam(_this.parameters.cameraParametersUrl, function() {
        	// init controller
                var arController = new ARController(width, height, _this.cameraParameters);
                _this.arController = arController
                
		// honor this.parameters.debug
                if( _this.parameters.debug === true ){
			arController.debugSetup();
			arController.canvas.style.position = 'absolute'
			arController.canvas.style.top = '0px'
			arController.canvas.style.opacity = '0.6'
			arController.canvas.style.pointerEvents = 'none'
			arController.canvas.style.zIndex = '-1'
		}

		// setPatternDetectionMode
		var detectionModes = {
			'color'			: artoolkit.AR_TEMPLATE_MATCHING_COLOR,
			'color_and_matrix'	: artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX,
			'mono'			: artoolkit.AR_TEMPLATE_MATCHING_MONO,
			'mono_and_matrix'	: artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX,
		}
		var detectionMode = detectionModes[_this.parameters.detectionMode]
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
		var matrixCodeType = matrixCodeTypes[_this.parameters.matrixCodeType]
		console.assert(matrixCodeType !== undefined)
		arController.setMatrixCodeType(matrixCodeType);

		console.warn('arController fully initialized')

		// notify
                onCompleted && onCompleted()                
        })		
}

////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////
THREEx.ArToolkitContext.prototype.update = function(){
	// be sure arController is fully initialized
        var arController = this.arController
        if (!arController) return;

	// mark all markers to invisible before processing this frame
	this._arMarkersControls.forEach(function(artoolkitMarker){
		artoolkitMarker.object3d.visible = false
	})

	// process this frame
	arController.process(this.srcElement)
}

////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////
THREEx.ArToolkitContext.prototype.addMarker = function(arMarkerControls){
	console.assert(arMarkerControls instanceof THREEx.ArMarkerControls)
	this._arMarkersControls.push(arMarkerControls)
}

THREEx.ArToolkitContext.prototype.removeMarker = function(arMarkerControls){
	console.assert(arMarkerControls instanceof THREEx.ArMarkerControls)
	// console.log('remove marker for', arMarkerControls)
	var index = this.arMarkerControlss.indexOf(artoolkitMarker);
	console.assert(index !== index )
	this._arMarkersControls.splice(index, 1)
}
