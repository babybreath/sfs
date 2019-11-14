var resultDom = document.getElementById('result')
var uploader = new ss.SimpleUpload({
    button: 'uploadButton',
    dropzone: 'dragbox', // ID of element to be the drop zone
    url: '/upload',
    name: 'file',
    responseType: 'json',      
    onComplete: function(filename, response) {
        resultDom.innerHTML = response.data;
    }
}); 