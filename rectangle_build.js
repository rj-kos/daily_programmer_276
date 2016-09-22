solution(process.argv[2],process.argv[3],process.argv[4]);

/*
this function will create the "building block" that other functions will use to construct our grid, it does this
by holding an array of arrays, each internal array is one line that will be printed to create the block.
"foo" would become [[0,1,2],[1,null,1],[2,1,0]] so that when our print function ultimately iterates over these arrays
we receive:
f o o
o   o
o o f
*/
function buildBlock(word){
	//array to hold the indexes of the letters in the word, so "foo" would be [0,1,2], "foobar" [0,1,2,3,4,5], etc.
	var origLetterIndexes = [];
	var letterCount = 0;
	while(word.length > letterCount){
		origLetterIndexes.push(letterCount);
		letterCount++;
	}
	var rowIndexes = [];
	for(i=0;i<origLetterIndexes.length;i++){
		//first row will just be the full array of indexes
		if(i==0){
			rowIndexes.push(origLetterIndexes);
		}
		/*
		this part gets tricky but it uses the original letter indexes to grab the "next letter" depending on what row
		we are on and the next letter counting backwards for the end of the row, this is how we get the middle arrays
		that have null values in between indexes in order to instruct the printer to just instert spaces
		*/ 
		if(i>0 && i<origLetterIndexes.length-1){
			rowIndexes[i]=[origLetterIndexes[i]];
			rowIndexes[i][origLetterIndexes.length-1] = rowIndexes[i-1][origLetterIndexes.length-1] - 1;
		}
		//last row will just be the reversed full array of indexes
		if(i==origLetterIndexes.length-1){
			rowIndexes[i]=reverseArray(origLetterIndexes);
		}
	}
	//our finished "building block" of arrays is returned
	return rowIndexes;
}

//quick usefull function for when we need to reverse these arrays
function reverseArray(arrayToRev){
	//using .slice() to create new instance of array, otherwise "reversed" would just reference the same array
	var reversed = arrayToRev.slice();
	reversed.reverse();
	return reversed;
}

/*
this function processes our block array from the "buildBlock" function by creating forward and backward facing
copies of the array and removing the first letter of each row so that it can be easily concatenated onto the array.
It then either appends the array way a forward facing block or a backward facing block based on how wide it needs to be,
alternating between tacking each on there so that you get "c a r a c a r a c" from "car", not "c a r r a c c a r". This
function is built to handle the "width" part of the block.
*/
function buildOver(block,width){
	if(width>1){
		var reverseBlock = [];
		var forwardBlock = [];
		for(i=0;i<block.length;i++){
			forwardBlock[i] = block[i].slice();
			//cut off first letter of the row
			forwardBlock[i].shift();
			reverseBlock[i] = reverseArray(block[i]).slice();
			//cut off first letter of the row
			reverseBlock[i].shift();
		}
		for(i=2;i<=width;i++){
			if(i%2==0){
				for(j=0;j<block.length;j++){
					block[j] = block[j].concat(reverseBlock[j]);
				}
			}
			if(i%2!=0){
				for(j=0;j<block.length;j++){
					block[j] = block[j].concat(forwardBlock[j]);
				}
			}
		}
	}
	return block;
}

/*
this function does the final processing of our block, it is meant to receive the output from "buildOver" and it follows very
similar logic to that function. It's an easier process however as this function only needs to flip the order of the nested arrays
rather than the indexes within the arrays themselves. Additionally, and also similarly, it cuts off the first array from the
forward and backward copies that it creates so that they can be easily appended.
*/
function buildDown(block,height){
	if(height>1){
		var reverseBlock = reverseArray(block);
		//remove first array
		reverseBlock.shift();
		var forwardBlock = block.slice();
		//remove first array
		forwardBlock.shift();

		for(i=2;i<=height;i++){
			if(i%2==0){
				block = block.concat(reverseBlock);
			}
			if(i%2!=0){
				block = block.concat(forwardBlock);
			}
		}
	}
	return block;
}

/*
this function is pretty straightforward, it receives the FINAL array of arrays and loops through it printing
the letters from the word that was given as an argument based on their indexes
*/
function printRectangle(wordIndexArray,word){
	for(i=0;i<wordIndexArray.length;i++){
		var currRow = wordIndexArray[i];
		var currRowPrint = '';
		for(j=0;j<currRow.length;j++){
			if(currRow[j]>=0){
				currRowPrint += word[currRow[j]] + ' ';
			}
			if(currRow[j]==null){
				currRowPrint += '  ';
			}
		}
		console.log(currRowPrint);
	}
}

//this slaps all of our functions together
function solution(word,width,height){
	return printRectangle(buildDown(buildOver(buildBlock(word),width),height),word);
}