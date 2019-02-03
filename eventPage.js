if (!chrome.contextMenus["describeImageText"]) {
	chrome.contextMenus.create({
		"id": "describeImageText",
		"title": "Read the image text with Mantis OCR",
		"contexts": ["image"]
	});
}

chrome.contextMenus.onClicked.addListener(function(request){
	if (request.menuItemId == "describeImageText" && request.srcUrl) {
		var imgSrc = request.srcUrl;
		processText(imgSrc);
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

    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", "3d4299781c9f4fc394ef6ede4a429325");

    xhttp.send('{"url": ' + '"' + sourceImageUrl + '"}');

    var jsonresponse = JSON.stringify(xhttp.responseText);

    alert("status code: " + xhttp.status);
    alert(jsonresponse);

    // TODO: iterate through bounding boxes and words and concatenate text within
};