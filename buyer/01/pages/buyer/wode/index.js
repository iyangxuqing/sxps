import { Toptip } from '../../../template/toptip/toptip.js'
import { Mobile } from '../../../template/mobile/mobile.js'
import { User } from '../../../utils/user.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    sellerInfo: {
      title: '义乌铱星生鲜配送',
      logo: '/images/icon/logo.png',
      phone: '13757950478',
      version: '1.0.28',
    },
    tradeLinks: [{
      title: '已提交',
      status: '买家提交',
      icon: '/images/icon/order-uncommitted.png',
    }, {
      title: '已发货',
      status: '卖家发货',
      icon: '/images/icon/order-submitted.png',
    }, {
      title: '已收货',
      status: '买家收货',
      icon: '/images/icon/order-shipped.png',
    }, {
      title: '已完成',
      status: '订单完成',
      icon: '/images/icon/order-completed.png',
    }]
  },

  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      User.setUser(e.detail.userInfo)
    }
  },

  onAddressTap: function (e) {
    wx.navigateTo({
      url: '../address/index'
    })
  },

  onToptip: function (message) {
    this.toptip.show({
      title: message
    })
  },

  onUserUpdate: function (user) {
    this.setData({ user })
  },

  onLinkTap: function (e) {
    let index = e.currentTarget.dataset.index
    let tradeLinks = this.data.tradeLinks
    let status = ''
    if (index >= 0) status = tradeLinks[index].status
    wx.setStorageSync('buyerTradeStatus', { status: status })
    wx.switchTab({
      url: '../trades/index',
    })
  },

  onShopTeleTap: function (e) {
    let phoneNumber = e.currentTarget.dataset.phoneNumber
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },

  onNetFailRetry: function (e) {
    let id = e.currentTarget.dataset.id
    if (id == 1003) {
      this.setData({
        'netfail.show': false,
      })
      this.loadData()
    }
  },

  loadData: function (options) {
    User.getUser().then(function (user) {
      this.setData({
        'ready': true,
        'user.receive_name': user.receive_name,
        'user.receive_phone': user.receive_phone,
        'user.receive_province': user.receive_province,
        'user.receive_city': user.receive_city,
        'user.receive_district': user.receive_district,
        'user.receive_address': user.receive_address,
        'userInfo.nickName': user.nickName,
        'userInfo.avatarUrl': user.avatarUrl,
        'mobile.number': user.mobileNumber,
        'mobile.verified': user.mobileVerified == '1',
      })
    }.bind(this)).catch(function (res) {
      this.setData({
        'netfail.id': 1003,
        'netfail.show': true,
      })
    }.bind(this))
  },

  onLoad: function (options) {
    app.listener.on('toptip', this.onToptip)
    app.listener.on('userUpdate', this.onUserUpdate)
    this.toptip = new Toptip({ page: this })
    this.mobile = new Mobile({ page: this })
    this.loadData()
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