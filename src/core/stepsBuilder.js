import {STEPS} from './stepsConfig';

export let Builder = (function(){

	let $stepOneDiv;
	let $stepTwoDiv;
	let $stepThreeDiv;
	let $body = document.body;

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
		this.draw(this.steps[this.getCurrentStep()], this.getCurrentStep());
	}	

	
	/** DOM operations **/

	
	/**
	 * Creates the first input. Where the categories will be set. 
	 * Build the DOM.
	 * @param  {Function} action - function of Processor. Parse data from the global store.
	 * @param  {Function} next - function of Builder. Build the next step. 
	 * @return {undefined}
	 */
	Builder.prototype.initInput = function(action, next, currentStep){
		$stepOneDiv = document.createElement('div');
		$stepOneDiv.setAttribute('class', 'form-group');

		let input = document.createElement('textarea');
			input.setAttribute('class', 'form-control');

		let button = document.createElement('button');
			button.innerHTML = "Submit";
			button.setAttribute('class', 'btn btn-info');
			button.onclick = ()=>{
				// get input data;
				let data = input.value;

				// set to the global store;
				this.store.setData(data);

				// set as initial data to the global store. Will use on logging.
				this.store.setInitialData(data);
				
				// if will be clicked on the other button (not next button).
				if(this.currentStep != currentStep){
					this.currentStep=currentStep;

					if($body.contains($stepTwoDiv)) $body.removeChild($stepTwoDiv);
					if($body.contains($stepThreeDiv)) $body.removeChild($stepThreeDiv);
					
					this.store.clearCategoriesOptions();
					this.store.clearLogs();
				}

				// process data from the store, build the next step;
				if(action && typeof action == 'function') action();
				if(next && typeof next == 'function') next();
			};

		$body.append($stepOneDiv);
		$stepOneDiv.append(input);
		$stepOneDiv.append(button);
	}


	Builder.prototype.initCategoryInputs = function(action, next, currentStep){
		

		let categories = this.store.getCategories();
		$stepTwoDiv = document.createElement('div');
		$stepTwoDiv.setAttribute('class', 'form-group');
		let domCategories = [];

		for(let i=0 ;i<categories.length; i++){
			let container = document.createElement('div');
				container.setAttribute('class', 'form-group');
			let label = document.createElement('label');
				label.setAttribute('class', 'form-control');
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
					if($body.contains($stepThreeDiv)) $body.removeChild($stepThreeDiv);
					this.store.clearLogs();
				}

				// process data from the store, build the next step;
				if(action && typeof action == 'function') action();
				if(next && typeof next == 'function') next();
			};
		
		$stepTwoDiv.append(button);

		$body.append($stepTwoDiv);
	}

	Builder.prototype.log = function(action, next, currentStep){
		if(action && typeof action == 'function') action();
		if(this.currentStep != currentStep){
			this.currentStep=currentStep;
			if($body.contains($stepThreeDiv)) $body.removeChild($stepThreeDiv);
			this.store.clearLogs();
		}
	}

	return Builder;
})();
