import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'
import { getShoppings } from '../../../utils/shoppings.js'
import { BuyerMessage } from '../../../utils/buyerMessage.js'

import { Cates } from '../../../template/cates/cates.js'
import { Items } from '../../../template/items/items.js'
import { Purchase } from '../../../template/purchase/purchase.js'

let app = getApp()

Page({

  data: {
    showItemsType: 'category',
    youImageMode_v2: app.youImageMode_v2,
  },

  onSearchInput: function (e) {
    let value = e.detail.value
    this.setData({
      searchWord: value,
    })
  },

  onSearchCancel: function (e) {
    this.setData({
      searchWord: '',
      searching: false,
    })
    let showItemsType = this.data.showItemsType
    if (showItemsType == 'history') {
      this.onSearchHistory()
    } else {
      this.onCateChanged()
    }
  },

  onSearch: function (e) {
    let searchWord = this.data.searchWord
    if (searchWord) {
      Item.getItems().then(function (items) {
        this.items.update(items, { searchWord })
        this.setData({ searching: true })
      }.bind(this))
    }
  },

  onSearchHistory: function (e) {
    let historyItems = wx.getStorageSync('historyItems')
    Item.getItems().then(function (items) {
      this.items.update(items, { ids: historyItems })
      this.setData({
        searching: false,
        showItemsType: 'history',
      })
    }.bind(this))
  },

  onCateChanged: function (cid) {
    if (!cid) cid = this.cates.getActiveCId()
    Item.getItems().then(function (items) {
      this.items.update(items, { cid })
      this.setData({
        searching: false,
        showItemsType: 'category',
      })
    }.bind(this))
  },

  onItemTap: function (item) {
    this.purchase.show(item)
  },

  onShoppingsUpdate: function () {
    let items = this.data.items.items
    getShoppings(items)
    this.setData({
      'items.items': items,
    })
  },

  onNetFailRetry: function (e) {
    let id = e.currentTarget.dataset.id
    if (id == 1001) {
      this.setData({
        'netfail.show': false,
      })
      this.loadData()
    }
  },

  loadData: function (options) {
    Promise.all([
      Cate.getCates(options),
      Item.getItems(options)
    ]).then(function (res) {
      let cates = res[0]
      let items = res[1]
      getShoppings(items)
      this.cates.update(cates)
      let cid = this.cates.getActiveCId()
      this.items.update(items, { cid })
      this.setData({ ready: true })
    }.bind(this)).catch(function (res) {
      this.setData({
        'netfail.id': 1001,
        'netfail.show': true,
      })
    }.bind(this))
  },

  onLoad: function (options) {
    app.listener.on('shoppings', this.onShoppingsUpdate)
    this.cates = new Cates({
      page: this,
      cateChanged: this.onCateChanged
    })
    this.items = new Items({
      page: this,
      itemTap: this.onItemTap
    })
    this.purchase = new Purchase({
      page: this,
      onPurchase: this.onPurchase
    })
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