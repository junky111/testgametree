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
		this.store.setInitialData(data);
		this.store.setCategories(data.match(REGEXP_MATCH_BRACKETS_DATA));
	};

	Processor.prototype.parseCategoryOptions = function(){
		let data = this.store.getData();

		for(let i in data) {	
			let options = data[i].data.split(REGEXP_MATCH_OPTIONS);
			options = options.map(option => option.replace('\n',''));
			this.store.setCategoriesOptions(
				data[i].index,
				options,
			);
		}
	};

	Processor.prototype.log = function(){
		let categoriesOptions = this.store.getCategoriesOptions();
		let c = 1;
		let divs = [];
		divs[categoriesOptions.length-1] = 1;

		for(let i = categoriesOptions.length-2; i >=0 ; i--){
			divs[i]=divs[i+1]*categoriesOptions[i].length;
		}

		for(let i = 0; i< categoriesOptions.length; i++){
			c*=categoriesOptions[i].length;
		}

		let j = 0;
		let results=[];
		while (j<c){
			results.push(this.store.getInitialData());
			for(let k =0; k<categoriesOptions.length; k++){
				let replaceIndex = Math.floor((j/divs[k])%(categoriesOptions[k].length));
				let category=this.store.getCategories()[k];
				results[results.length-1] = results[results.length-1]
											.replace(new RegExp('\\['+category+'\\]','g'), categoriesOptions[k][replaceIndex]);
			}
			j++;
		}
	};

	return Processor;
})();