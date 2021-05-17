function createDevice(username) {
  var deviceID = window.ipcRenderer.sendSync('synchronous-message', 'getting device ID')

}