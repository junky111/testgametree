/**
 * Store of application. Store data and provide this data to all necessary components.  
 * @return {Constructor}  contructor of Store.         
 */
export let Store=(function(){
	/**
	 * Storage of data.
	 */
	function Store(){
		// data from each step before processing.
		// can be string (on the first step) 
		// and array on the second step
		// @example 
		//  [ {index, data} ]
		this.data = "";
		// string from the first input.
		this.initialData = "";
		this.categories = [];
		this.categoriesOptions = [];
		this.log = [];
	};

	/**
	 * Set data.
	 * @param {String || Array{ Object, Object, .. }} data - data, came from Builder. 
	 */
	Store.prototype.setData = function(data) {
		this.data = data;
	}

	/**
	 * Get data
	 * @return {String || Array{ Object, Object, .. }} data - data, came from Builder. 
	 */
	Store.prototype.getData = function() {
		return this.data;
	}	

	/**
	 * Set categories.
	 * @param { Array } categories - array of categories, matched from processing of the string.
	 */
	Store.prototype.setCategories = function(categories){
		if(!categories) this.categories = [];
		else this.categories = categories;
	}

	/**
	 * Get categories.
	 * @return { Array } categories
	 */
	Store.prototype.getCategories = function(){
		return this.categories;
	}

	/**
	 * Set categories' options.
	 * @param { int } category             	- index of category.
	 * @param { Array } categoriesOptions 	- array of options.
	 */
	Store.prototype.setCategoriesOptions = function(category, categoriesOptions){
		this.categoriesOptions[category] = categoriesOptions;
	}	

	/**
	 * Get categories' options.
	 * @return { Array } categoriesOptions 	- array of options.
	 */
	Store.prototype.getCategoriesOptions = function(){
		return this.categoriesOptions;
	}

	/**
	 * Reset categoriesOptions. 
	 */
	Store.prototype.clearCategoriesOptions = function(){
		this.categoriesOptions=[];
	}

	/**
	 * Reset logs.
	 */
	Store.prototype.clearLogs = function(){
		this.log = [];
	}

	/**
	 * Set logs.
	 * @param  { Array } logs - array of string of combinations.
	 */
	Store.prototype.pushLogs = function(logs){
		this.log = logs;
	}

	/**
	 * Get logs.
	 * @return { Array } - array of string of combinations.
	 */
	Store.prototype.getLogs = function(){
		return this.log;
	}
	
	/**
	 * Set initial string.
	 * @param {String} data - initial string with brackets.
	 */
	Store.prototype.setInitialData = function(data) {
		this.initialData = data;
	}

	/**
	 * Get initial string.
	 * @return {string} initial string with brackets.
	 */
	Store.prototype.getInitialData = function(){
		return this.initialData;
	}

	/** HELPERS **/

	/**
	 * Makes all elements of array unique.
	 * @param  { Array } a 	- array to make consists of unique elements.
	 * @return { Array }    - array of unique values. 
	 */
	Store.prototype.createUniqueArr = function(a) {
	    var temp = {};
	    for (var i = 0; i < a.length; i++)
	        temp[a[i]] = true;
	    return Object.keys(temp);
	}

	return Store;
})();
