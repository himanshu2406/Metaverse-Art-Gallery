let map = document.querySelector("#map")
import * as chooseName from './map_maker.js';
//console.log(chooseName.city)

let colors = ["red", "blue", "green", "orange"]
setup();

export {setup};

function setup () {
	map.innerHTML="";

	for (let i = 0; i < chooseName.city.length; i++) {
		for (let j = 0; j < chooseName.city[0].length; j++) {
			let x = (i * 5) - (2.5 * (chooseName.city.length-1))
			// y is set in each building type
			let z = -j * 5 + (2.5 * (chooseName.city.length-1))
			let val = chooseName.city[i][j];
			
			addbuilding(val, x, z);
	}
}
	
function addEntity(id, isModel, model, position, scale, rotation) {
    const entity = document.createElement('a-entity');
    entity.setAttribute('id', id);
    
    if (isModel == 1) {
    	entity.setAttribute('gltf-model', model);
    } else if (isModel == 0){
    	entity.setAttribute('geometry', 'primitive: plane');
    	entity.setAttribute('material', `src: ${model}`);
    	//entity.setAttribute('shadow', 'receive: true;');
    } else if (isModel == 2) {
    	entity.setAttribute('geometry', 'primitive: box');
    	entity.setAttribute('material', `color: ${model}`);
    	//entity.setAttribute('shadow', 'cast: true;');
    }
    entity.setAttribute('position', position);
    entity.setAttribute('scale', scale);
    entity.setAttribute('rotation', rotation);
    map.appendChild(entity);
    //map.after(entity)
} 	

	function addbuilding(val, x, z) {
		if (val == 0) {
			// Free Space for now
		} else if (val == 1) { // Small building
			let y = 0
			addEntity("house_ver1", 1, "#house", `${x} ${y} ${z}`, "0.8 0.8 0.8", "0 0 0")
			
		} else if (val == 2) { // Small building
			let y = 0
			addEntity("house_ver2", 1, "#house_2", `${x} ${y} ${z}`, "1.8 1.8 1.8", "0 90 0");
		} else if (val == 3) { // Small building
			let y = 0
			addEntity("house_ver1", 1, "#house", `${x} ${y} ${z}`, "0.8 0.8 0.8", "0 180 0")
		} else if (val == 4) { // Small building
			let y = 0
			addEntity("house_ver2", 1, "#house_2", `${x} ${y} ${z}`, "1.8 1.8 1.8", "0 270 0");
		} 
		
		else if (val == 5) { // road
			let y = 0.1
			addEntity("road_obj", 0, "#road", `${x} ${y} ${z}`, "5 5 0.5", "-90 0 0")
		} else if (val == 5.5) { // road
			let y = 0.1
			addEntity("road_obj", 0, "#roadLines", `${x} ${y} ${z}`, "5 5 0.5", "-90 90 0")
		} else if (val == 6) { // Town border
			let y = 0
			addEntity("border_obj", 1, "#border", `${x} ${y} ${z}`, "2 2 2", "0 180 0");
		} else if (val == 7) { // Town border
			let y = 0
			addEntity("border_obj", 1, "#border", `${x} ${y} ${z}`, "2 2 2", "0 270 0");
		} else if (val == 8) { // Town border
			let y = 0
			addEntity("border_obj", 1, "#border", `${x} ${y} ${z}`, "2 2 2", "0 0 0");
		} else if (val == 9) { // Town border
			let y = 0
			addEntity("border_obj", 1, "#border", `${x} ${y} ${z}`, "2 2 2", "0 90 0");
		}
		
		else if (val == 10) { // grass color="#38F56B"
			let y = 0.1
			addEntity("grass_obj", 0, "#grass", `${x} ${y} ${z}`, "5 5 0.5", "-90 0 0")
		} else if (val == 11) {
			let y = 2.25;
			addEntity("warp", 2, "black", `${x} ${y} ${z}`, "5 5.5 5", "0 0 0")
		} else if (val == 13) {
			let y = 0;
			addEntity("road_obj", 0, "#road", `${x} 0.1 ${z}`, "5 5 0.5", "-90 0 0")
			addEntity("ramp", 2, "blue", `${x} ${y} ${z}`, "3 4 1", "80 -90 0")
			//<a-box color="blue" height="4" width="3" depth="1" position="-10 0 5" rotation="80 180 0"></a-box>
		}
		
	}

}