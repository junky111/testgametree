import {STEPS} from './stepsConfig';

export let Builder = (function(){

	let $stepOneDiv;
	let $stepTwoDiv;
	let $stepThreeDiv;
	let $container;


	function Builder(processor, store){
		this.currentStep=0;
		this.processor = processor;
		this.store = store;
	}

	Builder.prototype.steps=STEPS;

	Builder.prototype.getSteps = function(){
		return this.steps;
	}

	Builder.prototype.getCurrentStep = function(){
		return this.currentStep;
	}

	Builder.prototype.draw = function(actionPair, currentStep){
		if(actionPair && this[actionPair.build] && this.processor[actionPair.exec]) {
			this[actionPair.build](
				this.processor[actionPair.exec].bind(this.processor),
				() => this.nextStep(),
				currentStep,
			);
		}
	}

	Builder.prototype.nextStep = function(){
		if(this.currentStep+1 < this.steps.length){
			
			this.currentStep++;
			this.draw(this.steps[this.getCurrentStep()], this.getCurrentStep());
		}
	}
	
	Builder.prototype.init = function(){
		this.initContainer();
		this.draw(this.steps[this.getCurrentStep()], this.getCurrentStep());
	}	

	
	/** DOM operations **/

	Builder.prototype.initContainer = function(){
		$container = document.createElement('div');
		$container.setAttribute('class', 'container');
		document.body.append($container);
	}
	
	/**
	 * Creates the first input. Where the categories will be set. 
	 * Build the DOM.
	 * @param  {Function} action - function of Processor. Parse data from the global store.
	 * @param  {Function} next - function of Builder. Build the next step. 
	 * @return {undefined}
	 */
	Builder.prototype.initInput = function(action, next, currentStep){
		$stepOneDiv = document.createElement('div');
		$stepOneDiv.setAttribute('class', 'row');

		let div = getFormGroupDiv();

		let input = document.createElement('textarea');
			input.setAttribute('class', 'form-control');

		let button = document.createElement('button');
			button.innerHTML = "Submit";
			button.setAttribute('class', 'btn btn-info');
			button.onclick = ()=>{
				// get input data;
				let data = input.value ? input.value : "";
				console.log(data);

				// set to the global store;
				this.store.setData(data);

				// set as initial data to the global store. Will use on logging.
				this.store.setInitialData(data);
				
				// if will be clicked on the other button (not next button).
				if(this.currentStep != currentStep){
					this.currentStep=currentStep;

					if($container.contains($stepTwoDiv)) $container.removeChild($stepTwoDiv);
					if($container.contains($stepThreeDiv)) $container.removeChild($stepThreeDiv);
					
					this.store.clearCategoriesOptions();
					this.store.clearLogs();
				}

				// process data from the store, build the next step;
				if(action && typeof action == 'function') action();
				if(next && typeof next == 'function') next();
			};

		let buttonDiv = getFormGroupDiv();
		buttonDiv.append(button);
		
		div.append(input);
		$container.append($stepOneDiv);
		$stepOneDiv.append(div);
		$stepOneDiv.append(buttonDiv);
	}


	Builder.prototype.initCategoryInputs = function(action, next, currentStep){
		

		let categories = this.store.getCategories();
		if(!categories.length) return;

		$stepTwoDiv = document.createElement('div');
		$stepTwoDiv.setAttribute('class', 'row');
		let domCategories = [];

		for(let i=0 ;i<categories.length; i++){
			let container = getFormGroupDiv();
			let label = document.createElement('label');
				// label.setAttribute('class', 'control-label');
				label.innerHTML = categories[i] + ":";
			let textarea = document.createElement('textarea');
				textarea.setAttribute('class', 'form-control');
				textarea.setAttribute('id', i);

			container.append(label);
			container.append(textarea);
			$stepTwoDiv.append(container);
			
			domCategories.push({index:i, category: textarea});
		}


		let button = document.createElement('button');
			button.innerHTML = "Submit";
			button.setAttribute('class', 'btn btn-info');
			button.onclick = () => {
				// get input data;
				let data = domCategories.map(item => {
					return {index: item.index, data: item.category.value};
				});

				// set to the global store;
				this.store.setData(data);

				// if will be clicked on the other button (not next button).
				if(this.currentStep != currentStep){
					this.currentStep=currentStep;
					if($container.contains($stepThreeDiv)) $container.removeChild($stepThreeDiv);
					this.store.clearLogs();
				}

				// process data from the store, build the next step;
				if(action && typeof action == 'function') action();
				if(next && typeof next == 'function') next();
			};
		
		let buttonDiv = getFormGroupDiv();
		buttonDiv.append(button);
		$stepTwoDiv.append(buttonDiv);

		$container.append($stepTwoDiv);
	}

	Builder.prototype.log = function(action, next, currentStep){
		if(this.currentStep != currentStep){
			this.currentStep=currentStep;
			if($container.contains($stepThreeDiv)) $container.removeChild($stepThreeDiv);
			this.store.clearLogs();
		}
		if(action && typeof action == 'function') action();

		let logs = this.store.getLogs();

		let $logs = logs.map(log => {
			let blockquote = document.createElement('blockquote');
			let l = document.createElement('p');
				l.innerHTML = log;
			blockquote.append(l);
			return blockquote;
		});

		$stepThreeDiv = document.createElement('div');
		$stepThreeDiv.setAttribute('class', 'row');

		let div = getFormGroupDiv();

		$logs.map($log=>div.append($log));
		$stepThreeDiv.append(div);
		$container.append($stepThreeDiv);
	}


	function getFormGroupDiv(){
		let div = document.createElement('div');
			div.setAttribute('class', 'form-group');
		return div;
	}

	return Builder;
})();
