define(function(require) {
	'use strict';
 
	var _          = require('underscore');
	var Component  = require('Component');
	var template   = require('/template/main');
 
	return Component.extend({
 
	   template: template,
 
	   filterState: function(state) {
		  return _.extend({}, state);
	   },
	   templateFunctions: function() {
			var _this = this;

			return {
				// Functions allows rendering of sub views, with optional data to be pushed into the renderer. If no data the whole state will be present
				renderPartial: function(partialName, data) {
					var template = require('/template/partials/' + partialName);
					if (template) {
						if (data) {
							return _this.renderTemplate(template, {
								data: data
							});
						} else {
							return _this.renderTemplate(template, _this.state);
						}
					} else {
						return 'No partial template found';
					}
				}
			}
		}
	});
 });