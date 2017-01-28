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
                },
                sourceUrl : {
                        type: 'string',
                },
		detectionMode : {
			type: 'string',
			default: 'color_and_matrix',
		},
		matrixCodeType : {
			type: 'string',
			default: '3x3',
		},
		cameraParametersUrl : {
			type: 'string',
			default: 'data/camera_para.dat'
		},
	},
	init: function () {
		var _this = this;
		var arToolkitContext = new THREEx.ArToolkitContext(this.data)
		this.arToolkitContext = arToolkitContext;	
		
		// apply projectionMatrix
		arToolkitContext.addEventListener( 'ready', function ( event ) {
                        var projectionMatrix = arToolkitContext.arController.getCameraMatrix();
                        _this.sceneEl.camera.projectionMatrix.fromArray(projectionMatrix);
		})
			
	},
        
        tick : function(now, delta){
		this.arToolkitContext.update()
	},
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
		}
	},
	init: function () {
		var artoolkitContext = this.el.sceneEl.systems.artoolkit.arToolkitContext
		this.artoolkitMarker = new THREEx.ArToolkitMarker(artoolkitContext, this.el.object3D, this.data)
	},
	remove : function(){
		this.artoolkitMarker.dispose()
	},
	update: function () {
		// FIXME this mean to change the recode in trackBarcodeMarkerId ?
        	// var markerRoot = this.el.object3D;
        	// markerRoot.userData.size = this.data.size;
	},
});

//////////////////////////////////////////////////////////////////////////////
//                define some primitives shortcuts
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

AFRAME.registerPrimitive('a-marker-camera', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
        defaultComponents: {
                artoolkitmarker: {
			changeMatrixMode: 'cameraTransformMatrix'
		},
        },
        mappings: {
                'type': 'artoolkitmarker.type',
                'size': 'artoolkitmarker.size',
                'url': 'artoolkitmarker.patternUrl',
                'value': 'artoolkitmarker.barcodeValue',
        }
}));
