'use strict'

var expect = require('chai').expect;

var Container = require('../');

describe('Container', function () {

	it('should have single instance', function () {

		var container = Container.setInstance(new Container())

		expect(container).to.equal(Container.getInstance())

		Container.setInstance(null)

		var container2 = Container.getInstance()

		expect(container2).to.be.instanceOf(Container)
		expect(container).to.not.equal(container2)

	})

	describe('Registration Tests', function () {

		it('register and unregister providers', function () {

			var container = new Container()

			container.register('name', function () {
				return 'Robin'
			})

			container.singleton('color', function () {
				return 'Black'
			})

			expect(container.isRegistered('name')).to.equal(true)
			expect(container.isRegistered('food')).to.equal(false)

			container.unregister('name');

			expect(container.isRegistered('name')).to.equal(false)

		})

		it('blank content registration test', function () {

			var container = new Container()

			// Blank content test
			container.register('beer')

			expect(container.getContent('beer')).to.equal('beer')

		})

		it('register providers as singleton', function () {

			var container = new Container()

			container.register('name', function () {
				return 'Robin'
			})

			container.singleton('color', function () {
				return 'Black'
			})

			expect(container.isSingleton('name')).to.equal(false)
			expect(container.isSingleton('color')).to.equal(true)

		})

		it('map singleton providers only', function () {

			var container = new Container()

			container.register('name', function () {
				return 'Robin'
			})

			container.singleton('color', function () {
				return 'Black'
			})

			container.resolve('name')
			container.resolve('color')

			expect(container.isMapped('name')).to.equal(false)
			expect(container.isMapped('color')).to.equal(true)

			container.map('someData', "Hello, World!")

			expect(container.isMapped('someData')).to.equal(true)

		})

		it('resolve provider using alias', function () {

			var container = new Container()

			container.register({
				alias: "nawa",
				provider: "name"
			}, function () {
				return 'Robin'
			})

			expect(container.resolveAlias('nawa')).to.equal("name")

		})

	})

	describe('Resolution Tests', function () {

		var container = new Container()

		it('resolution of provider with closure as content', function () {

			container.register('name', function () {
				return 'Robin'
			})

			expect(container.resolve('name')).to.equal('Robin')
			expect(container.isMapped('name')).to.equal(false)

			container.singleton('food', function () {
				return 'Chicken'
			})

			expect(container.resolve('food')).to.equal('Chicken')
			expect(container.isMapped('food')).to.equal(true)

		})

		it('resolution of provider with object as content', function () {

			var nameObj = { data: "Hacktivistic" }
			container.register('name', nameObj)

			expect(container.resolve('name').data).to.equal("Hacktivistic")

		})

		it('resolution of mapped provider', function () {

			container.map('name', { nanoAxe: "0.1" })

			expect(container.resolve('name').nanoAxe).to.equal("0.1")

			container.map({
				alias: "kukhura",
				provider: "chicken"
			}, function () {
				return 'KFC'
			})

			var kukhura = container.resolve('kukhura')
			var chicken = container.resolve('chicken')

			expect(kukhura).to.equal(chicken)
			expect(kukhura()).to.equal(chicken()).to.equal('KFC')

		})

		it('resolution using alias', function () {

			container.register({
				alias: "nawa",
				provider: "name"
			}, function () {
				return 'Robin'
			})

			var data1 = container.resolve('nawa')
			var data2 = container.resolve('name')

			expect(data1).to.equal(data2).to.equal('Robin')

		})

		it('resolution of a provider with class as content', function () {

			var Database = require('./TestClasses/class1')

			var db1 = container.resolve('test/TestClasses/class1')

			expect(db1).instanceOf(Database);

			container.singleton('DB', 'test/TestClasses/class1')

			var db2 = container.resolve('DB')

			expect(db2).instanceOf(Database)
			expect(db1).to.not.equal(db2)

			container.singleton({
				alias: "Database",
				provider: "NanoAxe/DB"
			}, 'test/TestClasses/class1');

			var db3 = container.resolve('Database')
			var db4 = container.resolve ('NanoAxe/DB')

			expect(db3).instanceOf(Database)
			expect(db4).instanceOf(Database)
			expect(db3).to.equal(db4).to.not.equal(db2)

		})

		it('resolution error', function () {

			var UnknownProviderException = require('../src/Container/UnknownProviderException')

			expect(function () {
				container.resolve('unknown')
			}).to.throw(UnknownProviderException)

		})

		it('resolution with dependency injection', function () {

			container.register('Table', function (c) {
				var dependency = c.resolve('Database')
				return c.inject('test/TestClasses/class2', dependency)
			})

			var obj = container.resolve('Table')

			expect(obj.getDB()).to.equal(container.resolve('Database'))

		})

	})
})
