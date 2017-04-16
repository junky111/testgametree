/**
 * Search for all values in square brackets ([]). 
 * Don't work for nested square brackets. 
 * @type {RegExp}
 */
export const REGEXP_MATCH_BRACKETS_DATA = /[^[\]]+(?=])/g;

/**
 * Search for all \n symbols, where any symbol exists after \n symbol.
 * @type {RegExp}
 */
export const REGEXP_MATCH_OPTIONS = /\n(?=.)/g;

