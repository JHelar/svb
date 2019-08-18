// inject('/modules/velocityrenderer.js')

var makeRenderer = (function () {
    var renderer = require('VelocityRenderer');
    // var response = request.getAttribute("sitevision.context.render").getResponse();
	// var context = renderer.getVelocityContext(request, response.getWriter())
	var outputWriter = new java.io.StringWriter();
	var context = renderer.getVelocityContext(outputWriter)


    var getTemplateFromFile = function (fileNode) {
        var binary = require('PropertyUtil').getBinary(fileNode, 'URI');
        var stream = binary.getStream();
        var char = 0;
        var charList = [];
        while ((char = stream.read()) !== -1) {
            charList.push(char);
        }
        var encodedString = String.fromCharCode.apply(null, charList); // decode charcodes to chars
        var template = decodeURIComponent(escape(encodedString)); // encode UTF8
        stream.close();
        binary.dispose();
        return template;
    }

    return function (velocityFile) {
        var fileNode = null;
        if (typeof velocityFile === 'string') {
            fileNode = require("ResourceLocatorUtil").getFileRepository().getNode(velocityFile)
        } else if (require('NodeTypeUtil').isFile(velocityFile)) {
            fileNode = velocityFile
        }


        if (fileNode) {
            var template = getTemplateFromFile(fileNode);

            var render = function () {
				renderer.render(context, template);
				out.println(outputWriter.toString())
            }

            var addData = function (data) {
                if (typeof data == 'object') {
                    for (var key in data) {
                        context.put(key, data[key]);
                    }
                }
            }

            return {
                render: render,
                addData: addData
            }
        }
        else {
            throw Error('No Velocityfilepath supplied')
        }
    }
})()