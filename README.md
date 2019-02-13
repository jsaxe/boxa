# BOXA
> Simple, yet powerful IoC container with dependency injection which aims to reduce pain in the butt.

[![Node Version](https://img.shields.io/node/v/boxa.svg?style=flat)](https://www.npmjs.com/package/boxa)
[![NPM Version](https://img.shields.io/npm/v/boxa.svg)](https://www.npmjs.com/package/boxa)
[![Build Status](https://travis-ci.org/jsaxe/boxa.svg?branch=master)](https://travis-ci.org/jsaxe/boxa)
[![Coverage Status](https://coveralls.io/repos/github/jsaxe/boxa/badge.svg?branch=master)](https://coveralls.io/github/jsaxe/boxa?branch=master)

Boxa is a [Node.js](http://nodejs.org) IoC container with dependency injection. It helps manage dependencies with little to no sweat.
It is designed for nanoAxe framework, but can be used independently for any type of project to manage your dependencies.

## Installation
You can install the package from npm.
```bash
npm i --save boxa
```

## Basic Usage
```js
class Chicken{
	/* your methods and properties */
}

const Boxa = require('boxa')
var boxa = new Boxa();

boxa.bind('chicken', function (b) {
	return new Chicken;
});

var chicken = boxa.use('chicken')

```

This is just a basic usage of Boxa. Need more Power? See below, to see example of dependency injection.

## Dependency Injection
```js
class Spices{
	/* your methods and properties */
}

class Onions{
	/* your methods and properties */
}

class Chicken{ /* Chicken Provider */

	constructor (spices, onions) {
		/* if you smell what the boxa is cooking... */
	}

	eggs () {
		/* lay some eggs */
		console.log('Eggs in the frying pan!')
	}

	/* other methods and properties */
}
```

Injection of dependencies `Spices` and `Onions` on `Chicken` provider can be done as:

```js
const Boxa = require('boxa')
var boxa = new Boxa();

boxa.bind('spices', new Spices);
boxa.bind('onions', new Onions);

boxa.bind('chicken', function (b) {
	var spices = b.use('spices')
	var onions = b.use('onions')
	return new Chicken(spices, onions)
})

var chicken = boxa.use('chicken')
chicken.eggs();	 // Output: Eggs in the frying pan!

```

Here, we injected `Spices` and `Onions` behind the scenes. Now, `Chicken` consumer shall not worry about passing `Spices` or `Onions` manually.

## Documentation
Check the [documentation](https://jsaxe.com/boxa) at the Boxa page.

## Tests
To run the test, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

[MIT](LICENSE)
