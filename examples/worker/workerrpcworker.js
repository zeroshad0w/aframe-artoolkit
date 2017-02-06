/**
	ARToolKit Web Worker proxy.
*/

importScripts("../vendor/three.js/build/three.js");

importScripts("../../vendor/jsartoolkit5/build/artoolkit.debug.js");
importScripts("../../threex-artoolkitcontext.js");
importScripts("../../threex-armarkercontrols.js");


onmessage = function(event) {
	if( event.data.type === 'ArToolkitContext'){
		onMessageContext(event)
	}else{
		console.assert(false, 'unknown data type '+event.data.type)
	}
}


//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

var contextWorkers = {};
var contextWorkerId = 0;
var contextCallbackMethods = {
	'loadNFTMarker': 1,
	'loadMarker': 1,
	'loadMultiMarker': 1
};

function onMessageContext(event){
	if (event.data.method === 'new') {
		// create ArToolkitContext
		var arToolKitContext = new THREEx.ArToolkitContext(event.data.args[0]);
		var contextId = contextWorkerId++;
		contextWorkers[contextId] = arToolKitContext;
		console.log('arToolKitContext', arToolKitContext)
		// notify the main thread it is completed
		postMessage({method: 'new', contextId: contextId, callId: event.data.callId});

	} else if (event.data.method === 'dispose') {
		
		var arToolKitContext = contextWorkers[event.data.id];
		arToolKitContext.dispose();
		delete contextWorkers[event.data.id];
		postMessage({method: 'dispose', contextId: event.data.id, callId: event.data.callId});

	} else {

		var arToolKitContext = contextWorkers[event.data.id];
		if (contextCallbackMethods[event.data.method]) {
			event.data.args.push(function() {
				var args = Array.prototype.slice.call(arguments)
				postMessage({method: event.data.method, result: args, id: event.data.id, callId: event.data.callId});
			});
			arToolKitContext[event.data.method].apply(arToolKitContext, event.data.args);
		} else {
			var result = arToolKitContext[event.data.method].apply(arToolKitContext, event.data.args);
			postMessage({method: event.data.method, result: result, id: event.data.id, callId: event.data.callId});
		}
	}

};
