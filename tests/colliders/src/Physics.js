// Ray
function Ray(org, dir) {
    this.origin = org || new THREE.Vector3();
	// Make sure the direction is always normalized!
    this.direction = dir || new THREE.Vector3(1,0,0); 
}

Ray.prototype.intersectionPoint = function(t) {
	return this.origin.clone().addSelf(this.direction.multiplyScalar(t));
}

// Parametric plane
function CPlane(pt, nor){
	this.point = pt;
	this.normal = nor;
}

// Parametric sphere
function CSphere(cen, rad){
	this.center = cen;
	this.radius = rad;
	this.radiusSq = rad * rad;
}

// Box (AABB or OOBB)
function CBox(min, max){
	this.min = min;
	this.max = max;
	this.dynamic = true;
}

PhysicsSystem = function(){
	this.colliders = [];
	this.hits = [];
};

var Physics = new PhysicsSystem();

// @params r Ray
// @returns Array of colliders with a field "distance" set (@see Collisions.rayCast for details), empty if not intersection
PhysicsSystem.prototype.rayCastAll = function(r) {
	r.direction.normalize();
	
	this.hits.length = 0;
	for (var i = 0; i < this.colliders.length; i++) {
		var d = this.rayCast(r, this.colliders[i]);		
		if (d < Number.MAX_VALUE) {
			this.colliders[i].distance = d;
			this.hits.push(this.colliders[i]);
		}
	}
	return this.hits;
}

// @params r Ray
// @returns nearest collider found, with "distance" field set, or null if no intersection
PhysicsSystem.prototype.rayCastNearest = function(r) {
	r.direction.normalize();
	
	var c = null;
	var sd = Number.MAX_VALUE;

	for (var i = 0; i < this.colliders.length; i++) {
		var d = this.rayCast(r, this.colliders[i]);		
		if (d < sd) {
			sd = d;
			c = this.colliders[i];
		}
	}

	if(c) c.distance = sd;
	return c;
}

// @params r Ray, c any supported collider type
// @returns Number, distance to intersection, MAX_VALUE if no intersection and -1 if ray inside collider (where applicable)
PhysicsSystem.prototype.rayCast = function(r, c) {
	if(c instanceof CPlane)
		return this.rayPlane(r, c);
	else if(c instanceof CSphere)
		return this.raySphere(r, c);
	else if (c instanceof CBox)
		return this.rayBox(r, c);
}

