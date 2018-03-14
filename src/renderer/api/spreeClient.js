import UrlAssembler from 'url-assembler'
// import camelize from 'camelize';
import axios from 'axios'

class SpreeClient extends UrlAssembler {
  constructor (baseUrlOrUrlAssembler) {
    super(baseUrlOrUrlAssembler)

    if (baseUrlOrUrlAssembler instanceof UrlAssembler) {
      this._token = baseUrlOrUrlAssembler._token
    }

    // SpreeApiClient.endpoints().forEach((endpoint) =>
    //  this[camelize(endpoint)] = function(id){
    //    if (typeof id != "undefined") {
    //      return this.segment(`/${endpoint}/:id`).param({ id: id })
    //    } else {
    //      return this.segment(`/${endpoint}`)
    //    }
    //  }
    // );
  }

  spreeToken (token) {
    var chainable = this._chain()
    chainable._token = token
    return chainable
  }

  get (path) {
    return axios.get(this.toString() + path, this.headers())
  }

  head (path) {
    return axios.head(this.toString() + path, this.headers())
  }

  delete (path) {
    return axios.delete(this.toString() + path, this.headers())
  }

  post (path, data) {
    return axios.post(this.toString(), data, this.headers())
  }

  put (path, data) {
    return axios.put(this.toString(), data, this.headers())
  }

  patch (data) {
    return axios.patch(this.toString(), data, this.headers())
  }

  headers () {
    if (this._token) {
      return {headers: { 'X-Spree-Token': this._token }}
    } else {
      return {}
    }
  }

  static endpoints () {
    return [ 'products', 'product_properties', 'variants', 'orders',
      'line_items', 'checkouts', 'payments', 'return_authorizations',
      'shipments', 'taxonomies', 'addresses', 'countries', 'stock_locations',
      'stock_items', 'stock_movements', 'zones', 'next', 'apply_coupon_code']
  }
}

export default SpreeClient
