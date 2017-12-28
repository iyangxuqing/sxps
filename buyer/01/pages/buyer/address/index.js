import { Toptip } from '../../../template/toptip/toptip.js'
import { User } from "../../../utils/user.js"

let app = getApp()

Page({

  data: {
    region: ['浙江省', '金华市', '义乌市'],
  },

  onRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
    })
  },

  onLoad: function (options) {
    this.toptip = new Toptip({ page: this })
    User.getUser().then(function (user) {
      let region = this.data.region
      if (user.receive_province) region[0] = user.receive_province
      if (user.receive_city) region[1] = user.receive_city
      if (user.receive_district) region[2] = user.receive_district
      this.setData({
        region,
        name: user.receive_name,
        address: user.receive_address,
        ready: true,
      })
    }.bind(this))
  },

  onAddressSubmit: function (e) {
    let user = {
      receive_name: e.detail.value.name,
      receive_address: e.detail.value.address,
      receive_district: this.data.region[2],
      receive_city: this.data.region[1],
      receive_province: this.data.region[0],
    }
    User.setUser(user).then(function (res) {
      this.toptip.show({
        title: '地址保存成功',
        success: function () {
          app.listener.trigger('userUpdate', user)
          wx.navigateBack()
        }
      })
    }.bind(this))
  },

  onAddressCancel: function (e) {
    wx.navigateBack()
  }

})