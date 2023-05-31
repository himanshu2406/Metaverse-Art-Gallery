var gamepads = [];

import * as chooseName from './map_maker.js';
import * as pickName from './map_script.js';

var moveMap = chooseName.city;
building_to_value();

function building_to_value() {
	for (let i = 0; i < moveMap.length; i++) {
		for (let j = 0; j < moveMap[0].length; j++) {
			if (i == 0 && j == 7) {
				moveMap[i][j] = 3
			} else if (moveMap[i][j] == 13) {
				moveMap[i][j] = 2;
			} else if (moveMap[i][j] == 0 || moveMap[i][j] == 5.5 || moveMap[i][j] == 5 || moveMap[i][j] == 10) { 
				moveMap[i][j] = 0; // empty
			} else {
				moveMap[i][j] = 1; // building
	}
		}
	}
	
}

console.log(moveMap);


window.addEventListener("gamepadconnected", function(e) {
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
	    e.gamepad.index, e.gamepad.id,
	    e.gamepad.buttons.length, e.gamepad.axes.length);
	    gamepads[e.gamepad.index] = e.gamepad;
	    console.log(gamepads);
	});


window.addEventListener("gamepaddisconnected", function(e) {
		console.log("Gamepad disconnected from index %d: %s",
   		e.gamepad.index, e.gamepad.id);
   		delete gamepads[e.gamepad.index];
   		console.log(gamepads);
	});
		
		
