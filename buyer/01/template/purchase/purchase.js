import { getSelectSpecs, setShoppings, setHistoryItems, setSelectSpecs } from '../../utils/shoppings.js'

const Content_Height_With_Specs = 700
const Content_Height_Without_Specs = 520

let defaults = {}

let methods = {

  onSpecsTap: function(e) {
    let index = e.target.dataset.index
    let item = this.page.data.purchase.item
    for(let i in item.specs) {
      item.specs[i].active = false
    }
    item.specs[index].active = true
    this.page.setData({
      'purchase.item.specs': item.specs,
      'purchase.specsIndex': index
    })
    /* 在localStorage中记录商品选择的属性 */
    setSelectSpecs(item)
  },

  onImageTap: function(e){
    let imageTop = -100
    let imageLarge = this.page.data.purchase.imageLarge
    let contentHeight = this.page.data.purchase.contentHeight
    if (!imageLarge) {
      if (contentHeight == Content_Height_With_Specs) {
        imageTop = -180
      } else {
        imageTop = -360
      }
    }
    this.page.setData({
      'purchase.imageTop': imageTop,
      'purchase.imageLarge': !imageLarge
    })
  },

  onNumberMinus: function (e) {
    let item = this.page.data.purchase.item
    let specsIndex = this.page.data.purchase.specsIndex
    let specs = item.specs[specsIndex]
    if (!specs.num) specs.num = 0
    if (specs.num > 0) specs.num--
    if (specs.num < 0) specs.num = 0
    item.num = 0
    for (let i in item.specs) {
      item.num += Number(item.specs[i].num)
    }
    this.page.setData({
      'purchase.item': item
    })
  },

  onNumberPlus: function (e) {
    let item = this.page.data.purchase.item
    let specsIndex = this.page.data.purchase.specsIndex
    let specs = item.specs[specsIndex]
    if (!specs.num) specs.num = 0
    if (specs.num < 9999) specs.num = Number(specs.num) + 1
    item.num = 0
    for (let i in item.specs) {
      item.num += Number(item.specs[i].num)
    }
    this.page.setData({
      'purchase.item': item
    })
  },

  onNumberInput: function (e) {
    let item = this.page.data.purchase.item
    let specsIndex = this.page.data.purchase.specsIndex
    let specs = item.specs[specsIndex]
    specs.num = e.detail.value
    if (specs.num < 0) specs.num = 0
    item.num = 0
    for (let i in item.specs) {
      item.num += Number(item.specs[i].num)
    }
    this.page.setData({
      'purchase.item': item
    })
  },

  onMessageInput: function (e) {
    let item = this.page.data.purchase.item
    let specsIndex = this.page.data.purchase.specsIndex
    let specs = item.specs[specsIndex]
    specs.message = e.detail.value
    this.page.setData({
      'purchase.item': item
    })
  },

  onCancel: function (e) {
    this.page.setData({
      'purchase.show': false,
      'purchase.imageLarge': false,
      'purchase.imageTop': 0,
      'purchase.contentHeight': 0
    })
  },

  onConfirm: function (e) {
    let item = this.page.data.purchase.item
    setShoppings(item)
    setHistoryItems(item)
    this.onPurchase && this.onPurchase(item)
    this.onCancel()
  }

}

export class Purchase {

  constructor(options) {
    options = Object.assign({}, defaults, options)
    this.page = options.page
    this.onPurchase = options.onPurchase
    for (let key in methods) {
      this[key] = methods[key].bind(this)
      this.page['purchase.' + key] = methods[key].bind(this)
      this.page.setData({
        ['purchase.' + key]: 'purchase.' + key
      })
    }
  }

  show(item) {
    /* 根据是否是单品，决定弹出内容的高度 */
    let contentHeight = Content_Height_Without_Specs
    if (item.specs.length > 1) {
      contentHeight = Content_Height_With_Specs
    }

    /* 根据以前的选择，决定当前选择的商品属性 */
    let specsIndex = getSelectSpecs(item)
    for (let i in item.specs) {
      item.specs[i].active = false
    }
    item.specs[specsIndex].active = true

    this.page.setData({
      'purchase.show': true,
      'purchase.imageTop': -100,
      'purchase.imageLarge': false,
      'purchase.item': item,
      'purchase.specsIndex': specsIndex,
      'purchase.contentHeight': contentHeight
    })
  }

}