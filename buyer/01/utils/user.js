import { http } from 'http.js'

function login(options) {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        http.post({
          url: 'sxps_buyer/user.php?m=login',
          data: { code: res.code },
          silent: options.silent
        }).then(function (res) {
          wx.setStorageSync('token', res.token)
          wx.setStorageSync('user', res.user)
          resolve()
        })
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

function getUser(options = {}) {
  return new Promise(function (resolve, reject) {
    let user = wx.getStorageSync('user')
    if (user && !options.nocache) {
      resolve(user)
    } else {
      http.get({
        url: 'sxps_buyer/user.php?m=get',
        data: options
      }).then(function (res) {
        wx.setStorageSync('user', res.user)
        resolve(res.user)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setUser(options) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps_buyer/user.php?m=set',
      data: options
    }).then(function (res) {
      let user = wx.getStorageSync('user')
      user = Object.assign({}, user, options)
      wx.setStorageSync('user', user)
      resolve(res)
    }).catch(function (res) {
      reject(res)
    })
  })
}

function mobileCodeRequest(mobile) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps_buyer/mobile.php?m=codeRequest',
      data: {
        tplId: 29922,
        mobile: mobile
      }
    }).then(function (res) {
      let user = wx.getStorageSync('user')
      user.mobileNumber = mobile
      wx.setStorageSync('user', user)
    }).catch(function (res) {
      reject(res)
    })
  })
}

function mobileCodeVerify(mobile, code) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps_buyer/mobile.php?m=codeVerify',
      data: { mobile, code },
    }).then(function (res) {
      resolve(res)
      if (res.mobileVerified === 1) {
        let user = wx.getStorageSync('user')
        user.mobileVerified = 1
        wx.setStorageSync('user', user)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

export var User = {
  login: login,
  getUser: getUser,
  setUser: setUser,
  mobileCodeRequest: mobileCodeRequest,
  mobileCodeVerify: mobileCodeVerify,
}