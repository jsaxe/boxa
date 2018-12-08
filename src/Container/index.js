'use strict';

module.exports = Container;

var UnknownProviderException = require('./UnknownProviderException');

function Container(){

	/**
     *   #### Private properties
     */

	/**
     * Contains all binded aliases
     *
     * @var array
     */
	var binds = [
	];

	/**
     * Contains all alias linkage
     *
     * @var array
     */
	var aliases = [
	];

	/**
     * Contains all maps
     *
     * @var array
     */
	var maps = [
	];

	/**
     *   #### Public Methods
     */

	/**
     * Determine if the given type has been registered.
     *
     * @param  string  provider
     * @return bool
     */
	this.isRegistered = function (provider) {
		return provider in binds;
	};

	/**
     * Determine if the given type has been mapped.
     *
     * @param  string  provider
     * @return bool
     */
	this.isMapped = function (provider) {
		return provider in maps && maps[provider] !== null;
	};

	/**
     * Gets if the provider is singleton
     *
     * @param  string  provider
     * @return bool
     */
	this.isSingleton = function (provider) {
		if (this.isRegistered(provider))
			return binds[provider].singleton;
		return false;
	};

	/**
     * Register a provider to service.
     *
     * @param  mixed  provider
     * @param  string content
     * @param  bool   singleton
     * @return void
     */
	this.register = this.bind = function (provider, content = null, singleton = false) {
		if (typeof provider === 'object') {
			var alias = provider.alias;
			provider = provider.provider;
			aliases[alias] = provider;
		}
		maps[provider] = null;
		if (content === null)
			content = provider;

		binds[provider] = { content: content, singleton: singleton };
	};

	/**
	 * Unregister the registered provider
	 *
	 * @param mixed
	 * @return void
	 */
	this.unregister = function (provider) {
		delete binds[provider];
		delete maps[provider];
	}

	/**
     * Register a provider to service as a singleton
     *
     * @param  mixed  provider
     * @param  string content
     * @return void
     */
	this.singleton = function (provider, content = null) {
		this.register(provider, content, true);
	};

	/**
     * Resolve the type provider.
     *
     * @param  string name
     * @param  array  parameters
     * @return object
     */
	this.resolve = this.use = function (name, params) {
		// Resolving name to provider
		var provider = this.resolveAlias(name);
		// If Already exists, return that.
		if (this.isMapped(provider)) {
			return maps[provider];
		}

		var content = this.getContent(provider);
		if (typeof content === 'object') {
			if (this.isSingleton(provider))
				maps[provider] = content;
			return content;
		}else if (typeof content === 'function') {
			content = content(this);
			if (this.isSingleton(provider))
				maps[provider] = content;
			return content;
		}

		// Object Generation
		try {
			var lib = require('path').resolve('./' + content);
			var func = require(lib);
		} catch (error) {
			throw new UnknownProviderException({name: name, content: lib});
		}
		params = params ? params : [
		];

		var obj = Reflect.construct(func, params);
		if (this.isSingleton(provider))
			maps[provider] = obj;

		return obj;

	};

	this.inject = this.in = function (name, ...params) {
		return this.resolve(name, params)
	}

	/**
     * Register an existing instance
     *
     * @param  string  $abstract
     * @param  mixed   $instance
     * @return void
     */
	this.map = function (provider, instance) {
		if (typeof provider === 'object') {
			var alias = provider.alias;
			provider = provider.provider;
			aliases[alias] = provider;
		}
		maps[provider] = instance;
	}

	/**
     * Gets the provider for given name
     *
     * @param  string  name
     * @return string
     */
	this.resolveAlias = function (name) {
		if (!(name in aliases)) {
			return name;
		}
		else
			return this.resolveAlias(aliases[name]);
	};

	/**
     * Gets the class for given name
     *
     * @param  string  provider
     * @return string
     */
	this.getContent = function (provider) {
		if (!this.isRegistered(provider))
			return provider;
		return binds[provider]['content'];
	};

}

/**
 * #### Static Methods & Properties
 */

/**
 * Self instance variable
 *
 * @var Container
 */
Container.instance = null;

/**
 * Store self instance
 *
 * @return void
 */
Container.setInstance = function (instance) {
	Container.instance = instance;
	return instance;
};

/**
 * Returns the self instance
 *
 * @return Container
 */
Container.getInstance = function () {
	if (Container.instance != null){
		return Container.instance;
	}
	return Container.instance = new Container();
}

