var THREEx = THREEx || {}

THREEx.ArToolkitMarker = function(context, object3d, data){
	var _this = this
	this.context = context
	this.data = data

	var _this = this
	this.markerId = null

        // create the marker Root
	this.object3d = object3d
	this.object3d.name = 'Marker Root'
	this.object3d.matrixAutoUpdate = false;
	this.object3d.visible = true

	// add this marker to artoolkitsystem
	context.addMarker(this)
	
	// wait for arController to be initialized before going on with the init
	var delayedInitTimerId = setInterval(function(){
		// check if arController is init
		var arController = _this.context.arController
		if( arController === null )	return
		// stop looping if it is init
		clearInterval(delayedInitTimerId)
		delayedInitTimerId = null
		// launch the _postInit
		_this._postInit()
	}, 1000/50)
	return
	
}

THREEx.ArToolkitMarker.prototype._postInit = function(){
	var _this = this
	var markerRoot = this.object3d;
	// check if arController is init
	var arController = this.context.arController
	console.assert(arController !== null )

	// start tracking this pattern
	if( _this.data.type === 'pattern' ){
                arController.loadMarker(_this.data.patternUrl, function(markerId) {
			_this.markerId = markerId
                        arController.trackPatternMarkerId(_this.markerId, _this.data.size);
                });				
	}else if( _this.data.type === 'barcode' ){
		_this.markerId = _this.data.barcodeValue
		arController.trackBarcodeMarkerId(_this.markerId, _this.data.size);
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
			if( data.marker.idPatt === _this.markerId ) onMarkerFound()
		}else if( data.type === artoolkit.BARCODE_MARKER && _this.data.type === 'barcode' ){
			// console.log('BARCODE_MARKER idMatrix', data.marker.idMatrix, _this.markerId )
			if( _this.markerId === null )	return
			if( data.marker.idMatrix === _this.markerId )  onMarkerFound()
		}else if( data.type === artoolkit.UNKNOWN_MARKER && _this.data.type === 'unknown'){
			onMarkerFound()
		}

		function onMarkerFound(){
			// data.matrix is the model view matrix
			var modelViewMatrix = new THREE.Matrix4().fromArray(data.matrix)
console.log('onMarkerFound', data.matrix)
			markerRoot.visible = true

			if( _this.data.changeMatrixMode === 'modelViewMatrix' ){
				markerRoot.matrix.copy(modelViewMatrix)						
			}else if( _this.data.changeMatrixMode === 'cameraTransformMatrix' ){
				var cameraTransformMatrix = new THREE.Matrix4().getInverse( modelViewMatrix )
				markerRoot.matrix.copy(cameraTransformMatrix)						
			}else {
				console.assert(false)
			}
			// TODO decompose the matrix into .position, .quaternion, scale
			markerRoot.matrix.decompose(markerRoot.position, markerRoot.quaternion, markerRoot.scale)
			console.log('children', markerRoot.children)
		}
	})
}

THREEx.ArToolkitMarker.dispose = function(){
	this.context.removeMarker(this)
	
	// TODO remove the event listener if needed
	// unloadMaker ???
}
