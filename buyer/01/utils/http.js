let config = require('config.js')

let requestNum = 0

function get(options) {
  return new Promise(function (resolve, reject) {
    if (!options.silent) {
      requestNum++
      if (requestNum == 1) wx.showNavigationBarLoading()
    }
    wx.request({
      url: config.apiUrl + options.url,
      header: {
        'ver': config.ver,
        'aid': config.aid,
        'token': wx.getStorageSync('token'),
        'Content-Type': 'application/json',
      },
      data: options.data,
      success: function (res) {
        if (res.data && res.data.errno === 0) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        getApp().listener.trigger('netfail', options.url)
        reject(res)
      },
      complete: function (res) {
        if (!options.silent) {
          requestNum--
          if (requestNum == 0) wx.hideNavigationBarLoading()
        }
      }
    })
  })
}

function post(options) {
  return new Promise(function (resolve, reject) {
    if (!options.silent) {
      requestNum++
      if (requestNum == 1) wx.showNavigationBarLoading()
    }
    wx.request({
      url: config.apiUrl + options.url,
      method: 'POST',
      header: {
        'ver': config.ver,
        'aid': config.aid,
        'token': wx.getStorageSync('token'),
        'Content-Type': 'application/json',
      },
      data: options.data,
      success: function (res) {
        if (res.data && res.data.errno === 0) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        if (!options.silent) {
          requestNum--
          if (requestNum == 0) wx.hideNavigationBarLoading()
        }
      }
    })
  })
}

/**
 * options = {
 *  source: source,
 *  target: target,
 * }
 */
function cosUpload(options) {
  return new Promise(function (resolve, reject) {
    let source = options.source
    let extension = source.split('.').pop()
    let target = config.aid + '/' + options.target + '.' + extension
    http.get({
      url: 'sxps_buyer/cos.php?m=signature',
      data: { filename: target },
      silent: options.silent,
    }).then(function (res) {
      let url = res.url
      let sign = res.multi_signature
      if (!options.silent) wx.showNavigationBarLoading()
      wx.uploadFile({
        url: url,
        name: 'filecontent',
        filePath: source,
        header: { Authorization: sign },
        formData: {
          op: 'upload',
          insertOnly: 0,
        },
        success: function (res) {
          if (res.statusCode == 200) {
            let data = JSON.parse(res.data)
            if (data.message && data.message == 'SUCCESS') {
              let url = config.youImageHost + target
              resolve({
                url,
                target,
                errno: 0,
                error: '',
              })
            } else {
              reject(res)
            }
          }
        },
        fail: function (res) {
          reject(res)
        },
        complete: function (res) {
          // wx.hideNavigationBarLoading()
        }
      })
    })
  })
}

/**
 * options = {
 *  filename: filename
 * }
 */
function cosDelete(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps_buyer/cos.php?m=signature',
      data: { filename: options.filename },
      silent: options.silent,
    }).then(function (res) {
      let url = res.url
      let sign = res.once_signature
      if (!options.silent) wx.showNavigationBarLoading()
      wx.request({
        url: url,
        header: { 'Authorization': sign },
        method: 'POST',
        data: { op: "delete" },
        success: function (res) {
          if (res.statusCode === 200) {
            let data = res.data
            if (data.message && data.message === 'SUCCESS') {
              resolve({ errno: 0, error: '' })
            }
          }
        },
        fail: function (res) {
          reject(res)
        },
        complete: function (res) {
          // wx.hideNavigationBarLoading()
        }
      })
    })
  })
}

function chooseImage() {
  return new Promise(function (resolve, reject) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        let tempFilePath = res.tempFilePaths[0]
        http.cosUpload({
          source: tempFilePath,
          target: Date.now()
        }).then(function (res) {
          resolve(res.url)
        }).catch(function (res) {
          reject(res)
        })
      },
    })
  })
}

export var http = {
  get: get,
  post: post,
  cosUpload: cosUpload,
  cosDelete: cosDelete,
  chooseImage: chooseImage,
}