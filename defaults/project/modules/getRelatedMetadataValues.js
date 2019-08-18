// Function takes in a pageNode and related metadata returns values in form of a list with values: { name: string, url: string, node: GOAL_NODE | null }.
// Takes into account the type of link etc...

var getRelatedMetadataValues = (function(
	metadataUtil,
	propertyUtil,
	scriptUtil,
	nodeTypeUtil
  ) {
	return function(pageNode, metadataName) {
	  try {
		var values = metadataUtil.getRelatedMetadataPropertyValues(
		  pageNode,
		  metadataName
		);
		var returnValues = [];
		if (!values) return returnValues;
  
		for (var i = 0; i < values.size(); i++) {
		  var node = values[i];
  
		  if (
			typeof node !== 'string' &&
			nodeTypeUtil.isTypeOf(node, [
			  nodeTypeUtil.LINK_TYPE,
			  nodeTypeUtil.FILE_TYPE,
			  nodeTypeUtil.IMAGE_TYPE
			])
		  ) {
			var name = scriptUtil.getNonNull(
			  propertyUtil.getString(node, 'displayName')
			);
			var url = scriptUtil.getNonNull(propertyUtil.getString(node, 'URI'));
			var goalNode = scriptUtil.getNonNull(
			  propertyUtil.getNode(node, 'URI')
			);
  
			if (!url) {
			  url = scriptUtil.getNonNull(propertyUtil.getString(node, 'URL'));
			}
  
			if (name && url) {
			  returnValues.push({
				name: name,
				url: url,
				node: goalNode
			  });
			}
		  }
		}
		return returnValues.length > 0 && returnValues;
	  } catch (e) {
		out.println(e);
		return [];
	  }
	};
  })(
	require('MetadataUtil'),
	require('PropertyUtil'),
	require('ScriptUtil'),
	require('NodeTypeUtil')
  );