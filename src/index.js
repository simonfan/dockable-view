/**
 * @module dockable-view
 */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash'),
		backbone = require('lowercase-backbone'),

		// docks
		modelDock = require('model-dock'),
		collectionDock = require('collection-dock');

	/**
	 * The view builder. It is basically a Backbone.View
	 * constructor that supports declarative 'docks'.
	 *
	 * @class view
	 * @constructor
	 * @param options {Object}
	 */
	var dockable = module.exports = backbone.view.extend(function dockableView(options) {

		// parent constructor.
		backbone.view.prototype.initialize.apply(this, arguments);

		// build dock objects.
		var docks = _.mapValues(this.docks, _.bind(function (doptions, dname) {

			return this.dock(doptions);

		}, this));

		// replace dock definition with effective dock objects.
		this.docks = docks;
	});

	// proto methods and properties.
	dockable.proto({

		/**
		 * The builder function for model docks.
		 *
		 * @property modelDock
		 * @type Function
		 */
		'model-dock': modelDock,

		/**
		 * The builder function for collection docks.
		 *
		 * @property collectionDock
		 * @type Function
		 */
		'collection-dock': collectionDock,

		/**
		 *
		 * @method dock
		 * @param options {Object}
		 *     @param type {String}
		 *     @param name {String}
		 *     @param [$container] {Object|String}
		 *     @param [map] {Object}
		 *     @param [model] {backbone.model Object}
		 */
		dock: function buildDock(options) {

			// set $el
			options.$el = this.$el;

			// default dock type is model.
			var type = options.type || 'model-dock';

			// enable '-dock' omission
			type = /-dock$/.test(type) ? type : type + '-dock';

			// build
			return this[type](options);
		},
	});
});
