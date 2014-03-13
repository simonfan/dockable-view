(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'dockable-view',
		// dependencies for the test
		deps = [mod, 'should', 'text!/test/fixture.html', 'jquery', 'lowercase-backbone'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(dockable, should, fixture, $, backbone) {
	'use strict';

	describe('dockable basics', function () {
		beforeEach(function () {
			this.$fixture = $(fixture).appendTo($('body'));
		});

		afterEach(function () {
	//		this.$fixture.remove();
		})

		it('is fine (:', function () {


			// builder
			var someview = dockable.extend({

				docks: {
					data: {
						name: 'data',
					//	type: 'model-dock',
						map: {
							name: '[data-attribute="name"]',
							quantity: '[data-attribute="quantity"]',
							value: '[data-attribute="value"]'
						}
					},

					position: {
						name: 'position',
						type: 'model-dock',
						map: {
							'top': '-> css:top',
							'left': '-> css:left'
						}
					},
					colors: {
						name: 'colors',
						property: false,
						type: 'model-dock',
						map: {
							'highlight': '.highlight -> css:background-color',
							'dim': '.dim -> css:background-color',
						}
					}
				}
			});

			// instance
			var v = someview({
				el: this.$fixture.find('#item')
			});

			// named docks
			v.data.should.be.type('object');
			v.position.should.be.type('object');
			// dock set not to have a property
			should(v.colors).be.type('undefined');

			// build a model
			var banana = backbone.model({
				name: 'Banana',
				quantity: 40,
				value: 700
			});

			// attach data
			v.docks.data.attach(banana);

			// set colors
			v.docks.colors.attach(backbone.model({
				'highlight': 'red'
			}));

			v.docks.colors.set('dim', 'grey');

		});
	});
});
