import { http } from 'http.js'
import { Dataver } from 'dataver.js'

let app = getApp()

function getItems(options = {}) {
  return new Promise(function (resolve, reject) {
    let items = wx.getStorageSync('items')
    let expired = Dataver.getExpired('items')
    if (items && !expired && !options.nocache) {
      resolve(items)
    } else {
      http.get({
        url: 'sxps_buyer/item.php?m=get',
        data: { onShelf: 1 },
      }).then(function (res) {
        let items = res.items
        for (let i in items) {
          if (!items[i].images) items[i].images = '[]'
          items[i].images = JSON.parse(items[i].images)
          items[i].price = Number(items[i].price).toFixed(2)
        }
        wx.setStorageSync('items', items)
        Dataver.setExpired('items', res.dataver)
        resolve(items)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

export var Item = {
  getItems: getItems,
}