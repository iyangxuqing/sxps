let config = require('utils/config.js')
import 'utils/util.js'
import { User } from 'utils/user.js'
import { Dataver } from 'utils/dataver.js'
import { Listener } from 'utils/listener.js'

App({

  onLaunch: function () {
    this.init()
  },

  init: function () {
    this.listener = new Listener()
    this.version = config.version
    this.youImageMode_v2 = config.youImageMode_v2
    this.youImageMode_v5 = config.youImageMode_v5
    User.login({ silent: true })
    Dataver.get({ silent: true })
  }

})