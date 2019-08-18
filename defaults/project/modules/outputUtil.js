inject('/modules/Lang.js');

var outputUtil = (function() {
	var LangCreator = (function() {
		var create = function() {
			var self = {};

			self.javaListToJavascriptArray = function(javaList) {
				var javascriptArray = [];
				if (!self.isUndefinedOrNull(javaList)) {
					javaList.iterator().forEachRemaining(function(e) {
						javascriptArray.push(e);
					});
				}
				return javascriptArray;
			};

			self.javaArrayToJavascriptArray = function(javaArray) {
				var javaList = Packages.java.util.Arrays.asList(javaArray);
				return javaListToJavascriptArray(javaList);
			};

			self.mergeObject = function(obj1, obj2) {
				var newObj = JSON.parse(JSON.stringify(obj1));
				Object.keys(obj2).forEach(function(key) {
					newObj[key] = obj2[key];
				});
				return newObj;
			};

			self.isUndefinedOrNull = function(variable) {
				return typeof variable === 'undefined' || variable === null;
			};

			return self;
		};

		return {
			create: create
		};
	})();

	var OutputUtil = require('OutputUtil');
	var NodeTreeUtil = require('NodeTreeUtil');

	var _initConfig = function(config) {
		config = config || {};
		var Lang = LangCreator.create();
		if (Lang.isUndefinedOrNull(config.contentType)) {
			config.contentType = OutputUtil.CONTENT_TYPE_TEXT_HTML;
		}
		if (Lang.isUndefinedOrNull(config.removeClasses)) {
			config.removeClasses = false;
		}
		if (Lang.isUndefinedOrNull(config.removeIds)) {
			config.removeIds = false;
		}
		if (Lang.isUndefinedOrNull(config.removeDivs)) {
			config.removeDivs = false;
		}
		if (Lang.isUndefinedOrNull(config.removeToolbar)) {
			config.removeToolbar = true;
		}

		return config;
	};

	var create = function(config) {
		var _errors = [];
		var self = {};
		var config = _initConfig(config);

		var _removeClasses = function(str) {
			var regex = 'class=".*?"';
			return str.replaceAll(regex, '');
		};

		var _removeIds = function(str) {
			var regex = 'id=".*?"';
			return str.replaceAll(regex, '');
		};

		var _removeDivs = function(str) {
			var regex = '<[/]*div[^>]*>';
			return str.replaceAll(regex, '');
		};

		var _removeToolbar = function(str) {
			var regex = '<div class="sv-vamiddle">.*?</div>';
			return str.replaceAll(regex, '');
		};

		var _removeNewLine = function(str) {
			return str.replaceAll('\n', '').replaceAll('\r', '');
		};

		var _removeHTML = function(str) {
			var regex = '<[^>]*>';
			return str.replaceAll(regex, '');
		};

		var _getSectionNode = function(parent, section) {
			var sectionNode = parent.getNode(section);
			if (sectionNode) {
				return sectionNode;
			} else {
				_errors.push(
					'Section with path "' +
						name +
						'" could not be found in parent "' +
						parent.toString() +
						'"'
				);
			}
		};

		var _getNodeOutput = function(parent, node) {
			return OutputUtil.getNodeOutput(parent, node, config.contentType);
		};

		self.getPortletOutput = function(parent, name) {
			try {
				var portlet = NodeTreeUtil.findPortletByName(parent, name);
				if (portlet) {
					return _getNodeOutput(parent, portlet);
				} else {
					_errors.push(
						'Portlet with name "' +
							name +
							'" could not be found in parent "' +
							parent.toString() +
							'"'
					);
				}
			} catch (e) {
				return _errors.push(e.message);
			}
		};

		self.getPortletOutputWithRegex = function(parent, name, regex) {
			try {
				var portlet = NodeTreeUtil.findPortletByName(parent, name);
				if (portlet) {
					var output = _getNodeOutput(parent, portlet);
					output = output.replace(regex, '');
					return output && !output.isEmpty() ? output : null;
				} else {
					_errors.push(
						'Portlet with name "' +
							name +
							'" could not be found in parent "' +
							parent.toString() +
							'"'
					);
				}
			} catch (e) {
				return _errors.push(e.message);
			}
		};

		self.getPortletOutputPlain = function(parent, name) {
			try {
				var portlet = NodeTreeUtil.findPortletByName(parent, name);
				if (portlet) {
					var output = _getNodeOutput(parent, portlet);
					output = _removeToolbar(output);
					output = _removeHTML(output);
					output = _removeNewLine(output);
					return output && !output.isEmpty() ? output : null;
				} else {
					_errors.push(
						'Portlet with name "' +
							name +
							'" could not be found in parent "' +
							parent.toString() +
							'"'
					);
				}
			} catch (e) {
				return _errors.push(e.message);
			}
		};

		self.getSectionOutput = function(parent, section) {
			try {
				var sectionNode = _getSectionNode(parent, section);
				if (sectionNode) {
					return _getNodeOutput(parent, sectionNode);
				}
			} catch (e) {
				return _errors.push(e.message);
			}
		};

		self.getFormattedText = function(parent, section) {
			try {
				var sectionNode = _getSectionNode(parent, section);
				if (sectionNode) {
					var output = _getNodeOutput(parent, sectionNode);
					output = config.removeToolbar
						? _removeToolbar(output)
						: output;
					output = config.removeDivs ? _removeDivs(output) : output;
					output = config.removeIds ? _removeIds(output) : output;
					output = _removeNewLine(output);
					output = config.removeClasses
						? _removeClasses(output)
						: output;
					return output && !output.isEmpty() ? output : null;
				}
			} catch (e) {
				return _errors.push(e.message);
			}
		};

		self.getPlainText = function(parent, section) {
			try {
				var sectionNode = _getSectionNode(parent, section);
				if (sectionNode) {
					var output = _getNodeOutput(parent, sectionNode);
					output = _removeToolbar(output);
					output = _removeHTML(output);
					output = _removeNewLine(output);
					return output && !output.isEmpty() ? output : null;
				}
			} catch (e) {
				return _errors.push(e.message);
			}
		};

		self.getErrors = function() {
			return _errors.slice();
		};

		return self;
	};

	return {
		create: create
	};
})();
