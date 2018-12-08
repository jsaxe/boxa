'use strict'

/**
 * Test Table Class
 */

class Table{

	constructor (Database) {
		this.db = Database;
	}

	getDB () {
		return this.db;
	}

}


module.exports = Table
