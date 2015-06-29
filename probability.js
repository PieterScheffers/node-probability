function isNumber(n) {
	return n === parseFloat(n);
}

function isInteger(n)
{
   return n === parseInt(n, 10);
}

function isEven(n) 
{
   return isNumber(n) && (n % 2 === 0);
}

function isOdd(n)
{
   return isNumber(n) && (Math.abs(n) % 2 === 1);
}

function empty(arr) {
	arr.splice(0, arr.length);
	return arr;
}

function sum(set) {
	var total = 0;
	for (var i = 0; i < set.length; i++) {
		total += set[i];
	}
	return total;
}

function sort(set, order) {
	var compareFn;
	if( 'string' === typeof order && order.toLowerCase() === 'desc' ) {
		compareFn = function(a,b) { return a < b; };
	} else {
		compareFn = function(a,b) { return a > b; };
	}

	return set.sort(compareFn);
}

/**
 * occurrences
 * @param  {array} set [array of numbers and/or strings]
 * @return {object}    [object with numbers and strings as key and nr of occurrences as value]
 */
function occurrences(set) {
	set = [].concat(set);
	return set.reduce(function(obj, val, i) {
		if( obj[val] ) {
			obj[val] += 1;
		}
		else {
			obj[val] = 1;
		}
	}, {});
}

/**
 * maxOccurrence
 * @param  {array} set [array of numbers and/or strings]
 * @return {array}     [array with the numbers/strings that are the most in the set]
 */
function maxOccurrence(set) {
	var occ = occurrences(set);
	var occKeys = Object.keys(occ);
	var max = 0;
	
	return occKeys.reduce(function(arr, key) {
		if( arr[0] && max === occ[key] ) {
			arr.push(key);
		} else if( !arr[0] || max < occ[key] ){ // no arr[0] or lower
			empty(arr);
			arr.push(key);
		}
	}, []);
}

function minOccurence(set) {
	var occ = occurrences(set);
	var occKeys = Object.keys(occ);
	var min = 0;
	
	return occKeys.reduce(function(arr, key) {
		if( arr[0] && min === occ[key] ) {
			arr.push(key);
		} else if( !arr[0] || min > occ[key] ){ // no arr[0] or higher
			empty(arr);
			arr.push(key);
		}
	}, []);
}

function average(set) {
	set = [].concat(set);
	return sum(set) / set.length;
}

function midrange(set) {
	set = [].concat(set);
	var total = Math.min.apply(undefined, set);
	total += Math.max.apply(undefined, set);
	return total / 2;
}

function median(set) {
	set = [].concat(set);
	var l = set.length;
	sort(set);

	if( isEven(l) ) {
		return (set[(l / 2) - 1] + set[(l / 2)]) / 2;
	} else {
		return set[Math.floor(l / 2)];
	}
}

function mode(set) {
	set = [].concat(set);

	var max = maxOccurrence(set);
	var min = minOccurence(set);

	if(max.length === 0 || min.indexOf(max[0]) > -1) 
		return void(0);

	return max;
}

/**
 * factorial
 * @param  {int} i integer
 * @return {int}     factorial
 */
function factorial(i) {
	// factorial(6) == 6! == 6 * 5 * 4 * 3 * 2 * 1
	var total = 1;
	if( i === 1 || i === 0 ) return total;

	for (; 0 < i; i--) {
		total *= i;
	}

	return total;
}

/**
 * Calculate variation (order matters)
 * @param  {int} n [nr of possibilities]
 * @param  {int} k [nr of objects]
 * @return {int} nr of variations
 */
function variations(n, k) {
	//    n!
	// --------
	//  (n-k)!
	return parseInt( factorial(n) / factorial(n-k), 10 );
}

/**
 * variationsSimple
 * Simple version of variations function (less computations)
 * @param  {int} n [nr of possibilities]
 * @param  {int} k [nr of objects]
 * @return {int} nr of variations
 */
function variationsSimple(n, k) {
	var total = 1;
	for (; k > 0; k--) {
		total *= n;
		if( n > 0 ) n--;
	}
	return total;
}

/**
 * calculate combination (order doesn't matter)
 * @param {number} n [nr of possibilities]
 * @param {number} k [nr of objects]
 * @return {number} combination
 */
