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

	Store.prototype.pushLog = function(log){
		this.log.push(log);
	}

	Store.prototype.setInitialData = function(data) {
		this.initialData = data;
	}

	Store.prototype.getInitialData = function(){
		return this.initialData;
	}

	return Store;
})();
