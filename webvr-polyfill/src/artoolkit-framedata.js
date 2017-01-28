
function ARToolKitFrameData(){
	var _this = this
	_this.started = false;
	
	// Create a camera and a marker root object for your Three.js scene.
	var camera = new THREE.Camera();
_this._camera = camera
	// create arToolkitContext
	var arToolkitContext = new THREEx.ArToolkitContext({
		sourceType : 'image',
		sourceUrl : '../../aframe/examples/images/img.jpg',
		// sourceType : 'video',
		// sourceUrl : '../../aframe/examples/videos/headtracking.mp4',
		cameraParametersUrl: '../../aframe/examples/data/camera_para.dat',
		detectionMode: 'mono'
	})
	// update the camera projectionMatrix
	arToolkitContext.addEventListener( 'ready', function ( event ) {
	        var projectionMatrix = arToolkitContext.arController.getCameraMatrix();
	        camera.projectionMatrix.fromArray(projectionMatrix);
		
		_this.started = true
	})
	// update artoolkit on every frame
	this.update = function(){
		arToolkitContext.update()		
	}

	// init controls for camera
	var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
		type : 'pattern',
		patternUrl : '../../aframe/examples/data/patt.hiro',
		// patternUrl : '../../aframe/examples/data/patt.kanji',
		// as we controls the camera 
		changeMatrixMode: 'cameraTransformMatrix'
	})

	this.resetPose = function(){}
	this.dispose = function(){}

        this.updateFrameData = function(dstFrameData){
                dstFrameData.timestamp = Date.now()
// console.log('camera.quaternion', camera.quaternion)
                camera.position.toArray(dstFrameData.pose.position)
                camera.quaternion.toArray(dstFrameData.pose.quaternion)
        }
};
