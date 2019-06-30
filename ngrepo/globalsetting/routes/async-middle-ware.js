module.exports = asyncMiddleware = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

/*

Wrapping Async Await Routes

Since Async Await is essentially syntactic sugar for promises, 
and if an await statement errors it will return a rejected promise, 
we can write a helper function that wraps our express routes to handle rejected promises.

*/
