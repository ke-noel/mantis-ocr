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
		var imgSrc = request.srcUrl;
		describeImage(request.srcUrl);
	}
})

function processText(sourceImageUrl) {
	var uriBase =
            "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr";

    // Request parameters
    var params = {
    	"language": "unk",
    	"detectOrientation": "true",
    };

    var url = uriBase + "?" + "lanuage=unk&detectOrientation=true";

    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "3d4299781c9f4fc394ef6ede4a429325");

    xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');

    var jsonresponse = JSON.stringify(xhr.responseText);

    alert("status code: " + xhr.status);
    alert(jsonresponse);

    // check that there is text before printing anything
    // TODO: iterate through bounding boxes and words and concatenate text within
};

function describeImage(sourceImageUrl) {
	var uriBase =
            "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze";

    // Request parameters
    var params = {
    	"visualFeatures": "Description",
    	"details": "",
    	"language": "en",
    };

    var url = uriBase + "?" + "visualFeatures=Description&details=&lanuage=en";

    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "3d4299781c9f4fc394ef6ede4a429325");

    xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');

    var json = JSON.parse(xhr.responseText);
    var caption = json.description.captions[0];
    var confidence = JSON.stringify(caption.confidence);

    alert(xhr.responseText);

    if (xhr.status != 200) { 
    	alert('Error! Please try again.');
    } else if (confidence < 0.80) {
    	alert('Unable to process image.');
    } else {
    	alert("Processed text: " + 
    		JSON.stringify(caption.text) + 
    		"\nConfidence is " + Math.round(confidence*100) + "%.");
    }
};