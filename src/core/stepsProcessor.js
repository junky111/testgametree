import {
	REGEXP_MATCH_BRACKETS_DATA,
	REGEXP_MATCH_OPTIONS,
} from './regexpConfig';

/**
 * Processor of application. Functional core of data manipulation.  
 * @return {Constructor}  contructor of Processor.         
 */
export let Processor = (function(){
	function Processor(store){
		this.store = store;
	}

	Processor.prototype.getActionByStep = function(step){
		if(this[step]) return this[step];
	}

	Processor.prototype.parseCategories = function(){
		let data = this.store.getData();
		
		let matchResults = data.match(REGEXP_MATCH_BRACKETS_DATA);
		if(!matchResults) matchResults=[];

		this.store.setCategories(
			this.store.createUniqueArr(
				matchResults
			)
		);
	};

	Processor.prototype.parseCategoryOptions = function(){
		let data = this.store.getData();

		for(let i in data) {	
			let options = data[i].data.split(REGEXP_MATCH_OPTIONS);
			options = this.store.createUniqueArr(
				options.map(option => option.replace('\n',''))
			);

			this.store.setCategoriesOptions(
				data[i].index,
				options,
			);
		}
	};

	Processor.prototype.log = function(){
		let categoriesOptions = this.store.getCategoriesOptions();
		let results = getAllCombinations(categoriesOptions, results);

		let strResults = [];

		for(let i in results){
			strResults.push(this.store.getInitialData());
			for(let j in results[i]){
				let category=this.store.getCategories()[j];
				strResults[strResults.length-1] = strResults[strResults.length-1]
															.replace(
																new RegExp('\\['+category+'\\]','g'),
																results[i][j]
															);			
			}
		}

		this.store.pushLogs(strResults);
	};

	function getAllCombinations(arraysToCombine) {
		var divisors = [];
		for (var i = arraysToCombine.length - 1; i >= 0; i--) {
		    divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
		}

		function getPermutation(n, arraysToCombine) {
		    var result = [], 
		   		curArray;    
		    for (var i = 0; i < arraysToCombine.length; i++) {
		        curArray = arraysToCombine[i];
		       	result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
			}    
		    return result;
		} 

		var numPerms = arraysToCombine[0].length;
		for(var i = 1; i < arraysToCombine.length; i++) {
			numPerms *= arraysToCombine[i].length;
		}

		let results=[];
		for(var i = 0; i < numPerms; i++) {
		    results.push(getPermutation(i, arraysToCombine));
		}

		return results;
	}

	return Processor;
})();