AFRAME.registerComponent('extended-wasd-controls', {
	
	schema: 
	{
		moveForwardKey:     {type: 'string', default: "W"},
		moveBackKey:    {type: 'string', default: "S"},
		turnLeftKey:     {type: 'string', default: "A"},
		turnRightKey:    {type: 'string', default: "D"},
		
		
		rearView: {type: 'string', default: "R"},
		frontView: {type: 'string', default: "T"},

  		moveSpeed: {type: 'number', default: 6},  // A-Frame units/second
		turnSpeed: {type: 'number', default: 60}, // degrees/second
		lookSpeed: {type: 'number', default: 45},  // degrees/second
		
		parked:		 {type: 'string', default: "1"},
		drive:		 {type: 'string', default: "2"},
		reverse:		 {type: 'string', default: "3"},
		currentGear:	 {type: 'number', default: 1},

		inputType: {type: 'string', default: "keyboard"}
	},

	convertKeyName: function(keyName)
	{
		if (keyName == " ")
			return "Space";
		else if (keyName.length == 1)
			return keyName.toUpperCase();
		else
			return keyName;
	},

	registerKeyDown: function(keyName)
	{
		// avoid adding duplicates of keys
		if ( !this.keyPressedSet.has(keyName) )
        	this.keyPressedSet.add(keyName);
	},

	registerKeyUp: function(keyName)
	{
       	this.keyPressedSet.delete(keyName);
	},

	isKeyPressed: function(keyName)
	{
       	return this.keyPressedSet.has(keyName);
	},
	
	isEmpty: function (xVal, zVal)
	{
		let j = Math.round((xVal + 2.5*14)/5);
		let i = Math.round((zVal - 2.5*14)/-5);
	
		return moveMap[j][i]
	},
	
	switchGear: function (keyName) // Switching gear
	{
		this.data.currentGear = keyName;
		
		let text = document.querySelector("#text");
		text.innerHTML = `<a-text value="${this.data.currentGear}" position="-2.4 1.5 1" rotation="-52.64 90 0"></a-text>`;
	},
	
	switchView: function (keyName) // Switching Viewpoint
	{
		let cam_object = document.querySelector("#carcam")
		if (keyName == "T") {
			cam_object.setAttribute("position","-1 2 0.6");
		} else if (keyName == "R") {
			cam_object.setAttribute("position","2.4 2.2 0");
		}
	},
	
	restart: function () {
		console.log(moveMap);
		chooseName.cleanUp();
 		chooseName.divide(14, 14, 1, 1);
 		pickName.setup();
 		building_to_value();
 		this.el.object3D.position.set(30, 0.08, 0);
 		this.movePercent.x = 0;
	},

	init: function()
	{
		
		// register key down/up events 
		//  and keep track of all keys currently pressed
		console.log(gamepads)
		
		this.keyPressedSet = new Set();
				
		let self = this;
	
		
	
		document.addEventListener( "keydown", 
			function(eventData) 
			{ 
				
				var name = eventData.key;
				var code = eventData.code;
				self.registerKeyDown( self.convertKeyName(eventData.key) );
				
				if (name == 1 || name == 2 || name == 3) { self.switchGear(name); }
				if (self.convertKeyName(name) == "T" || self.convertKeyName(name) == "R") {self.switchView(self.convertKeyName(name));}
				
				
				if (name == "o") {
 					self.restart();
		 		}
				
			}
		);
		
		document.addEventListener( "keyup", 
			function(eventData) 
			{ 
				self.registerKeyUp( self.convertKeyName(eventData.key) );
			} 
		);

		

		// movement-related data

		this.moveVector  = new THREE.Vector3(0,0,0);
		this.movePercent = new THREE.Vector3(0,0,0);
		// z = left/right
		// x = forward/backward
		// y = up/down

		this.rotateVector  = new THREE.Vector2(0,0);
		this.rotatePercent = new THREE.Vector2(0,0);
		// y = turn angle
		// x = look angle

		// used as reference vector when turning
		this.upVector = new THREE.Vector3(0,1,0);
		
		// current rotation amounts
		this.turnAngle = 0; // around global Y axis
		this.lookAngle = 0; // around local X axis
		
		// allows easy extraction of turn angle
		this.el.object3D.rotation.order = 'YXZ';
	},
	

	tick: function (time, timeDelta) 
	{
		let moveAmount = (timeDelta/1000) * this.data.moveSpeed;
		
		// need to convert angle measures from degrees to radians
		let turnAmount = (timeDelta/1000) * THREE.Math.degToRad(this.data.turnSpeed);
		let lookAmount = (timeDelta/1000) * THREE.Math.degToRad(this.data.lookSpeed);
		// rotations
		
		// reset values
		let totalTurnAngle = 0;
		let totalLookAngle = 0;
		
		if (gamepads.length > 0) {
			if (navigator.getGamepads()[0].buttons[1].pressed) { this.switchGear(3); }
			if (navigator.getGamepads()[0].buttons[2].pressed) { this.switchGear(1); }
			if (navigator.getGamepads()[0].buttons[3].pressed) { this.switchGear(2); }
			
			if (navigator.getGamepads()[0].buttons[12].pressed) { this.switchView("T"); }
			if (navigator.getGamepads()[0].buttons[13].pressed) { this.switchView("R"); }
		}

		// need to reset rotatePercent values
		//   when querying which keys are currently pressed
		this.rotatePercent.set(0,0);

		if (this.isKeyPressed(this.data.turnLeftKey))
			this.rotatePercent.y += 1;
		if (this.isKeyPressed(this.data.turnRightKey))
			this.rotatePercent.y -= 1;
			
		if (gamepads.length > 0 && (navigator.getGamepads()[0].axes[2] > 0.4 || navigator.getGamepads()[0].axes[2] < -0.4)) {
			//console.log(navigator.getGamepads()[0].axes[2])
			//this.rotatePercent.x = navigator.getGamepads()[0].axes[3]
			this.rotatePercent.y = -navigator.getGamepads()[0].axes[2]
		}
				
		
		if ( this.data.currentGear != 1)
		{
			this.turnAngle += this.rotatePercent.y * turnAmount;
			this.el.object3D.rotation.y = this.turnAngle;
		}

		// translations

		// this only works when rotation order = "YXZ"
		let finalTurnAngle = this.el.object3D.rotation.y;
		//console.log(finalTurnAngle);
		
		let c = Math.cos(finalTurnAngle);
		let s = Math.sin(finalTurnAngle);

		// need to reset movePercent values
		//   when querying which keys are currently pressed
		this.movePercent.y = 0;
		if (this.movePercent.x -0.03 >= 0) { this.movePercent.x -= 0.03; } 
		if (this.movePercent.x +0.03 <= 0) { this.movePercent.x += 0.03; } 
		if (this.movePercent.x < 0.03 && this.movePercent.x > -0.03) { this.movePercent.x = 0; }
		
		//console.log(this.movePercent);

		// Moving Backwards and Forward 
		if (this.isKeyPressed(this.data.moveBackKey)) {
			//console.log(this.data.moveSpeed);
			if (this.data.currentGear == 2 && this.data.moveSpeed-1 > 0) { // Drive
				this.data.moveSpeed = 0;
			}
			this.movePercent.x = 1;
		}
			
		if (this.isKeyPressed(this.data.moveForwardKey)) {
			if (this.data.moveSpeed < 5) {
				this.data.moveSpeed += 0.1;
			}
			this.movePercent.x = -1;
		}
		
		if (gamepads.length > 0 && (navigator.getGamepads()[0].axes[1] > 0.4 || navigator.getGamepads()[0].axes[1] < -0.4)) {
			this.movePercent.x = -navigator.getGamepads()[0].axes[1];
		}

		// forward(-x) direction: [ -s,  0, -c ]
		//   right(-z) direction: [  c,  0, -s ]
		//      up(y) direction: [  0,  1,  0 ]
		// multiply each by (maximum) movement amount and percentages (how much to move in that direction)
		
		// Value of new location
		let loc = this.isEmpty(-s * this.movePercent.z + c * this.movePercent.x + this.el.object3D.position.x, -c * this.movePercent.z - s * this.movePercent.x + this.el.object3D.position.z) 
		
		let car = document.querySelector("#car-object")
		//console.log(loc)
		
		if (loc == 3) {this.restart(); }
		
		// Upwards
		if (loc == 2)
		{
			console.log(this.el.object3D.position.y);
			if (this.el.object3D.position.y < 0.7) {
				car.setAttribute("rotation", "0 0 -10")
				this.movePercent.y += 0.4;
			}
		} else if (this.el.object3D.position.y > 0.08){
			this.movePercent.y -= 0.3;
			car.setAttribute("rotation", "0 0 0")
		}

		if (loc == 1) {
			// If barrier, then no movement
			this.moveVector.set( 0, // x
								1 * this.movePercent.y, // y
								0); // z
								
		} else {
			if (this.data.currentGear == 1) { // Parked
				// no change in movement
			} else if (this.data.currentGear == 2) { // Drive
				// Only move forward
				if (this.movePercent.x > 0) {
					this.movePercent.x = 0;
				}
			
				this.moveVector.set( -s * this.movePercent.z + c * this.movePercent.x, // x
									  1 * this.movePercent.y, // y
									 -c * this.movePercent.z - s * this.movePercent.x ).multiplyScalar( moveAmount ); // z
			} else  if (this.data.currentGear == 3) { // Reverse
				// Only move backwards
				if (this.movePercent.x < 0) {
					this.movePercent.x = 0;
				}
			
				this.moveVector.set( -s * this.movePercent.z + c * this.movePercent.x, // x
									  1 * this.movePercent.y, // y
									 -c * this.movePercent.z - s * this.movePercent.x ).multiplyScalar( moveAmount ); // z
			}
			
			
		}
		// Update Movement
		//console.log(this.movePercent)
		//console.log(this.moveVector)
		this.el.object3D.position.add( this.moveVector );
	}
});