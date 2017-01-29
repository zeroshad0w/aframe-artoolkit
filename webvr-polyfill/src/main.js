;(function(){
	var arToolKitContextOptions = {
		sourceType : 'image',
		sourceUrl : '../../aframe/examples/images/img.jpg',

		// sourceType : 'video',
		// sourceUrl : '../../aframe/examples/videos/headtracking.mp4',
		
		// sourceType: 'webcam',

		cameraParametersUrl: '../../aframe/examples/data/camera_para.dat',
		detectionMode: 'mono'
	}
	var arMarkerControlsOptions = {
		type : 'pattern',
		patternUrl : '../../aframe/examples/data/patt.hiro',
		// patternUrl : '../../aframe/examples/data/patt.kanji',
		// as we controls the camera 
		changeMatrixMode: 'cameraTransformMatrix'
	}
	
	// to init arToolKitFrameData immediatly
	var arToolKitFrameData = new ARToolKitFrameData(arToolKitContextOptions, arMarkerControlsOptions)
	// update arToolKitFrameData on every frame
	requestAnimationFrame(function loop(){
		requestAnimationFrame(loop)
		arToolKitFrameData.update()
	})

	// install webvr-polyfill with ArToolkitFrameDataProvider as positional tracking
	var webvrPolyfill = new WebVRPolyfill().install()
	webvrPolyfill.setFrameDataProvider(arToolKitFrameData)	
	
	// TODO find a better way to handle the camera
	// it should simply be in the webvr data
	// - if one 
	requestAnimationFrame(function loop(){
		requestAnimationFrame(loop)
		if( window.camera === undefined )	return
		// console.log(arToolKitFrameData._camera.projectionMatrix)
		window.camera.projectionMatrix.copy(arToolKitFrameData._camera.projectionMatrix)
	})
})()
