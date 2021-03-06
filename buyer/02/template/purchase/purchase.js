let defaults = {}

function setShopping(item) {
  let historyItems = wx.getStorageSync('historyItems') || []
  for (let i in historyItems) {
    if (historyItems[i].id == item.id) {
      historyItems.splice(i, 1)
      break
    }
  }
  historyItems.unshift({ id: item.id })
  while (historyItems.length > 30) historyItems.pop()
  wx.setStorageSync('historyItems', historyItems)

  let shoppings = wx.getStorageSync('shoppings') || []
  let shopping = {
    iid: item.id,
    num: item.num,
    message: item.message,
  }
  let index = -1
  for (let i in shoppings) {
    if (shoppings[i].iid == item.id) {
      shoppings[i] = shopping
      index = i
      break
    }
  }
  if (index < 0) shoppings.push(shopping)
  if (shopping.num == 0) shoppings.splice(index, 1)
  wx.setStorageSync('shoppings', shoppings)
  getApp().listener.trigger('shoppings')
}

let methods = {

  onPurchaseCancel: function (e) {
    this.page.setData({
      'purchase.show': false
    })
  },

  onPurchaseConfirm: function (e) {
    let item = this.page.data.purchase.item
    this.page.setData({
      'purchase.show': false
    })
    setShopping(item)
  },

  onPurchaseImageTap: function(e){
    let item = this.page.data.purchase.item
    let image = item.images[0]
    wx.previewImage({
      urls: [image]
    })
  },

  onPurchaseNumberMinus: function (e) {
    let item = this.page.data.purchase.item
    if (!item.num) item.num = 0
    if (item.num > 0) item.num--
    if (item.num < 0) item.num = 0
    item.amount = Number(item.num * item.price).toFixed(2)
    this.page.setData({
      'purchase.item': item,
    })
  },

  onPurchaseNumberPlus: function (e) {
    let item = this.page.data.purchase.item
    if (!item.num) item.num = 0
    if (item.num < 9999) item.num = Number(item.num) + 1
    item.amount = Number(item.num * item.price).toFixed(2)
    this.page.setData({
      'purchase.item': item,
    })
  },

  onPurchaseNumberInput: function (e) {
    let item = this.page.data.purchase.item
    item.num = e.detail.value
    if (item.num < 0) item.num = 0
    item.amount = Number(item.num * item.price).toFixed(2)
    this.page.setData({
      'purchase.item': item,
    })
  },

  onPurchaseMessageInput: function (e) {
    let item = this.page.data.purchase.item
    item.message = e.detail.value
    this.page.setData({
      'purchase.item': item,
    })
  },

}

export class Purchase {

  constructor(options) {
    options = Object.assign({}, defaults, options)
    this.page = options.page
    for (let key in methods) {
      this[key] = methods[key].bind(this)
      this.page['purchase.' + key] = methods[key].bind(this)
      this.page.setData({
        ['purchase.' + key]: 'purchase.' + key
      })
    }
  }

  show(item) {
    let num = item.num ? item.num : 0
    item.amount = Number(num * item.price).toFixed(2)
    this.page.setData({
      'purchase.item': item,
      'purchase.show': true,
    })
  }

}