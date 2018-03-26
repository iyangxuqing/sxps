import { http } from 'http.js'

let app = getApp()

function getCates(options = {}) {
  return new Promise(function (resolve, reject) {
    if (app.cates && !options.nocache) {
      resolve(cates)
    } else {
      http.get({
        url: 'sxps2/buyer/_cate.php?m=get'
      }).then(function (res) {
        let cates = transformCates(res.cates)
        app.cates = cates
        resolve(cates)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function transformCates(cates) {
  let _cates = []
  for (let i in cates) {
    if (cates[i].pid == 0) {
      cates[i].children = []
      _cates.push(cates[i])
    } else {
      for (let j in _cates) {
        if (cates[i].pid == _cates[j].id) {
          _cates[j].children.push(cates[i])
          break
        }
      }
    }
  }
  return _cates
}

export var Cate = {
  getCates: getCates,
}