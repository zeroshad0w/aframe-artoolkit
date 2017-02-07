var THREEx = THREEx || {}

THREEx.ArToolkitSource = function(parameters){	
	// handle default parameters
	this.parameters = {
		// type of source - ['webcam', 'image', 'video']
		sourceType : parameters.sourceType !== undefined ? parameters.sourceType : 'webcam',
		// url of the source - valid if sourceType = image|video
		sourceUrl : parameters.sourceUrl !== undefined ? parameters.sourceUrl : null,
		
		// resolution of at which we detect pose in the source image
		imageWidth: parameters.imageWidth !== undefined ? parameters.imageWidth : 640,
		imageHeight: parameters.imageHeight !== undefined ? parameters.imageHeight : 480,
		// resolution displayed for the source 
		displayWidth: parameters.displayWidth !== undefined ? parameters.displayWidth : 640,
		displayHeight: parameters.displayHeight !== undefined ? parameters.displayHeight : 480,
	}
	
        this.srcElement = null
}

THREEx.ArToolkitSource.baseURL = '../'

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ArToolkitSource.prototype.initSource = function(onReady){
	var _this = this

        if( this.parameters.sourceType === 'image' ){
                var srcElement = this._initSourceImage(onSourceReady)                        
        }else if( this.parameters.sourceType === 'video' ){
                var srcElement = this._initSourceVideo(onSourceReady)                        
        }else if( this.parameters.sourceType === 'webcam' ){
                var srcElement = this._initSourceWebcam(onSourceReady)                        
        }else{
                console.assert(false)
        }

	// attach
        this.srcElement = srcElement
        this.srcElement.style.position = 'absolute'
        this.srcElement.style.top = '0px'
        this.srcElement.style.zIndex = '-2'	

	return
        function onSourceReady(){
                console.log('ready')
                _this._onSourceReady(function onCompleted(){
                        console.log('completed')
			onReady && onReady()
                })
        }
} 

THREEx.ArToolkitSource.prototype._initSourceImage = function(onReady) {
	// TODO make it static
        var srcElement = document.createElement('img')
	document.body.appendChild(srcElement)
	srcElement.src = this.parameters.sourceUrl

	srcElement.width = this.parameters.imageWidth
	srcElement.height = this.parameters.imageHeight
	srcElement.style.width = this.parameters.displayWidth+'px'
	srcElement.style.height = this.parameters.displayHeight+'px'

	setTimeout(function(){
		onReady && onReady()
	}, 0)
	return srcElement                
}

THREEx.ArToolkitSource.prototype._initSourceVideo = function(onReady) {
	// TODO make it static
	var srcElement = document.createElement('video');
	document.body.appendChild(srcElement)
	srcElement.src = this.parameters.sourceUrl

	srcElement.style.objectFit = 'initial'

	srcElement.autoplay = true;
	srcElement.webkitPlaysinline = true;
	srcElement.controls = false;
	srcElement.loop = true;

	// trick to trigger the video on android
	document.body.addEventListener('click', function(){
		srcElement.play()
	})

	srcElement.width = this.parameters.imageWidth
	srcElement.height = this.parameters.imageHeight
	srcElement.style.width = this.parameters.displayWidth+'px'
	srcElement.style.height = this.parameters.displayHeight+'px'
	
	// wait until the video stream is ready
	var interval = setInterval(function() {
		if (!srcElement.videoWidth)	return;
		onReady()
		clearInterval(interval)
	}, 1000/100);
	return srcElement
}

THREEx.ArToolkitSource.prototype._initSourceWebcam = function(onReady) {
	var _this = this
	// TODO make it static
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	var srcElement = document.createElement('video');
	document.body.appendChild(srcElement);
	srcElement.style.width = this.parameters.displayWidth+'px'
	srcElement.style.height = this.parameters.displayHeight+'px'


	if (navigator.getUserMedia == false )	console.log("navigator.getUserMedia not present in your browser");

	navigator.mediaDevices.enumerateDevices().then(function(devices) {
                // define getUserMedia() constraints
                var constraints = {
			audio: false,
			video: {
				mandatory: {
					maxWidth: _this.parameters.imageWidth,
					maxHeight: _this.parameters.imageHeight
		    		}
		  	}
                }

		devices.forEach(function(device) {
			if( device.kind !== 'videoinput' )	return
			constraints.video.optional = [{sourceId: device.deviceId}]
		});

		// OLD API
                // it it finds the videoSource 'environment', modify constraints.video
                // for (var i = 0; i != sourceInfos.length; ++i) {
                //         var sourceInfo = sourceInfos[i];
                //         if(sourceInfo.kind == "video" && sourceInfo.facing == "environment") {
                //                 constraints.video.optional = [{sourceId: sourceInfo.id}]
                //         }
                // }

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
	}).catch(function(err) {
		console.log(err.name + ": " + err.message);
	});

	return srcElement
}


THREEx.ArToolkitSource.prototype.onResize = function(){
	var screenWidth = window.innerWidth
	var screenHeight = window.innerHeight
	// compute sourceWidth, sourceHeight
	if( this.srcElement.nodeName === "IMG" ){
		var sourceWidth = this.srcElement.naturalWidth
		var sourceHeight = this.srcElement.naturalHeight
	}else if( this.srcElement.nodeName === "VIDEO" ){
		var sourceWidth = this.srcElement.videoWidth
		var sourceHeight = this.srcElement.videoHeight
	}else{
		console.assert(false)
	}
	
	// compute sourceAspect
	var sourceAspect = sourceWidth / sourceHeight
	// compute screenAspect
	var screenAspect = screenWidth / screenHeight

	// if screenAspect < sourceAspect, then change the width, else change the height
	if( screenAspect < sourceAspect ){
		// compute newWidth and set .width/.marginLeft
		var newWidth = sourceAspect * screenHeight
		this.srcElement.style.width = newWidth+'px'
		this.srcElement.style.marginLeft = -(newWidth-screenWidth)/2+'px'
		
		// init style.height/.marginTop to normal value
		this.srcElement.style.height = screenHeight+'px'
		this.srcElement.style.marginTop = '0px'

	}else{
		// compute newHeight and set .height/.marginTop
		var newHeight = 1 / (sourceAspect / screenWidth)
		this.srcElement.style.height = newHeight+'px'
		this.srcElement.style.marginTop = -(newHeight-screenHeight)/2+'px'
		
		// init style.width/.marginLeft to normal value
		this.srcElement.style.width = screenWidth+'px'
		this.srcElement.style.marginLeft = '0px'
	}
}
