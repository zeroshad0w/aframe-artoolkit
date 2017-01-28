;(function(){
	// to init arToolKitFrameData immediatly
	var arToolKitFrameData = new ARToolKitFrameData()
	// update arToolKitFrameData on every frame
	requestAnimationFrame(function loop(){
		requestAnimationFrame(loop)
		arToolKitFrameData.update()
		
		// if( window.camera ){
		// 	console.log(arToolKitFrameData._camera.projectionMatrix)
		// 	window.camera.projectionMatrix.copy(arToolKitFrameData._camera.projectionMatrix)
		// }
	})

	// install webvr-polyfill with ArToolkitFrameDataProvider as positional tracking
	var webvrPolyfill = new WebVRPolyfill().install()
	webvrPolyfill.setFrameDataProvider(arToolKitFrameData)	
})()
