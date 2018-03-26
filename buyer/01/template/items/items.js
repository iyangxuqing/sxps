import { Item } from '../../utils/items.js'

let defaults = {}

let methods = {

  onItemTap: function (e) {
    let id = e.currentTarget.dataset.id
    let items = this.page.data.items.items
    let item = {}
    for (let i in items) {
      if (items[i].id == id) {
        item = items[i]
        break
      }
    }
    this.itemTap && this.itemTap(item)
  },

}

export class Items {

  constructor(options) {
    options = Object.assign({}, defaults, options)
    this.page = options.page
    this.itemTap = options.itemTap
    for (let key in methods) {
      this[key] = methods[key].bind(this)
      this.page['items.' + key] = methods[key].bind(this)
      this.page.setData({
        ['items.' + key]: 'items.' + key
      })
    }
  }

  update(items, filter = {}) {
    let cid = filter.cid
    let ids = filter.ids
    let searchWord = filter.searchWord

    let _items = items.filter((item) => {
      if (cid) {
        return item.cid == cid
      }
      else if (ids) {
        for (let i in ids) {
          /* 常购清单 */
          if (item.id == ids[i].id) {
            return true
          }
        }
      }
      else if (searchWord) {
        return item.specs[0].title.indexOf(searchWord) >=0
      }
    })

    this.page.setData({
      'items.items': _items,
      'items.scrollTop': 0
    })
  }

}