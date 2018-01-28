import { User } from '../../utils/user.js'

let defaults = {
  mobile: {
    codeRequestText: '发送验证码',
    number: '',
    code: '',
    numberError: false,
    codeError: false,
    verified: false,
  }
}

let methods = {

  onNumberBlur: function (e) {
    let mobileNumber = e.detail.value
    var reg = /^1[3|4|5|7|8]\d{9}$/
    if (reg.test(mobileNumber)) {
      User.setUser({
        mobileNumber: mobileNumber
      })
    }
  },

  onCodeRequest: function (e) {
    let mobile = e.detail.value.number
    if (mobile == '') return

    let codeRequestText = this.page.data.mobile.codeRequestText
    if (codeRequestText != '发送验证码') return

    var reg = /^1[3|4|5|7|8]\d{9}$/
    if (!reg.test(mobile)) {
      getApp().listener.trigger('toptip', '手机号码输入有误')
      this.page.setData({
        'mobile.numberError': true
      })
      return
    }

    this.page.setData({
      'mobile.number': mobile,
      'mobile.codeRequested': true,
    })

    User.mobileCodeRequest(mobile).then(function (res) {
      if (res.error == 'this mobile is used') {
        getApp().listener.trigger('toptip', '手机号码已被绑定')
        this.page.setData({
          'mobile.numberError': true
        })
      }
    }.bind(this))

    let second = 60
    this.page.setData({
      'mobile.codeRequestText': '60秒后重发'
    })
    let timer = setInterval(function () {
      second--
      if (second == 0) {
        let codeRequestText = '发送验证码'
        this.page.setData({
          'mobile.codeRequestText': codeRequestText
        })
        clearInterval(timer)
      } else {
        let codeRequestText = second + '秒后重发'
        if (second < 10) codeRequestText = '0' + codeRequestText
        this.page.setData({
          'mobile.codeRequestText': codeRequestText
        })
      }
    }.bind(this), 1000)
  },

  onNumberInputFocus: function (e) {
    this.page.setData({
      'mobile.numberError': false
    })
  },

  onCodeInput: function (e) {
    this.page.setData({
      'mobile.code': e.detail.value
    })
  },

  onCodeInputFocus: function (e) {
    this.page.setData({
      'mobile.codeError': false
    })
  },

  onCodeConfirm: function (e) {
    let mobile = this.page.data.mobile.number
    let code = this.page.data.mobile.code
    if (code == '') return;

    User.mobileCodeVerify(mobile, code).then(function (res) {
      if (!res.error) {
        this.page.setData({
          'mobile.codeInputAnimateCss': 'slideUp'
        })
        setTimeout(function () {
          this.page.setData({
            'mobile.verified': true,
            'mobile.codeRequested': false,
          })
        }.bind(this), 300)
      } else {
        this.page.setData({
          'mobile.codeError': true
        })
        getApp().listener.trigger('toptip', '验证码错误')
      }
    }.bind(this)).catch(function (res) {
      this.page.setData({
        'mobile.codeError': true
      })
      getApp().listener.trigger('toptip', '验证码错误')
    }.bind(this))
  }
}

export class Mobile {

  constructor(options) {
    console.log(options)
    options = Object.assign({}, defaults, options)
    console.log(options)
    this.page = options.page
    this.page.setData({
      mobile: options.mobile
    })
    for (let key in methods) {
      this.page['mobile.' + key] = methods[key].bind(this)
      this.page.setData({
        ['mobile.' + key]: 'mobile.' + key
      })
    }
  }

}