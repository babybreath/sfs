var clipboard = new ClipboardJS("#copy");

clipboard.on("success", function(e) {
  console.info("Action:", e.action);
  console.info("Text:", e.text);
  console.info("Trigger:", e.trigger);
  e.trigger.innerText = "Copied";
  setTimeout(function() {
    e.trigger.innerText = "Copy to clipboard";
  }, 2000);

  //   e.clearSelection();
});

clipboard.on("error", function(e) {
  console.error("Action:", e.action);
  console.error("Trigger:", e.trigger);
});

var resultDom = document.getElementById("result");

var uploader = new ss.SimpleUpload({
  button: "uploadButton",
  dropzone: "dragbox", // ID of element to be the drop zone
  url: "/upload",
  name: "file",
  responseType: "json",
  onComplete: function(filename, response) {
    resultDom.value = response.data;
    document.getElementById("resultbox").style.visibility = "visible";
  }
});
