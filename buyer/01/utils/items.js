import { http } from 'http.js'

let app = getApp()

function getItems(options = {}) {
  return new Promise(function (resolve, reject) {
    if (app.items && !options.nocache) {
      resolve(app.items)
    } else {
      http.get({
        url: 'sxps2/buyer/_item.php?m=get'
      }).then(function (res) {
        let items = res.items
        for (let i in items) {
          for (let j in items[i].specs) {
            items[i].specs[j].price = Number(items[i].specs[j].price).toFixed(2)
          }
        }
        app.items = items
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