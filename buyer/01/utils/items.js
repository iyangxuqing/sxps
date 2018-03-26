import { http } from 'http.js'

let app = getApp()

function getItemsWithBuyerMessage(options = {}) {
  return new Promise(function (resolve, reject) {
    if (app.items && !options.nocache) {
      resolve(app.items)
    } else {
      Promise.all([
        getItems(),
        getBuyerMessages()
      ]).then((res) => {
        let items = res[0]
        let buyerMessages = res[1]
        let matchCounts = 0
        for (let i in items) {
          let iid = items[i].id
          for (let j in items[i].specs) {
            let sid = items[i].specs[j].id
            for (let k in buyerMessages) {
              if (iid == buyerMessages[k].iid && sid == buyerMessages[k].sid) {
                items[i].specs[j].message = buyerMessages[k].message
                matchCounts++
                break
              }
            }
            /* 所有的buyerMessages都已经匹配完成 */
            if (matchCounts == buyerMessages.length) break
          }
          if (matchCounts == buyerMessages.length) break
        }
        app.items = items
        resolve(items)
      })
    }
  })
}

function getItems() {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps2/buyer/_item.php?m=get'
    }).then(function (res) {
      let items = res.items
      for (let i in items) {
        for (let j in items[i].specs) {
          items[i].specs[j].price = Number(items[i].specs[j].price).toFixed(2)
        }
      }
      resolve(items)
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getBuyerMessages() {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps2/buyer/_buyerMessage.php?m=get'
    }).then(function (res) {
      resolve(res.buyerMessages)
    }).catch(function (res) {
      reject(res)
    })
  })
}

export var Item = {
  getItems: getItemsWithBuyerMessage
}