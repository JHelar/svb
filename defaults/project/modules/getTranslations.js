// Function to resolve all possible translations for given node.
// Returns a map of the possible locales as keys, and a bool signaling if this is the current locale.

var getTranslations = (function(){
	var TranslationUtil = require('TranslationUtil');
	var PortletContextUtil = require('PortletContextUtil');
	
	var currentLocale = PortletContextUtil.getCurrentLocale();

	return function(node){
		try {
			var nodeTranslations = TranslationUtil.getTranslations(node, true);
			var keys = nodeTranslations.keySet().toArray();
			var translations = {}
			keys.forEach(function(key) {
				translations[key] = {
					node: nodeTranslations.get(key),
					current: currentLocale == key
				};
			})
			return translations;
		} catch(e) {
			return {}
		}
	}
})