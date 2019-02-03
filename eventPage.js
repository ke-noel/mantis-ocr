chrome.contextMenus.create({
	"id": "getImageText",
	"title": "Read the image text",
	"contexts": ["image"]
});
	
chrome.contextMenus.create({
	"id": "getImageContent",
	"title": "Get the image content",
	"contexts": ["image"]
});

chrome.contextMenus.onClicked.addListener(function(request){
	if (!request.srcUrl) {
		alert('Error: Image does not have a valid URL.')
	} else if  (request.menuItemId == "getImageText") {
		processText(request.srcUrl);
	} else if (request.menuItemId == "getImageContent") {
		describeImage(request.srcUrl);
	}
})

function processText(sourceImageUrl) {
	var uriBase =
            "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr";

    var url = uriBase + "?" + "lanuage=en&detectOrientation=true";

    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "3d4299781c9f4fc394ef6ede4a429325");

    xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');

    var json = JSON.parse(xhr.responseText);
    var lines = json.regions[0].lines;
    var response;

    lines.forEach(function (line) {
    	line.words.forEach(function (word) {
    		response += JSON.stringify(word.text);
    	})
    });

    if (xhr.status != 200) {
    	alert('Error! Please try again.');
    } else {
    	alert('Processed text: ' + response);
    }

    // check that there is text before printing anything
 };

function describeImage(sourceImageUrl) {
	var uriBase =
            "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze";

    var url = uriBase + "?" + "visualFeatures=Description&details=&lanuage=en";

    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "3d4299781c9f4fc394ef6ede4a429325");

    xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');

    var json = JSON.parse(xhr.responseText);
    var caption = json.description.captions[0];
    var confidence = JSON.stringify(caption.confidence);

    if (xhr.status != 200) { 
    	alert('Error! Please try again.');
    } else if (confidence < 0.80) {
    	alert('Unable to process image.');
    } else {
    	alert("Image description: " + 
    		JSON.stringify(caption.text) + 
    		"\nConfidence is " + Math.round(confidence*100) + "%.");
    }
}