Component({
  properties: {
    p: {
      type: String,
      value: 0,
      systemInfo: false,
    },
    card: {
      type: String,
      value: 0,
      systemInfo: false,
    }
  },
  methods: {
    //跳转到个人中心
    geren: function () {
      wx.navigateTo({
        url: '../my/my'
      })
    },
    //跳转到邀请
    yaoqingS: function () {
      wx.navigateTo({
        url: '../xiaoxi/yaoqing'
      })
    },
    //
    tixianmingxiS:function(){
      wx.navigateTo({
        url:'../geren/tixianmingxi'
      })
    },
    //首页
    indexS:function(){
      wx.navigateTo({
        url:'../index/index'
      })
    }
  },
  attached() {
    var that = this;
    let custom = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: function (e) {
        var ha = false
        if (e.screenHeight - e.windowHeight - e.statusBarHeight - 32 + e.statusBarHeight + custom.bottom + custom.top - e.statusBarHeight > 100) {
          ha = true
        }else{
          ha = false
        }
        that.setData({
          systemInfo: ha,
        })
      }
    })
  }
})