function combinations(n, k) { // binomial coefficient
	//       n!
	// ------------
	//  (n-k)! * k!
	
	//  / n \
	//  |   |
	//  \ k /
	
	return parseInt( factorial(n) / (factorial(n-k) * factorial(k) ), 10 );
}

/**
 * binomial description
 * @param  {number} n Nr of times the experiment runs
 * @param  {number} p Chance the experiment is successful
 * @param  {number} k Nr of times the experiment was successful
 * @return {number} X stochastic variable
 */
function binomial(n, p, k) {
	//            / n \      k          (n - k)
	// P(X = k) = |   |  *  p   *  (1 - p)
	//            \ k /

	return combinations(n, k) * Math.pow(p, k) * Math.pow(1-p, n-k); 
}

/**
 * binomialCumulative
 * @param  {number} n Nr of times the experiment runs
 * @param  {number} p Chance the experiment is successful
 * @param  {number} kMin Nr of times the experiment was successful (inclusive)
 * @param  {number} kMax Nr of times the experiment was successful (inclusive)
 * @return {number} X sum of stochastic variables
 */
function binomialCum(n, p, kMin, kMax) {
	if( typeof kMax === 'undefined' ) {
		kMax = kMin; kMin = 0;
	}

	var total = 0;
	for (var i = kMin; i <= kMax; i++) {
		total += binomial(n, p, i);
	}
	return total;
}

/* Binomial */
// precisely 6  3 4 5 (6) 7 8 9 --> binomial(n, 6)
// at least 6   3 4 5 (6 7 8 9) --> binomialCum(n, 6, 9)
// more as 6    3 4 5 6 (7 8 9) --> binomialCum(n, 7, 9)
// at most 6    (3 4 5 6) 7 8 9 --> binomialCum(n, 3, 6)
// less than 6  (3 4 5) 6 7 8 9 --> binomialCum(n, 3, 5)

function multinomialCoefficient(n, p, k) {
	//    n!             x1         xk
	// ------------  x p1    .... pk
	// x1! ... xk!
	// 
	// k = [].concat(k); p = [].concat(p);
	// var xK = 1, i, kLength = k.length;

	// for (i = kLength; i > 0; i--) {
	// 	xK *= factorial(i);
	// }



	// (factorial(n) / xK)
	
	return new Error("multinomialCoefficient not implemented yet");
}

/**
 * expectation
 * @param  {int}    n [nr of possibilities]
 * @param  {number} p [chance, number between 0 and 1]
 * @return {number}   expected result
 */
function expectation(n, p) {
	return n * p;
}

/**
 * standardDeviation
 * @param  {int}    n [nr of possibilities]
 * @param  {number} p [chance, number between 0 and 1]
 * @return {number}   deviation
 */
function standardDeviation(n, p) {
	return Math.sqrt(n * p * (1 - p));
}

/**
 * standardDeviationSet
 * @param  {array} set [array of numbers]
 * @return {number}    deviation
 */
function standardDeviationSet(set) {
	set = [].concat(set);

	xGem = average(set);

	for (var i = 0; i < set.length; i++) {
		set[i] = Math.pow(set[i] - xGem, 2);
	}

	return Math.sqrt( average(set) );
}

// Number functions
exports.isNumber = isNumber;
exports.isInteger = isInteger;
exports.isEven = isEven;
exports.isOdd = isOdd;

// simple array functions
exports.sum = sum;
exports.sort = sort;
exports.empty = empty;

// occurrences
exports.occurrences = occurrences;
exports.maxOccurrence = maxOccurrence;
exports.minOccurence = minOccurence;

// Statistical
exports.average = average;
exports.mean = average;
exports.median = median;
exports.mode = mode;
exports.midrange = midrange;
exports.range = midrange;

// Probability
exports.factorial = factorial;
exports.variations = variations;
exports.variationsSimple = variationsSimple;
exports.combinations = combinations;
exports.binomialCoefficient = combinations;
exports.binomial = binomial;
exports.binomialCum = binomialCum;
exports.expectation = expectation;
exports.standardDeviation = standardDeviation;
exports.standardDeviationSet = standardDeviationSet;
