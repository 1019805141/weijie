// pages/my/orderDetail/orderDetail.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 0未付款 1已付款 2已核销 3已取消
    type:1,
    orderDetail:null,
    erweima:null,
    list:[
      {
        id:1,
        name:'全部退款'
      },
      {
        id:2,
        name:'部分退款'
      }
    ],
    motalStyle:'display:none',
    checkStyle:'display:none',
    gids:[],
    message:null,
    afterType:null,
    tuisong:'display:none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      type:options.type,
      id:options.id,
      imgUrl: app.globalData.imgUrl,
      erweima:wx.getStorageSync('erweima')
    })
    that.loadOrder()
  },
  // 加载订单信息
  loadOrder:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/orderDetail', {
      token: wx.getStorageSync('token'),
      id:that.data.id
    }, "GET").then(res => {
      console.log(res, 'dsadadsashuaxin')
      var data = res.data.orderDetail
      var price = 0
      data.goods_list.map(function(n){
        console.log(n)
        n.checked = false
        price += parseInt(n.get_goods_info.price * n.amount) 
        console.log(price)
        data.price = price
      })
      that.setData({
        orderDetail:data
      })
      wx.hideLoading()
    })
  },
  // 取消订单
  deleteOrder:function(e){
     var id = e.currentTarget.dataset.id
     wx.showModal({
      title: '是否取消订单',
      content: '订单取消后不可恢复，\r\n请谨慎操作',
      success(res) {
        if (res.confirm) {
          app.http('api/cancelOrder', {
            token: wx.getStorageSync('token'),
            id:id
          }, "POST").then(res => {
            if (res.status_code == 401) {
              wx.showToast({
                title: '登录超时，重新登录中..',
                duration: 2000,
                icon: 'none',
                success(data) {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../../login/login'
                    })
                  }, 1000) //延迟时间
                }
              })
            }else{
              wx.showToast({
                title: "当前订单已取消",
                duration: 2000,
                icon: 'none',
                success(data) {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../my',
                    })
                    wx.hideLoading()
                  }, 1500) //延迟时间
                }
              })
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  goafterOrder:function(){
    this.setData({
      motalStyle:'display:block'
    })
  },
  hide:function(){
    this.setData({
      motalStyle:'display:none'
    })
  },
  radioChange:function(e){
    console.log(e)
    var that = this
    var value = e.detail.value
    var goods_list = this.data.orderDetail.goods_list
    var gids = []
    if(value ==1){    
        that.setData({
          checkStyle:'display:none',
          afterType:1
        })
        goods_list.map(function(n){
          var obj = {}
          obj.gid = n.g_id
          obj.amount = n.amount
          gids.push(obj)
        })
        console.log(gids,'====')
        that.setData({
          gids:gids
        })
    }else{
      that.setData({
        checkStyle:'display:block',
        afterType:2
      })
    }
  },
  checkboxChange:function(e){
    console.log(e)
    var value = e.detail.value
    var goods_list = this.data.orderDetail.goods_list
    var gids = []
    if(value.length>0){
      goods_list.map(function(n){
        var obj = {}
        console.log(n)
        value.map(function(s){
        console.log(s)
        if(n.id == s){
          obj.gid = n.g_id
          obj.amount = n.amount
          gids.push(obj)
        }
        })
      })
      this.setData({
        gids:gids
      })
    }
  },
  forMessage:function(e){
    this.setData({
      message:e.detail.value
    })
  },
  subAfter:function(){
    var that = this
    var gids = this.data.gids
    if(gids.length>0){
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/afterOrder', {
        token: wx.getStorageSync('token'),
        gids:JSON.stringify(gids),
        type:that.data.type,
        o_id:that.data.orderDetail.id,
        message:that.data.message
      }, "POST").then(res => {
        console.log(res, 'dsadadsashuaxin')
        if (res.status_code == 401) {
          wx.showToast({
            title: '登录超时，重新登录中..',
            duration: 2000,
            icon: 'none',
            success(data) {
              setTimeout(function () {
                wx.navigateTo({
                  url: '../../login/login'
                })
              }, 1000) //延迟时间
            }
          })
        }
        if(res.code == 200){
          wx.showToast({
            title: res.msg,
            duration: 2000,
            icon: 'none',
            success(data) {
              setTimeout(function () {
                // wx.navigateBack({
                //   delta: 1
                // })
                that.setData({
                  tuisong:'display:block',
                  motalStyle:'display:none'
                })
              }, 1000) //延迟时间
            }
          })
        }
        if(res.code==300){
          wx.showToast({
            title: res.msg,
            duration: 2000,
            icon: 'none',
            success(data) {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              
              }, 1000) //延迟时间
            }
          })
        }


        wx.hideLoading()
      })
    }else{
      wx.showToast({
        title: '请选择退款类型',
        duration: 2000,
        icon: 'none'
      })
    }
  },
  tuisong_hide:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  tuisong_t:function(){
    this.setData({
      tuisong:'display:none'
    })
    wx.requestSubscribeMessage({
      tmplIds: ['aIaCLzzGQyFCo7JrRhilddWEatlILCTCRf3Vm4WF-kY'],
      success (res) {
        wx.navigateBack({
          delta: 1
        })
       },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})