import { http } from 'http.js'
import { Item } from 'items.js'

let app = getApp()

/**
 * 读取卖家订单，按时间段、分页、订单状态来读取
 * options.status, 按状态读取
 * options.lastRowId, 分页读取, 读回id>lastRowId的最近10条记录
 * options.startTime, options.endTime,按时段[startTime, endTime)读取
 * options.desc, 按tid倒序读取
 */
function getTrades_seller(options = {}) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps_seller/trade.php?m=get',
      data: options
    }).then(function (res) {
      let trades = transformTrades(res.trades)
      resolve(trades)
    }).catch(function (res) {
      reject(res)
    })
  })
}

/**
 * 设置订单trade或子订单order的数据、状态，可以是单个订单或数组订单
 * 一般由卖家管理端调用
 */
function setTrades_seller(options) {
  return new Promise(function (resolve, reject) {
    let user = wx.getStorageSync('user')
    if (user.role == 'seller_admin') {
      if (!('length' in options)) options = [options]
      http.post({
        url: 'sxps_seller/trade.php?m=set',
        data: options
      }).then(function (res) {
        resolve(res)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

/**
 * 转换订单数据，将服务器返回的订单数据进行订单金额计算、补充文本状态等
 */
function transformTrades(trades) {
  for (let i in trades) {
    let trade = trades[i]
    let num = 0;
    let amount = 0;
    let realNum = 0;
    let realAmount = 0;
    switch (trade.status) {
      case '买家提交':
        trade.txtStatus = '待发货'
        break
      case '卖家发货':
        trade.txtStatus = '已发货'
        break
      case '买家收货':
        trade.txtStatus = '已收货'
        break
      case '订单完成':
        trade.txtStatus = '已完成'
        break
    }
    for (let j in trade.orders) {
      let order = trade.orders[j]
      order.amount = (Number(order.num) * order.price).toFixed(2)
      order.realAmount = (Number(order.realNum) * order.price).toFixed(2)
      num = num + Number(order.num)
      amount = amount + Number(order.amount)
      realNum = realNum + Number(order.realNum)
      realAmount = realAmount + Number(order.realAmount)
    }
    trade.time = new Date(trade.created * 1000).Format('yyyy-MM-dd hh:mm:ss')
    trade.num = num
    trade.amount = amount.toFixed(2)
    trade.realNum = realNum
    trade.realAmount = realAmount.toFixed(2)
  }
  return trades
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export var Trade = {
  getTrades_seller: getTrades_seller,
  setTrades_seller: setTrades_seller,
}