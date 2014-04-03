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


	var dockable = module.exports = backbone.view.extend({

		initialize: function initialize(options) {
			this.initializeBackboneView(options);
			this.initializeDockableView(options);
		},

		/**
		 * The view builder. It is basically a Backbone.View
		 * constructor that supports declarative 'docks'.
		 *
		 * @class view
		 * @constructor
		 * @param options {Object}
		 */
		initializeDockableView: function initializeDockableView(options) {
			// get dock definitions
			var definitions = this.docks;

			// reset docks to empty object
			this.docks = {};

			// build dock objects.
			_.each(definitions, _.bind(function (doptions, dname) {

				dname = doptions.name || dname;

				return this.dock(dname, doptions);

			}, this));
		},

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
		 *     @param [property] {String|Boolean}
		 *     @param [$container] {Object|String}
		 *     @param [map] {Object}
		 *     @param [model] {backbone.model Object}
		 */
		dock: function buildDock(first, second) {
			var options, name;

			if (_.isObject(first)) {
				options = first;
				name = options.name;
			} else {
				options = second || {};
				name = first;
			}

			// set $el
			options.$el = this.$el;

			// default dock type is model.
			var type = options.type || 'model-dock';

			// enable '-dock' suffix omission
			type = /-dock$/.test(type) ? type : type + '-dock';

			// build
			var dock = this[type](options);

			// set on docks
			this.docks[name] = dock;

			// set as property
			// DO NOT SET IF PROPERTY IS SET TO FALSE.
			if (options.property !== false) {
				var property = options.property || options.name;

				this[property] = dock;
			}

			// return
			return dock;
		},
	});
});
