const app = getApp();
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
    },
    gou:{
      type:Number,
      value:0,
      systemInfo:false
    }
  },
  methods: {
    //跳转到个人中心
    geren: function () {
      console.log(this.properties.p)
      if(this.properties.p == 3){  

      }else{
        wx.redirectTo({
          url: '/pages/my/my'
        })
      }
    },
    //跳转到邀请
    yaoqingS: function () {
      if(this.properties.p == 2){  

      }else{
        wx.redirectTo({
          url: '/pages/index/payCar/payCar'
        })
      }
    },
    //
    tixianmingxiS:function(){
      if(this.properties.p == 1){  

      }else{
        wx.redirectTo({
          url:'/pages/index/list/list'
        })
      }
    },
    //首页
    indexS:function(){
      if(this.properties.p == 0){  

      }else{
        wx.redirectTo({
          url:'/pages/index/index'
        })
      }
    },
    gouwuche:function(){
      var gouwuche=this.data.gou
      gouwuche++
      this.setData({
        gou:gouwuche
      })
    },
    gouwuchejian:function(){
      var gouwuche=this.data.gou
      gouwuche--
      this.setData({
        gou:gouwuche
      })
    },
    // 查询购物车数量
    carNum:function(){
      var that = this
      app.http('api/car', {
        token: wx.getStorageSync('token'),
        pageSize:100
      }, "GET").then(res => {
        var data= res.data.carList.data
        var num = 0
        data.map(function(n){
          num +=n.amount
        })
        this.setData({
          gou:num
        })
        this.triggerEvent('myevent',{carlist:res.data.carList.data})
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
  },
  pageLifetimes:{
    show:function(){
      this.carNum()
    }
  }
})
