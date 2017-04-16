
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
export const STEPS = [
	{build: 'initInput', 			exec: 'parseCategories'},
	{build: 'initCategoryInputs', 	exec: 'parseCategoryOptions'},
	{build: 'log', 					exec: 'log'},
];