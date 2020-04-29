import { DirectUpload } from "./activestorage/direct_upload"

class ActivestorageUploader {
  constructor(file, url, uploaderOption, successCallback, failureCallback) {
    this.file = file
    this.directupload = new DirectUpload(file, url, this)
    this.uploaderOption = uploaderOption
    this.successCallback = successCallback
    this.failureCallback = failureCallback
  }

  upload() {
    console.log( "uploading... ")
    this.directupload.create((error, blob) => {
      if (error) {
        // Handle the error
        console.log( "directupload", error)
        this.failureCallback && this.failureCallback(error)
      } else {
        // Add an appropriately-named hidden input to the form
        // with a value of blob.signed_id
        console.log( "directupload", blob)
        this.successCallback(blob)
      }
    })
  }

  directUploadWillStoreFileWithXHR(request) {
    request.upload.addEventListener("progress",
      event => this.directUploadDidProgress(event))
  }

  directUploadDidProgress(e) {
    // Use event.loaded and event.total to update the progress bar
    e.percent = e.loaded/e.total*100
    //console.log( "directUploadDidProgress= ", e)
    this.uploaderOption.onProgress( e, this.file )
  }
}

export { ActivestorageUploader }
