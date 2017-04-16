export let Store=(function(){
	
	function Store(){
		this.data = "";
		this.initialData = "";
		this.categories = [];
		this.categoriesOptions = [];
		this.log = [];
	};

	Store.prototype.setData = function(data) {
		this.data = data;
	}

	Store.prototype.getData = function() {
		return this.data;
	}	

	Store.prototype.setCategories = function(categories){
		if(!categories) this.categories = [];
		else this.categories = categories;
	}

	Store.prototype.getCategories = function(){
		return this.categories;
	}

	Store.prototype.setCategoriesOptions = function(category, categoriesOptions){
		this.categoriesOptions[category] = categoriesOptions;
	}	

	Store.prototype.getCategoriesOptions = function(){
		return this.categoriesOptions;
	}

	Store.prototype.clearCategoriesOptions = function(){
		this.categoriesOptions=[];
	}

	Store.prototype.clearLogs = function(){
		this.log = [];
	}

	Store.prototype.pushLogs = function(logs){
		this.log = logs;
	}

	Store.prototype.getLogs = function(){
		return this.log;
	}
	
	Store.prototype.setInitialData = function(data) {
		this.initialData = data;
	}

	Store.prototype.getInitialData = function(){
		return this.initialData;
	}

	// HELPER ... 
	Store.prototype.createUniqueArr = function(a) {
	    var temp = {};
	    for (var i = 0; i < a.length; i++)
	        temp[a[i]] = true;
	    return Object.keys(temp);
	}

	return Store;
})();
