export class Loading {

  constructor(options) {
    this.page = options.page
    this.timer = null
  }

  show(options) {
    this.timer = setTimeout(function () {
      this.page.setData({
        'loading.show': true,
        'loading.mask': options.mask,
      })
    }.bind(this), 300)
  }

  hide() {
    clearTimeout(this.timer)
    this.page.setData({
      'loading.show': false,
      'loading.mask': false,
    })
  }
}