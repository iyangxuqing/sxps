import { Loading } from '../../../template/loading/loading.js'
import { Toptip } from '../../../template/toptip/toptip.js'
import { Mobile } from '../../../template/mobile/mobile.js'
import { User } from '../../../utils/user.js'

let app = getApp()

Page({

  data: {
    version: app.version,
    youImageMode: app.youImageMode_v2,
    sellerInfo: {
      title: '义乌市铱星生鲜配送',
      logo: '/images/icon/logo.png',
      phone: '13757950478',
    },
  },

  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      User.setUser(e.detail.userInfo)
    }
  },

  onToptip: function (message) {
    this.toptip.show({
      title: message
    })
  },

  onUserUpdate: function (user) {
    this.setData({ user })
  },

  onShopTeleTap: function (e) {
    let phoneNumber = e.currentTarget.dataset.phoneNumber
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },

  onLoad: function (options) {
    this.loading = new Loading()
    this.toptip = new Toptip()
    this.mobile = new Mobile()
    app.listener.on('toptip', this.onToptip)
    app.listener.on('userUpdate', this.onUserUpdate)

    this.loading.show()
    User.getUser().then(function (user) {
      this.setData({
        'ready': true,
        'userInfo.nickName': user.nickName,
        'userInfo.avatarUrl': user.avatarUrl,
        'mobile.number': user.mobileNumber,
        'mobile.verified': user.mobileVerified == '1',
      })
      this.loading.hide()
    }.bind(this)).catch(function (res) {
      this.loading.hide()
    }.bind(this))

  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  }

})