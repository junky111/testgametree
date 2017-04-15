export let Processor = (function(){
	function Processor(store){
		this.store = store;
	}

	Processor.prototype.getActionByStep = function(step){
		if(this[step]) return this[step];
	}

	Processor.prototype.parseCategories=function(){

	};

	Processor.prototype.parseCategoryOptions=function(){

	};

	Processor.prototype.log=function(){

	};

	return Processor;
})();