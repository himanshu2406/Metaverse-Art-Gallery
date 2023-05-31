// city array - holds all the objects of the city


var city = [[6, 9, 9, 9, 9, 9, 9, 11, 9, 9, 9, 9, 9, 9, 8],
			[6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8],
			[6, 5.5, 10, 10, 10, 10, 10, 5.5, 10, 10, 10, 10, 10, 5.5, 8],
			[6, 5.5, 10, 10, 10, 10, 10, 13, 10, 10, 10, 10, 10, 5.5, 8],
			[6, 5.5, 10, 10, 10, 10, 10, 5.5, 10, 10, 10, 10, 10, 5.5, 8],
			[6, 5.5, 10, 10, 10, 10, 10, 13, 10, 10, 10, 10, 10, 5.5, 8],
			[6, 5.5, 10, 10, 10, 10, 10, 5.5, 10, 10, 10, 10, 10, 5.5, 8],
			[6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8],
			[6, 5.5, 1, 4, 5.5, 1, 4, 5.5, 1, 1, 4, 5.5, 1, 4, 8],
			[6, 5.5, 1, 3, 5.5, 1, 3, 5.5, 2, 0, 3, 5.5, 1, 0, 8],
			[6, 5.5, 1, 3, 5.5, 1, 3, 5.5, 2, 2, 2, 5.5, 1, 0, 8],
			[6, 5.5, 1, 3, 5.5, 1, 3, 5.5, 5, 5, 5, 5, 1, 0, 8],
			[6, 5.5, 2, 3, 5.5, 2, 3, 5.5, 1, 4, 4, 4, 4, 0, 8],
			[6, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 8],
			[6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8]]

function cleanUp() {
	for (let i = 0; i < city.length; i++) {
		for (let j = 0; j < city[0].length; j++) {
			let value = city[i][j]; // currentValue for getting only (cant be set) 
			
			if (i == 0 || j == 0 || i == 14 || j == 14) {
				if (i == 0 && j == 7) {
					city[i][j] = 11
				} else if (i == 14 && j == 7) {
					city[i][j] = 11
				} else {
					city[i][j] = 6;
				}
			} else {
				city[i][j] = 1;
			}
			
			
		}
	}
}
//console.log(city);

function verticalRoad (maxY, minY, x) {
	for (let i = minY; i < maxY; i++) {
		city[i][x] = 5;
	}
}

function horizontalRoad (maxX, minX, y) {
	for (let i = minX; i < maxX; i++) {
		city[y][i] = 5;
	}
}

function divide (maxX, maxY, minX, minY) {
	//console.log(city);
	let dx = maxX - minX;
	let dy = maxY - minY;

	let split;
	
	if (dx > 4 || dy > 4) {
		if (dx == dy) {
			split = Math.floor((maxX+minX)/2);//Math.floor(Math.random() * dx) + minX;
			verticalRoad(maxY, minY, split);
			
			divide(maxX, maxY, split+1, minY); 
			divide(split-1, maxY, minX, minY);
		}
		if (dx > dy) {
			split = Math.floor(Math.random() * dx) + minX;
			verticalRoad(maxY, minY, split);
			
			divide(maxX, maxY, split+1, minY);
			divide(split-1, maxY, minX, minY);
		} else {
			split = Math.floor(Math.random() * dy) + minY;
			console.log(split)
			horizontalRoad(maxX, minX, split);
			
			divide(maxX, maxY, minX, split+1);
			divide(maxX, split-1, minX, minY);
		}
	} 
}
export{city, cleanUp, divide};