/**
	ARToolKit Web Worker proxy.
*/

importScripts("../../vendor/jsartoolkit5/build/artoolkit.debug.js");
importScripts("../../threex-artoolkitcontext.js");
importScripts("../../threex-armarkercontrols.js");


onmessage = function(event) {
	if( event.data.type === 'ArToolkitContext'){
		onMessageContext(event)
	}else if( event.data.type === 'ArToolkitControls'){
		onMessageControls(event)
	}else{
		console.assert(false, 'unknown data type '+event.data.type)
	}
}


//////////////////////////////////////////////////////////////////////////////
//		THREEx.ArToolkitContext
//////////////////////////////////////////////////////////////////////////////

var contextWorkers = {};
var contextWorkerId = 0;
var contextCallbackMethods = {
	'loadNFTMarker': 1,
	'loadMarker': 1,
	'loadMultiMarker': 1
};

function onMessageContext(event){
	var data = event.data
	
	if (data.method === 'new') {
		
		// create ArToolkitContext
		var arToolKitContext = new THREEx.ArToolkitContext(data.args[0]);
		var contextId = contextWorkerId++;
		contextWorkers[contextId] = arToolKitContext;
		console.log('arToolKitContext', arToolKitContext)
		// notify the main thread it is completed
		postMessage({method: 'new', contextId: contextId, callId: data.callId});

	} else if (data.method === 'dispose') {
		
		var arToolKitContext = contextWorkers[data.id];
		arToolKitContext.dispose();
		delete contextWorkers[data.id];
		postMessage({method: 'dispose', contextId: data.id, callId: data.callId});

	} else {

		var arToolKitContext = contextWorkers[data.id];

		if (contextCallbackMethods[data.method]) {
			data.args.push(function() {
				var args = Array.prototype.slice.call(arguments)
				postMessage({method: data.method, result: args, id: data.id, callId: data.callId});
			});
			arToolKitContext[data.method].apply(arToolKitContext, data.args);
		} else {
			var result = arToolKitContext[data.method].apply(arToolKitContext, data.args);
			postMessage({method: data.method, result: result, id: data.id, callId: data.callId});
		}
	}

};