// @params r Ray, s CSphere
// @returns Number, distance to intersection, -1 if inside or MAX_VALUE if no intersection
PhysicsSystem.prototype.rayBox = function(r, ab){
	
	// If Collider.dynamic = true (default) it will act as an OOBB, getting the transformation from a mesh it is attached to
	// In this case it needs to have a 'mesh' field, which has a 'matrixWorld' field in turn (like in THREE.Mesh)
	if(ab.dynamic && ab.mesh && ab.mesh.matrixWorld) {
		r = new Ray(r.origin.clone(), r.direction.clone());
		var m = THREE.Matrix4.makeInvert( ab.mesh.matrixWorld );
		m.multiplyVector3(r.origin);
		m.rotateAxis(r.direction);
	}
	
	// If box is not marked as dynamic or mesh is not found, it works like a simple AABB
	// and uses the originaly calculated bounding box (faster if object is static)
	
	var xt = 0, yt = 0, zt = 0;
	//var xn = 0, yn = 0, zn = 0;
	var ins = true;
	
	if(r.origin.x < ab.min.x) {
		xt = ab.min.x - r.origin.x;
		/* If this and the similar lines below are uncommented, 
		 * the function will return MAX_VALUE (i.e. no intersection) 
		 * if the Ray.direction is too short to reach the AABB.
		 *
		 * Otherwise the Ray is considered infinite (but only forward) 
		 * and returned is the distance from Ray.origin to intersection point.
		 */ 
		//if(xt > r.direction.x) return return Number.MAX_VALUE;
		xt /= r.direction.x;
		ins = false;
		//xn = -1;
	} else if(r.origin.x > ab.max.x) {
		xt = ab.max.x - r.origin.x;
		//if(xt < r.direction.x) return return Number.MAX_VALUE;
		xt /= r.direction.x;
		ins = false;
		//xn = 1;
	}
	
	if(r.origin.y < ab.min.y) {
		yt = ab.min.y - r.origin.y;
		//if(yt > r.direction.y) return return Number.MAX_VALUE;
		yt /= r.direction.y;
		ins = false;
		//yn = -1;
	} else if(r.origin.y > ab.max.y) {
		yt = ab.max.y - r.origin.y;
		//if(yt < r.direction.y) return return Number.MAX_VALUE;
		yt /= r.direction.y;
		ins = false;
		//yn = 1;
	}
	
	if(r.origin.z < ab.min.z) {
		zt = ab.min.z - r.origin.z;
		//if(zt > r.direction.z) return return Number.MAX_VALUE;
		zt /= r.direction.z;
		ins = false;
		//zn = -1;
	} else if(r.origin.z > ab.max.z) {
		zt = ab.max.z - r.origin.z;
		//if(zt < r.direction.z) return return Number.MAX_VALUE;
		zt /= r.direction.z;
		ins = false;
		//zn = 1;
	}
	
	if(ins) return -1;

	var which = 0;
	var t = xt;
	if(yt > t) {
		which = 1;
		t = yt;
	}
	
	if (zt > t) {
		which = 2;
		t = zt;
	}
	
	switch(which) {
		case 0:
			var y = r.origin.y + r.direction.y * t;
			if(y < ab.min.y || y > ab.max.y) return Number.MAX_VALUE;
			var z = r.origin.z + r.direction.z * t;
			if(z < ab.min.z || z > ab.max.z) return Number.MAX_VALUE;
			//normal = new THREE.Vector3(xn, 0, 0);
			break;
		case 1:
			var x = r.origin.x + r.direction.x * t;
			if(x < ab.min.x || x > ab.max.x) return Number.MAX_VALUE;
			var z = r.origin.z + r.direction.z * t;
			if(z < ab.min.z || z > ab.max.z) return Number.MAX_VALUE;
			//normal = new THREE.Vector3(0, yn, 0);
			break;
		case 2:
			var x = r.origin.x + r.direction.x * t;
			if(x < ab.min.x || x > ab.max.x) return Number.MAX_VALUE;
			var y = r.origin.y + r.direction.y * t;
			if(y < ab.min.y || y > ab.max.y) return Number.MAX_VALUE;
			//normal = new THREE.Vector3(0, 0, zn);
			break;
	}
	
	return t;
}

// @params r Ray, s CSphere
// @returns Number, parametric distance or MAX_VALUE if no intersection
// #TBT
PhysicsSystem.prototype.rayPlane = function(r, p){
	var t = r.direction.dot(p.normal);
	var d = p.point.dot(p.normal);
	var ds;
	
	if(t < 0) ds = (d - r.origin.dot(p.normal)) / t;
	else return Number.MAX_VALUE;
	
	if(ds > 0) return ds;
	else return Number.MAX_VALUE;

}

// @params r Ray, s CSphere
// @returns Number, parametric distance or MAX_VALUE if no intersection
PhysicsSystem.prototype.raySphere = function(r, s){
	var e = s.center.clone().subSelf(r.origin);
	if(e.lengthSq < s.radiusSq) return -1;
	
	var a = e.dot(r.direction.clone()); // Ray.direction must be unit vector!
	if(a <= 0) return Number.MAX_VALUE;
	
	var t = s.radiusSq - (e.lengthSq() - a * a);
	if(t >= 0) return Math.abs(a) - Math.sqrt(t);
	
	return Number.MAX_VALUE;
}







