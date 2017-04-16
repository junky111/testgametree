import {STEPS} from './stepsConfig';

/**
 * DOM Builder. 
 * Works with dom and is responsible for DOM manipulations of steps. 
 * Never knows, what action from Processor it acts.
 * @return {Constructor} constructor of Builder.
 */
export let Builder = (function(){
	
	/**
	 * First step container. One textarea with initial data and button.
	 * @type { DOM } 
	 */
	let $stepOneDiv; 	

	/**
	 * Second step container. Consists of n-number of textareas by number of
	 * elements in brackets. Textarea's filled data - options of categories.
	 * @type { DOM } 
	 */
	let $stepTwoDiv; 	

	/**
	 * Third step container. Consists of combinations.
	 * @type { DOM }
	 */
	let $stepThreeDiv; 

	/**
	 * Container of all steps.
	 * @type { DOM }
	 */
	let $container;


	/**
	 * Constructor Builder. Creates a new instance of Builder.
	 * @param {Processor} processor. Processor instance. Functional core. 
	 * @param {Store} store. Store instance. Data storage. Data bridge between Builder and Processor.
	 */
	function Builder(processor, store){
		//Set step to 0
		this.currentStep = 0;
		this.processor = processor;
		this.store = store;
	}

	/**
	 * Actions of app step by step.
	 * Each object consists of two fields:
	 * - build : name of Builder action (DOM building and rendering)
	 * - exec : name of Processor action (Data manipulating)
	 * @example
	 * [
	 * 	  {
	 * 		build: 'initInput', 
	 * 	 	exec: 'parseCategories'
	 * 	  }
	 * ]
	 * @type {Array{Object, Object, ..}}
	 */
	Builder.prototype.steps=STEPS;

	/**
	 * Get all steps.
	 * @return {Array} array of steps.
	 */
	Builder.prototype.getSteps = function(){
		return this.steps;
	}

	/**
	 * Get current step of application.
	 * @return {int} current step. 
	 */
	Builder.prototype.getCurrentStep = function(){
		return this.currentStep;
	}

	/**
	 * Build and render current step.  
	 * @param  {Object} actionPair - element of steps. 
	 * @example
	 * 	{
	 * 		build: 'initInput', 
	 * 	 	exec: 'parseCategories'
	 *  }
	 * @param  {int} currentStep - current step of application.
	 */
	Builder.prototype.draw = function(actionPair, currentStep){
		if(actionPair && this[actionPair.build] && this.processor[actionPair.exec]) {
			// Execute Builder action by name
			this[actionPair.build](
				// give Processor action by name with current processor context as a parameter.
				this.processor[actionPair.exec].bind(this.processor),
				// action to move to the next step
				() => this.nextStep(),
				// current step, will use if not current step will be called.
				currentStep,
			);
		}
	}

	/**
	 * Moves to the next step of application process. 
	 */
	Builder.prototype.nextStep = function(){
		// check if the next step is valide
		if(this.currentStep+1 < this.steps.length){
			// set the next step
			this.currentStep++;
			// draw the next step with the step's parameters:
			// give the next step config actions (build and exec),
			// give the next step number,
			this.draw(this.steps[this.getCurrentStep()], this.getCurrentStep());
		}
	}
	
	/**
	 * Initalize the app workflow (process)
	 */
	Builder.prototype.init = function(){
		// Build and draw the main container.
		this.initContainer();
		// draw the next step with the step's parameters:
		// give the next step config actions (build and exec),
		// give the next step number,
		this.draw(this.steps[this.getCurrentStep()], this.getCurrentStep());
	}	

	
	/** DOM operations **/

	/**
	 * Build and draw the main container.
	 */
	Builder.prototype.initContainer = function(){
		$container = getDiv('container');
		document.body.append($container);
	}
	
	/**
	 * Creates the first input. Where the categories will be set. 
	 * Build the DOM.
	 * @param  {Function} action 	- function of Processor. Parse data from the global store.
	 * @param  {Function} next 		- function of Builder. Build the next step. 
	 * @return {undefined}
	 */
	Builder.prototype.initInput = function(action, next, currentStep){
		$stepOneDiv = getDiv('row');

		let div = getDiv('form-group');

		let input = document.createElement('textarea');
			input.setAttribute('class', 'form-control');

		let button = document.createElement('button');
			button.innerHTML = "Submit";
			button.setAttribute('class', 'btn btn-info');
			button.onclick = ()=>{
				// get input data;
				let data = input.value ? input.value : "";
				
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

		let buttonDiv = getDiv('form-group');
		buttonDiv.append(button);

		div.append(input);
		$container.append($stepOneDiv);
		$stepOneDiv.append(div);
		$stepOneDiv.append(buttonDiv);
	}

	/**
	 * Creates categories' containers. 
	 * Containers consists of number of divs with labels and textareas.
	 * @param  {Function} action 		- Processor action. Operates data from store.
	 * @param  {Function} next  		- Builder action. Moves process to the next step. 
	 * @param  {int}   currentStep 		- Current step of application's workflow.
	 */
	Builder.prototype.initCategoryInputs = function(action, next, currentStep){
		

		let categories = this.store.getCategories();
		// if categories are not filled. ( no data in [] at the filled string)
		if(!categories.length) return;

		$stepTwoDiv = getDiv('row');

		let domCategories = [];

		// draw container for each category
		for(let i=0 ;i<categories.length; i++){
			let container = getDiv('form-group');
			let label = document.createElement('label');
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
		
		let buttonDiv = getDiv('form-group');
		buttonDiv.append(button);
		$stepTwoDiv.append(buttonDiv);

		$container.append($stepTwoDiv);
	}

	/**
	 * Generates and draw all possible combinations of categories' options.
 	 * @param  {Function} action 		- Processor action. Operates data from store.
	 * @param  {Function} next  		- Builder action. Moves process to the next step. 
	 * @param  {int}   currentStep 		- Current step of application's workflow.
	 */
	Builder.prototype.log = function(action, next, currentStep){
		// delete all non uptime data if this step is not current.
		if(this.currentStep != currentStep){
			this.currentStep=currentStep;
			if($container.contains($stepThreeDiv)) $container.removeChild($stepThreeDiv);
			this.store.clearLogs();
		}

		if(action && typeof action == 'function') action();

		let logs = this.store.getLogs();

		// Builds all <blockquote> tags for each log.
		let $logs = logs.map(log => {
			let blockquote = document.createElement('blockquote');
			let l = document.createElement('p');
				l.innerHTML = log;
			blockquote.append(l);
			return blockquote;
		});

		$stepThreeDiv = getDiv('row');

		let div = getDiv('form-group');

		$logs.map($log=>div.append($log));
		$stepThreeDiv.append(div);
		$container.append($stepThreeDiv);
	}

	/**
	 * Get div with className.
	 * @param  {String} className - class name of div.
	 * @return { DOMElement }  - div Dom Element.     
	 */
	function getDiv(className){
		let div = document.createElement('div');
			div.setAttribute('class', className);
		return div;
	}

	return Builder;
})();
