

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
		var arToolkitContext = new THREEx.ArToolkitContext(this.data)
		this.arToolkitContext = arToolkitContext;		
	},
        
        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
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
		var artoolkitContext = this.el.sceneEl.systems.artoolkit.arToolkitContext
		this.artoolkitMarker = new THREEx.ArToolkitMarker(artoolkitContext, this.el.object3D, this.data)
		// this.el.setObject3D('markerRoot', this.artoolkitMarker.object3d);
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
