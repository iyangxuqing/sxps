import { http } from 'http.js'

let app = getApp()

function getItems_seller(options = {}) {
  return new Promise(function (resolve, reject) {
    let items = app.items_seller
    if (items && !options.nocache) {
      resolve(app.items_seller)
    } else {
      http.get({
        url: 'sxps_seller/item.php?m=get',
      }).then(function (res) {
        let items = res.items
        for (let i in items) {
          if (!items[i].images) items[i].images = '[]'
          items[i].images = JSON.parse(items[i].images)
          items[i].price = Number(items[i].price).toFixed(2)
        }
        app.items_seller = items
        resolve(items)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setItem_seller(item, method) {
  return new Promise(function (resolve, reject) {
    let user = wx.getStorageSync('user')
    if (user.role == 'seller_admin') {
      http.get({
        url: 'sxps_seller/item.php?m=' + method,
        data: item
      }).then(function (res) {
        let items = res.items
        for (let i in items) {
          if (!items[i].images) items[i].images = '[]'
          items[i].images = JSON.parse(items[i].images)
          items[i].price = Number(items[i].price).toFixed(2)
        }
        app.items_seller = items
        app.listener.trigger('items', items)
        resolve(items)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

export var Item = {
  getItems_seller: getItems_seller,
  setItem_seller: setItem_seller,
}