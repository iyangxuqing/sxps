import { http } from 'http.js'

let app = getApp()

function getBuyerMessages(options = {}) {
  return new Promise(function (resolve, reject) {
    if (app.buyerMessage && !options.nocache) {
      resolve(buyerMessage)
    } else {
      http.get({
        url: 'sxps2/buyer/_buyerMessage.php?m=get'
      }).then(function (res) {
        app.buyerMessages = res.buyerMessages
        resolve(res.buyerMessages)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

export var BuyerMessage = {
  get: getBuyerMessages
}