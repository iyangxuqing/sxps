let defaults = {}

function getDateRange(date) {
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  let years = []
  let maxYear = new Date().getFullYear()
  for (let i = 0; i < 3; i++) {
    years.unshift(maxYear - i + '年')
  }
  let months = []
  for (let i = 0; i < 12; i++) {
    months[i] = i + 1 + '月'
    if (months[i].length < 3) months[i] = '0' + months[i]
  }
  let dayLength = 30
  if (month == 1) dayLength = 28
  if (month == 1 && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)) dayLength = 29
  if ([0, 2, 4, 6, 7, 9, 11].indexOf(month) >= 0) dayLength = 31
  let days = []
  for (let i = 0; i < dayLength; i++) {
    days[i] = i + 1 + '日'
    if (days[i].length < 3) days[i] = '0' + days[i]
  }
  let hours = []
  for (let i = 0; i < 24; i++) {
    hours[i] = i + '时'
    if (hours[i].length < 3) hours[i] = '0' + hours[i]
  }
  let minutes = []
  for (let i = 0; i < 60; i++) {
    minutes[i] = i + '分'
    if (minutes[i].length < 3) minutes[i] = '0' + minutes[i]
  }
  let seconds = []
  for (let i = 0; i < 60; i++) {
    seconds[i] = i + '秒'
    if (seconds[i].length < 3) seconds[i] = '0' + seconds[i]
  }
  let yearIndex = -1
  for (let i in years) {
    if (years[i] == year + '年') {
      yearIndex = i
      break
    }
  }
  let dateRange = [years, months, days, hours, minutes, seconds]
  let dateValue = [yearIndex, month, day - 1, hour, minute, second]
  return {
    dateRange,
    dateValue,
  }
}

let methods = {

  onDateTimePickerColumnChange: function (e) {
    let page = getCurrentPages().pop()
    let dateId = e.currentTarget.dataset.id
    let column = e.detail.column
    let value = e.detail.value
    let dateRange = []
    let dateValue = []
    if (dateId == 'date1') {
      dateRange = page.data.search.date1Range
      dateValue = page.data.search.date1Value
      dateValue[column] = value
      page.setData({
        'search.date1Value': dateValue
      })
    } else if (dateId == 'date2') {
      dateRange = page.data.search.date2Range
      dateValue = page.data.search.date2Value
      dateValue[column] = value
      page.setData({
        'search.date2Value': dateValue
      })
    }
    if (column > 1) return

    let years = dateRange[0]
    let months = dateRange[1]
    let year = parseInt(years[dateValue[0]])
    let month = parseInt(months[dateValue[1]])
    if (column == 0) year = parseInt(years[value])
    if (column == 1) month = parseInt(months[value])
    let dayLength = 30
    if (month == 2) dayLength = 28
    if (month == 2 && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)) dayLength = 29
    if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) >= 0) dayLength = 31
    if (dateRange[2].length != dayLength) {
      let days = []
      for (let i = 0; i < dayLength; i++) {
        days[i] = i + 1 + '日'
        if (days[i].length < 3) days[i] = '0' + days[i]
      }
      dateRange[2] = days
      if (dateId == 'date1') {
        page.setData({
          'search.date1Range': dateRange
        })
      } else if (dateId == 'date2') {
        page.setData({
          'search.date2Range': dateRange
        })
      }
    }
  },

  onDateTimePickerChange: function (e) {
    let page = getCurrentPages().pop()
    let dateId = e.currentTarget.dataset.id
    let value = e.detail.value
    let dateRange = []
    if (dateId == 'date1') {
      dateRange = page.data.search.date1Range
    } else if (dateId == 'date2') {
      dateRange = page.data.search.date2Range
    }
    let year = parseInt(dateRange[0][value[0]])
    let month = parseInt(dateRange[1][value[1]])
    let day = parseInt(dateRange[2][value[2]])
    let hour = parseInt(dateRange[3][value[3]])
    let minute = parseInt(dateRange[4][value[4]])
    let date = new Date(year, month - 1, day, hour, minute)
    let strDate = date.Format('yyyy-MM-dd hh:mm:ss')
    if (dateId == 'date1') {
      page.setData({
        'search.date1': date,
        'search.strDate1': strDate
      })
    } else if (dateId == 'date2') {
      page.setData({
        'search.date2': date,
        'search.strDate2': strDate
      })
    }
  },

  onWordPicker: function (e) {
    let page = getCurrentPages().pop()
    let pickerWords = this.pickerWords
    let itemList = []
    for (let i in pickerWords) {
      itemList.push(pickerWords[i].title)
    }
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (!res.cancel) {
          let tapIndex = res.tapIndex
          let pickerWord = pickerWords[tapIndex]
          page.setData({
            'search.pickerWord': pickerWord
          })
          this.searchWordPicker && this.searchWordPicker(pickerWord)
        }
      }.bind(this)
    })
  },

  onSearchInput: function (e) {
    let page = getCurrentPages().pop()
    let searchWord = e.detail.value
    page.setData({
      'search.searchWord': searchWord,
    })
  },

  onSearchCancel: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'search.searchWord': '',
    })
    this.searchCancel && this.searchCancel()
  },

  onSearch: function (e) {
    let page = getCurrentPages().pop()
    let date1 = page.data.search.date1
    let date2 = page.data.search.date2
    let searchWord = page.data.search.searchWord
    let pickerWord = page.data.search.pickerWord
    let search = {
      date1: date1,
      date2: date2,
      time1: date1.getTime(),
      time2: date2.getTime(),
    }
    if (searchWord) search.searchWord = searchWord
    if (pickerWord) search.pickerWord = pickerWord
    this.search && this.search(search)
  },

}

export class Search {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.pickerWords = options.pickerWords
    this.search = options.search
    this.searchCancel = options.searchCancel
    this.searchWordPicker = options.searchWordPicker

    let date1 = options.date1
    let date2 = options.date2
    let strDate1 = date1.Format('yyyy-MM-dd hh:mm:ss')
    let strDate2 = date2.Format('yyyy-MM-dd hh:mm:ss')
    let date1Result = getDateRange(date1)
    let date2Result = getDateRange(date2)
    let date1Range = date1Result.dateRange
    let date1Value = date1Result.dateValue
    let date2Range = date2Result.dateRange
    let date2Value = date2Result.dateValue
    let pickerWords = options.pickerWords
    let pickerWord = pickerWords[0]
    for (let i in pickerWords) {
      if (pickerWords[i].active) {
        pickerWord = pickerWords[i]
        break
      }
    }
    let search = { date1, date2, strDate1, strDate2, date1Range, date2Range, date1Value, date2Value, pickerWords, pickerWord }
    page.setData({ search })
    for (let key in methods) {
      page['search.' + key] = methods[key].bind(this)
      page.setData({
        ['search.' + key]: 'search.' + key
      })
    }
  }

}