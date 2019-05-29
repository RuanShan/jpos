import { DirectUpload } from "activestorage"

class ActivestorageUploader {
  constructor(file, url, uploaderOption, successCallback, failureCallback) {
    this.file = file
    this.directupload = new DirectUpload(file, url, this)
    this.uploaderOption = uploaderOption
    this.successCallback = successCallback
    this.failureCallback = failureCallback
  }

  upload() {
    console.log( " yes it is uploading ")
    this.directupload.create((error, blob) => {
      if (error) {
        // Handle the error
        console.log( "directupload", error)
        this.failureCallback && this.failureCallback(error)
      } else {
        // Add an appropriately-named hidden input to the form
        // with a value of blob.signed_id
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
    console.log( "directUploadDidProgress= ", e)
    this.uploaderOption.onProgress( e, this.file )
  }
}

export { ActivestorageUploader }
