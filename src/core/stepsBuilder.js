import {STEPS} from './stepsConfig';

export let Builder = (function(){

	/** Helper functions **/

	function functionName(func){
	    let result = /^function\s+([\w\$]+)\s*\(/.exec( func.toString() )
	    return  result  ?  result[ 1 ]  :  '';
	}


	function Builder(processor, store){
		this.currentStep=0;
		this.processor = processor;
		this.store = store;
		// this.steps = STEPS;
		console.log(this.steps);
	}

	Builder.prototype.steps=STEPS;

	Builder.prototype.getSteps = function(){
		return this.steps;
	}

	Builder.prototype.getCurrentStep = function(){
		return this.currentStep;
	}

	Builder.prototype.draw = function(actionPair){
		if(actionPair && this[actionPair.build] && this.processor[actionPair.exec]) {
			this[actionPair.build](this.processor[actionPair.exec], this.nextStep);
		}
	}

	Builder.prototype.nextStep = function(){
		if(this.currentStep+1 < this.steps.length){
			this.currentStep++;
			this.draw(this.steps[this.getCurrentStep()]);
		}
	}
	
	Builder.prototype.init = function(){
		this.draw(this.steps[this.getCurrentStep()]);
	}	

	
	/** DOM operations **/

	
	/**
	 * Creates the first input. Where the categories will be set. 
	 * Build the DOM.
	 * @param  {Function} action - function of Processor. Parse data from the global store.
	 * @param  {Function} next - function of Builder. Build the next step. 
	 * @return {undefined}
	 */
	Builder.prototype.initInput = function(action, next){
		let container = document.createElement('div');
			container.setAttribute('class', 'form-group');

		let input = document.createElement('textarea');
			input.setAttribute('class', 'form-control');
			// input.setAttribute('id', functionName(action));

		let button = document.createElement('input');
			button.innerHTML = "Submit";
			button.setAttribute('type', 'button');
			button.setAttribute('class', 'btn btn-info');
			button.onClick=()=>{
				// get input data;
				let data = input.value;
				// set to the global store;
				this.store[functionName(action)+""+this.store.IN](data);
				// process data from the store, build the next step;
				if(action && typeof action == 'function') action();
				if(next   && typeof next == 'function') next();	
			}

		document.body.append(container);
		container.append(input);
		container.append(button);
	}


	Builder.prototype.initCategoryInputs = function(action, next){

	}

	Builder.prototype.log = function(action, next){

	}

	return Builder;
})();
