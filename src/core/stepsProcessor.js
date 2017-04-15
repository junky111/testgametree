import {
	REGEXP_MATCH_BRACKETS_DATA,
	REGEXP_MATCH_OPTIONS,
} from './regexpConfig';


export let Processor = (function(){
	function Processor(store){
		this.store = store;
	}

	Processor.prototype.getActionByStep = function(step){
		if(this[step]) return this[step];
	}

	Processor.prototype.parseCategories = function(){
		let data = this.store.getData();
		data="Above Grade Level delivery [method] quality tutoring assistance with some of the best [subject] tutors in [location].";
		this.store.setCategories(data.match(REGEXP_MATCH_BRACKETS_DATA));
		console.log(this.store.getCategories());
	};

	Processor.prototype.parseCategoryOptions = function(){
		let data = this.store.getData();

		for(let i in data) {	
			let options = data[i].data.split(REGEXP_MATCH_OPTIONS);
			options = options.map(option => option.replace('\n',''));
			this.store.setCategoriesOptions(
				this.store.getCategories()[data[i].index],
				options,
			);
		}
	};

	Processor.prototype.log = function(){

	};

	return Processor;
})();