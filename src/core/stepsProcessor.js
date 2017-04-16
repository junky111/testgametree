import {
	REGEXP_MATCH_BRACKETS_DATA,
	REGEXP_MATCH_OPTIONS,
} from './regexpConfig';

/**
 * Processor of application. Functional core of data manipulation.  
 * @return {Constructor}  contructor of Processor.         
 */
export let Processor = (function(){
	
	/**
	 * Constructor Processor. Creates a new instance of Processor.
	 * @param {Store} store. Store instance. Data storage. Data bridge between Builder and Processor.
	 */
	function Processor(store){
		this.store = store;
	}

	/**
	 * Gets action by the name in the step.
	 * @param  {String} step - action name.
	 * @example - parseCategories
	 * @return {Function || undefined} - Processor function, if it exists.
	 */
	Processor.prototype.getActionByStep = function(step){
		if(this[step]) return this[step];
	}

	/**
	 * Parse string and search data in square brackets ([]).
	 */
	Processor.prototype.parseCategories = function(){
		// get string from storage.
		let data = this.store.getData();
		
		// search all matches in the string by RegExp. 
		let matchResults = data.match(REGEXP_MATCH_BRACKETS_DATA);
		// if no matches, set an empty array instead of null.
		if(!matchResults) matchResults=[];

		// set categories by matched values.
		this.store.setCategories(
			// make all values unique.
			this.store.createUniqueArr(
				matchResults
			)
		);
	};

	/**
	 * Parse all categories' strings for categories' options.
	 */
	Processor.prototype.parseCategoryOptions = function(){
		// get data from storage. 
		// data = [ { index : int , data : String }, .. ]
		let data = this.store.getData();

		for(let i in data) {	
			// split string to options by RegExp, matching for new line.
			let options = data[i].data.split(REGEXP_MATCH_OPTIONS);
			// make options unique. 
			options = this.store.createUniqueArr(
				//remove \n symbols, where they are still present.
				options.map(option => option.replace('\n',''))
			);

			// set options by category index
			this.store.setCategoriesOptions(
				// category index
				data[i].index,
				// array of options
				options,
			);
		}
	};

	/**
	 * Creates all possible combinations of categories' options.
	 */
	Processor.prototype.log = function(){
		let categoriesOptions = this.store.getCategoriesOptions();
		// get all combinations as array of indexes.
		// @example
		// 	results = [
		// 		[0, 0, 0],
		// 		[0, 0, 1],
		// 	]
		let results = getAllCombinations(categoriesOptions, results);

		let strResults = [];

		for(let i in results){
			// push string to replace to log array.
			strResults.push(this.store.getInitialData());
			for(let j in results[i]){
				let category=this.store.getCategories()[j];
				// replace category name with option by option index from result array.
				strResults[strResults.length-1] = strResults[strResults.length-1].replace(
													// find all matches.
													new RegExp('\\['+category+'\\]','g'),
													// option to paste
													results[i][j]
												);			
			}
		}

		// push logs to the storage.
		this.store.pushLogs(strResults);
	};

	/**
	 * Get all possible combinations in the array of arrays 
	 * @param  { Array { Array, Array, .. } } arraysToCombine - arrays is necessary to combine.
	 * @return {Array} - all possible combinations.
	 */
	function getAllCombinations(arraysToCombine) {
		let divisors = [];
		for (let i = arraysToCombine.length - 1; i >= 0; i--) {
		    divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
		}

		/**
		 * Get permutation for permutation number from arrays to combine.
		 * @param  {int} n  - number of permutation.
		 * @param  { Array { Array, Array, .. } } arraysToCombine - arrays is necessary to combine.
		 * @return { Array } - all combinations of permutation.
		 */
		function getPermutation(n, arraysToCombine) {
		    let result = [], 
		   		curArray;    
		    for (let i = 0; i < arraysToCombine.length; i++) {
		        curArray = arraysToCombine[i];
		       	result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
			}    
		    return result;
		} 

		let numPerms = arraysToCombine[0].length;
		for(let i = 1; i < arraysToCombine.length; i++) {
			// counts the number of all possible permutations.
			numPerms *= arraysToCombine[i].length;
		}

		let results=[];
		for(let i = 0; i < numPerms; i++) {
			// counts all possible combinations (permutations).
		    results.push(getPermutation(i, arraysToCombine));
		}

		return results;
	}

	return Processor;
})();