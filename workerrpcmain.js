function WorkerRPCMain(worker){

	this.callID = 0;
	this.callbacks = {};
	this.listeners = {};

	this._worker = worker
}

WorkerRPCMain.prototype.call = function(id, method, arguments, transferables, callback) {
	var callID = this.callID++;
	
	if (typeof transferables === 'function') {
		callback = transferables;
		transferables = undefined;
	}

	this.callbacks[callID] = callback;

	this._worker.postMessage({
		// method: method,
		// id: id,
		// callID: callID,
		// arguments: arguments
	}, transferables);
};
