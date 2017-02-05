console.log('init webworker')

importScripts("../vendor/three.js/build/three.js");

importScripts("../../vendor/jsartoolkit5/build/artoolkit.debug.js");
importScripts("../../threex-artoolkitcontext.js");
// 
// importScripts("./workerrpcworker.js");

WorkerContexts = {};
WorkerContextID = 0;

self.onmessage = function(event){
	console.log('worker thread received message method:', event.data.method)
	var data = event.data
	if( data.method === 'newContext' ){
		var contextParameters = data.contextParameters
		// create arToolkitContext
		var arToolkitContext = new THREEx.ArToolkitContext(contextParameters)
	}else{
		console.assert(false, 'unknown method '+data.method)
	}
}
// console.log('self', self.onmessage)
