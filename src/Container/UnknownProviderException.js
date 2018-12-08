'use strict';


function UnknownProviderException(extra) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = "Provider for '" + extra.name + "' not found at '" + extra.content + "'";
};
require('util').inherits(UnknownProviderException, Error);

module.exports = UnknownProviderException;
