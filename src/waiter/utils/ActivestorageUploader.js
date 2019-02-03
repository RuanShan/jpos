import { DirectUpload } from "activestorage"

class ActivestorageUploader {
  constructor(file, url, uploaderOption, successCallback, failureCallback) {
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
        // this.failureCallback(error)
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

  directUploadDidProgress(event) {
    // Use event.loaded and event.total to update the progress bar
  }
}

export { ActivestorageUploader }
