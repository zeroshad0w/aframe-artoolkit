/**
 * - Model = setKnownPosition Object is the object controlled by ArMarkerControls,  markerDetected
 * - markerRoot is controlled by THREEx.MotionPredictionControls
 * - motionPredictionControls = new THREEx.MotionPredictionControls(markerRoot)
 * - markerDetected is controlled by THREEx.ArMarkerControls
 * - var hasBeenUpdated = arToolkitContext.update() - modification to do
 * - if( hasBeenUpdated ) motionPredictionControls.setKnownPosition(markerDetected)
 * - 
 */


var THREEx = THREEx || {}

THREEx.MotionPredictionControls = function(object){
	this.object = object

	this._lastKnownPoseAt = null

	this._lastKnownPosition = new THREE.Vector3
	this._linearVelocity = new THREE.Vector3

	this._lastKnownQuaternion = new THREE.Quaternion
	this._angularVelocity = new THREE.Quaternion
}

THREEx.MotionPredictionControls.prototype.update = function () {
	// if we never had any pose, return now
	if( this._lastKnownPoseAt === null )	return
	// compute time
	var present = performance.now()
	var lastKnownPoseAge = present - this._lastKnownPoseAt
	// update position from _lastKnownPosition and _linearVelocity
	this.object.position.copy(this._lastKnownPosition)
	this.object.position.add(this._linearVelocity.clone().multiplyScalar(lastKnownPoseAge))
	// update position from _lastKnownQuaternion and _angularVelocity
	// FIXME here add the angularVelocity
	this.object.quaternion.copy(this._lastKnownQuaternion)
};

THREEx.MotionPredictionControls.prototype.setKnownPosition = function (newPosition, newQuaternion) {
	var present = performance.now()
	var delay = present - this._lastKnownPoseAt
	
	if( this._lastKnownPoseAt !== null ){
		// Compute linear speed
		this._linearVelocity.copy(newPosition)
			.sub(this._lastKnownPosition)
			.divideScalar(delay)

// http://math.stackexchange.com/questions/160908/how-to-get-angular-velocity-from-difference-orientation-quaternion-and-time
// http://www.euclideanspace.com/physics/kinematics/angularvelocity/quatDiff1stAttempt.htm
		// TODO this one is wrong we need to devide by delay
		this._angularVelocity.copy(newQuaternion)
			.multiply(this._lastKnownQuaternion.clone().inverse())
			// .divideScalar(delay)
	}

	// update current info
	this._lastKnownPoseAt = present
	this._lastKnownPosition.copy(newPosition)
	this._lastKnownQuaternion.copy(newQuaternion)
};
