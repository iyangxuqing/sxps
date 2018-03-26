import { Item } from '../../../utils/items.js'
import { Trade } from '../../../utils/trades.js'
import { User } from '../../../utils/user.js'
import { removeShoppings } from '../../../utils/shoppings.js'
import { Purchase } from '../../../template/purchase/purchase.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2
  },

  onOrderTap: function (e) {
    let iid = e.currentTarget.dataset.iid
    let sid = e.currentTarget.dataset.sid
    let item = {}
    Item.getItems().then(function (items) {
      for (let i in items) {
        if (items[i].id == iid) {
          item = items[i]
          break
        }
      }
      for (let i in item.specs) {
        item.specs[i].active = false
        if (item.specs[i].id == sid) {
          item.specs[i].active = true
        }
      }
      this.purchase.show(item)
    }.bind(this))
  },

  onGotoBuy: function (e) {
    wx.switchTab({
      url: '../items/index'
    })
  },

  onOrderSubmit: function (e) {
    User.getUser().then(function (user) {
      if (user.receive_name && user.receive_address && user.mobileVerified == 1) {
        wx.showModal({
          title: '订单提交',
          content: '确定把购物车中的商品进行提交吗？',
          success: function (res) {
            if (res.confirm) {
              let orders = this.data.orders
              Trade.addTrade_buyer(orders).then(function () {
                wx.showModal({
                  title: '订单提交',
                  content: '订单提交成功，将进入采买程序。',
                  showCancel: false,
                  success: function () {
                    removeShoppings()
                    app.listener.trigger('shoppings')
                    app.listener.trigger('trades')
                    this.setData({ orders: [] })
                    this.getSummary()
                  }.bind(this)
                })
              }.bind(this))
            }
          }.bind(this)
        })
      } else {
        wx.showModal({
          title: '订单提交',
          content: '您需要到“我的”页面中完善收货人信息后才能进行订单提交。',
          showCancel: false,
        })
      }
    }.bind(this))
  },

  getSummary: function () {
    let zNum = 0;
    let zAmount = 0;
    let orders = this.data.orders
    for (let i in orders) {
      zNum = zNum + Number(orders[i].num)
      zAmount = zAmount + orders[i].num * orders[i].price
    }
    this.setData({
      zNum: zNum,
      zAmount: Number(zAmount).toFixed(2),
    })
  },

  loadData: function () {
    let shoppings = wx.getStorageSync('shoppings')
    Item.getItems().then(function (items) {
      let orders = []
      for (let i in shoppings) {
        let shopping = shoppings[i]
        for (let j in items) {
          let item = items[j]
          for (let k in item.specs) {
            let specs = item.specs[k]
            if (shopping.iid == item.id && shopping.sid == specs.id) {
              let order = {
                iid: item.id,
                sid: specs.id,
                title: item.specs[0].title,
                specs: k == 0 ? '' : specs.title,
                descs: specs.descs,
                image: specs.image,
                price: specs.price,
                num: shopping.num,
                message: shopping.message
              }
              orders.push(order)
              break
            }
          }
        }
      }
      this.setData({ orders })
      this.getSummary()
    }.bind(this))
  },

  onShoppingsUpdate: function () {
    this.loadData()
  },

  onLoad: function (options) {
    app.listener.on('shoppings', this.onShoppingsUpdate)
    this.purchase = new Purchase({ page: this })
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

  },

  onShareAppMessage: function () {

  }
})