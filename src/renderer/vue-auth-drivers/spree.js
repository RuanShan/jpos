module.exports = {
  request: function (req, token) {
    req.headers.set('X-Spree-Token', token)
  },
  response: function (res) {
    return (res.data.data || {}).token
  }
}
