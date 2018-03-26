export function getShoppings(items) {
  let shoppings = wx.getStorageSync('shoppings') || []
  for (let i in items) {
    let item = items[i]
    item.num = 0
    for (let j in item.specs) {
      let specs = item.specs[j]
      specs.num = 0
      specs.message = ''
      for (let k in shoppings) {
        let shopping = shoppings[k]
        if (item.id == shopping.iid && specs.id == shopping.sid) {
          specs.num = shopping.num
          specs.message = shopping.message
          item.num += Number(specs.num)
          break
        }
      }
    }
  }
}

export function setShoppings(item) {

  /**
   * 更新全局app.items
   */
  let items = getApp().items
  for (let i in items) {
    if (items[i].id == item.id) {
      items[i] = item
    }
  }

  /**
   * 记录购物车数据到本地
   */
  let shoppings = wx.getStorageSync('shoppings') || []
  for (let i in item.specs) {
    let specs = item.specs[i]
    let index = -1
    for (let j in shoppings) {
      let shopping = shoppings[j]
      if(item.id == shopping.iid && specs.id == shopping.sid) {
        index = j
        shopping.num = specs.num
        shopping.message = specs.message
        break
      }
    }
    if (index < 0) {
      shoppings.push({
        iid: item.id,
        sid: specs.id,
        num: specs.num,
        message: specs.message
      })
    }
  }
  shoppings = shoppings.filter((shopping) => {
    return shopping.num > 0
  })
  wx.setStorageSync('shoppings', shoppings)
  getApp().listener.trigger('shoppings')
}

export function removeShoppings() {
  /**
   * 更新全局app.items
   */
  let items = getApp().items
  for (let i in items) {
    items[i].num = 0
    for (let j in items[i].specs) {
      items[i].specs[j].num = 0
      items[i].specs[j].message = ''
    }
  }  
  
  wx.removeStorageSync('shoppings')
}

/**
 *  选购过的商品，推进入常购清单列表
 */
export function setHistoryItems(item) {
  let historyItems = wx.getStorageSync('historyItems') || []
  for (let i in historyItems) {
    if (historyItems[i].id == item.id) {
      historyItems.splice(i, 1)
      break
    }
  }
  historyItems.unshift({ id: item.id })
  while (historyItems.length > 50) {
    historyItems.pop()
  }
  wx.setStorageSync('historyItems', historyItems)
}

/**
 * 选购过的商品，记录选择的商品属性
 */
export function setSelectSpecs(item) {
  if (item.specs.length <= 1) return
  let sid = 0
  for (let i in item.specs) {
    if (item.specs[i].active == true) {
      sid = i
      break
    }
  }
  if (sid == 0) return
  let selectSpecs = wx.getStorageSync('selectSpecs') || {}
  selectSpecs['_' + item.id] = sid
  wx.setStorageSync('selectSpecs', selectSpecs)
}

export function getSelectSpecs(item) {
  /* 如果是单品，没有属性，则返回0 */
  if (item.specs.length <= 1) return 0
  /* 以前有过选择属性的，返回以前选择的属性，否则返回1 */
  let selectSpecs = wx.getStorageSync('selectSpecs') || {}
  return selectSpecs['_' + item.id] || 1
}