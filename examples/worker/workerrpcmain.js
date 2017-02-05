function WorkerRPCMain(worker){

	this._worker = worker
}

WorkerRPCMain.prototype.call = function(method) {
	var callID = this.callID++;
	
	if (typeof transferables === 'function') {
		callback = transferables;
		transferables = undefined;
	}

	this.callbacks[callID] = callback;

	this._worker.postMessage({
		method: method,
		id: id,
		callID: callID,
		arguments: args
	}, transferables);
};
