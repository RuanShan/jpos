import SparkMD5 from "spark-md5"

const fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice

export class FileChecksum {
  static create(file, callback) {
    const instance = new FileChecksum(file)
    instance.create(callback)
  }

  constructor(file) {
    this.file = file
    this.chunkSize = 2097152*4 // 8MB
    // 在ios上， 多个大文件同时计算MD5会导致 this.fileReader.onload不再触发，所以这里只计算前2M的MD5
    // 阿里云不再验证MD5
    this.chunkCount = Math.ceil(this.file.size / this.chunkSize)
    this.chunkIndex = 0
  }

  create(callback) {
    console.debug("FileChecksum create");
    this.callback = callback
    this.md5Buffer = new SparkMD5.ArrayBuffer
    this.fileReader = new FileReader
    this.fileReader.addEventListener("load", event => this.fileReaderDidLoad(event))
    this.fileReader.addEventListener("error", event => this.fileReaderDidError(event))
    console.debug("FileChecksum create before readnext");
    this.readNextChunk()
  }

  fileReaderDidLoad(event) {
    console.debug("fileReaderDidLoad", this.file.name, this.chunkIndex , this.chunkCount);
    this.md5Buffer.append(event.target.result)

    if (!this.readNextChunk()) {
      const binaryDigest = this.md5Buffer.end(true)
      const base64digest = btoa(binaryDigest)
      this.callback(null, base64digest)
    }
  }

  fileReaderDidError(event) {
    this.callback(`Error reading ${this.file.name}`)
  }

  readNextChunk() {
    console.debug("readNextChunk", this.file.name, this.chunkIndex , this.chunkCount);
    if (this.chunkIndex < this.chunkCount || (this.chunkIndex == 0 && this.chunkCount == 0)) {
      const start = this.chunkIndex * this.chunkSize
      const end = Math.min(start + this.chunkSize, this.file.size)
      console.debug("fileSlice0", this.file.name, this.chunkIndex , this.chunkCount);
      const bytes = fileSlice.call(this.file, start, end)
      console.debug("fileSlice1", this.file.name, this.chunkIndex , this.chunkCount);
      this.fileReader.readAsArrayBuffer(bytes)
      console.debug("fileSlice3", this.file.name, this.chunkIndex , this.chunkCount);
      this.chunkIndex++
      return true
    } else {
      return false
    }
  }
}
