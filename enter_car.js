AFRAME.registerComponent('car-enter', {
    // Could use a schem to preserve the color! then simply change it on update
    // if clicked?

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

    EnterCar: function (keyName) // Switching Viewpoint
	{
		if (keyName == "E") {
			document.getElementById("head").setAttribute('camera','near:0.01;active: false');
            document.getElementById("carcam").setAttribute('camera','near:0.01;active: true');
		} else if (keyName == "G") {
            document.getElementById("car-object").setAttribute('extended-wasd-controls', 'currentGear:1')
            document.getElementById("carcam").setAttribute('camera','near:0.01;active: false');
			document.getElementById("head").setAttribute('camera','near:0.01;active: true');
		}
	},
    init: function () {

    this.keyPressedSet = new Set();
				
	let self = this;


    document.addEventListener( "keydown", 
    function(eventData) 
    { 
        /* console.log(document.getElementById("car-object").object3D.position.distanceTo(document.getElementById("cameraRig").object3D.position)) */
        var name = eventData.key;
        var code = eventData.code;
        self.registerKeyDown( self.convertKeyName(eventData.key) );
        if(document.getElementById("car-object").object3D.position.distanceTo(document.getElementById("cameraRig").object3D.position) < 4){

            
            if (self.convertKeyName(name) == "E" || self.convertKeyName(name) == "G") {self.EnterCar(self.convertKeyName(name));}

        }else if(self.convertKeyName(name) == "G"){

            self.EnterCar(self.convertKeyName(name));

        }else{
            console.log('Distance from car too far')
        }
            
        }
    );

    document.addEventListener( "keyup", 
			function(eventData) 
			{ 
				self.registerKeyUp( self.convertKeyName(eventData.key) );
			} 
		);




    this.el.addEventListener('click', function (evt) {
      console.log(this.object3D.position.distanceTo(document.getElementById("cameraRig").object3D.position))

      console.log('I was clicked at: ', evt.detail.intersection.point, "and my new color is: ");

    });
    }
    });



/*     AFRAME.registerComponent('enter-on-click', {
        // Could use a schem to preserve the color! then simply change it on update
        // if clicked?
        init: function () {
        this.el.addEventListener('click', function (evt) {
          document.getElementById("head").setAttribute('camera','near:0.01;active: false')
          document.getElementById("carcam").setAttribute('camera','near:0.01;active: true')
          console.log('I was clicked at: ', evt.detail.intersection.point, "and my new color is: ");
        });
        }
        });
 */



