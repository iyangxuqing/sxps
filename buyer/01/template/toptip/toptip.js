export class Toptip {

  constructor(options) {
    this.page = options.page
    this.timer = null
  }

  show(options) {
    this.page.setData({
      'toptip.show': 'show',
      'toptip.title': options.title,
    })
    clearTimeout(this.timer)
    this.timer = setTimeout(function () {
      this.page.setData({
        'toptip.show': ''
      })
      options.success && options.success()
    }.bind(this), 1500)
  }

}