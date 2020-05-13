// pages/index/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    carId:[],
    price:null,
    teamer:null,
    name:null,
    tel:null,
    text:null,
    // 1为购物车  2为直接购买
    type:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    var list = JSON.parse(options.list)
    console.log(list)
    if(options.type ==1){
      var carId = []
      list.map(function(n){
        carId.push(n.id)
      })
      that.setData({
        list:list,
        carId:carId,
        imgUrl: app.globalData.imgUrl,
        price:options.payNum,
        type:options.type
      })
    }else{
      that.setData({
        list:list,
        imgUrl: app.globalData.imgUrl,
        type:options.type
      })
    }
    console.log(list)
    
  
    console.log(that.data.carId)
    // 默认加载团长信息
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/defaultTeamer', {
      token: wx.getStorageSync('token')
      }, "GET")
      .then(res => {
        console.log(res,'tuanzhang')
        that.setData({
          teamer:res.data
        })
        wx.hideLoading()
      })
      app.http('api/user', {
        token: wx.getStorageSync('token')
        }, "GET")
        .then(res => {
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
          console.log(res,'-----')
          if (res.data.userInfo) {
            var name = res.data.userInfo.receiver_name
            var tel = res.data.userInfo.receiver_phone
          } else {
            var name = res.data.teamerInfo.get_user_info.receiver_name
            var tel = res.data.teamerInfo.get_user_info.receiver_phone
          }
          // var tel=res.data.teamerInfo.get_user_info.receiver_phone
          // var name=res.data.teamerInfo.get_user_info.receiver_name
          if(tel == null || name == null){
            that.setData({
              name:'',
              tel:''
            })
          }else{
            that.setData({
              name:name,
              tel:tel
            })
          }
          wx.hideLoading()
        })   
  },
  forName:function(e){
    console.log(e)
    this.setData({
      name:e.detail.value
    })
  },
  forTel:function(e){
    console.log(e)
    this.setData({
      tel:e.detail.value
    })
  },
  forText:function(e){
    console.log(e)
    this.setData({
      text:e.detail.value
    })
  },
  goPay:function(){
    var that = this
    var carIds = that.data.carId.toString()
    if(that.data.name == "" || that.data.name == null){
      wx.showToast({
        title: '还未填写姓名',
        icon: 'none'
      })
      return
    }
    if(that.data.tel == "" || that.data.tel == null){
      wx.showToast({
        title: '还未填写电话',
        icon: 'none'
      })
      return
    }

    if(that.data.type == 1){
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/buy', {
        token: wx.getStorageSync('token'),
        carIds:carIds,
        t_id:that.data.teamer.defaultTeamer.default_teamer,
        receiver_name:that.data.name,
        receiver_phone:that.data.tel,
        message:that.data.text
        }, "POST")
        .then(res => {
          console.log(res,'下单-------------')
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

          var id = res.data.o_id
          // 调起支付
          wx.requestPayment({
            timeStamp: res.data.params.timeStamp,
            nonceStr: res.data.params.nonceStr,
            package: res.data.params.package,
            signType: res.data.params.signType,
            paySign: res.data.params.paySign,
            success (res) { 
              wx.redirectTo({
                url: '../../my/orderDetail/orderDetail?type=1' + "&id=" + id
              })
            },
            fail (res) {
              wx.redirectTo({
                url: '../../my/orderDetail/orderDetail?type=0' + "&id=" + id
              })
             }
          })
          wx.hideLoading()
        })
    }else{
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/buyNow', {
        token: wx.getStorageSync('token'),
        g_id:that.data.list.id,
        t_id:that.data.teamer.defaultTeamer.default_teamer,
        receiver_name:that.data.name,
        receiver_phone:that.data.tel,
        message:that.data.text
        }, "POST")
        .then(res => {
          console.log(res,'下单-------------')
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
            var id = res.data.o_id
            // 调起支付
            wx.requestPayment({
              timeStamp: res.data.params.timeStamp,
              nonceStr: res.data.params.nonceStr,
              package: res.data.params.package,
              signType: res.data.params.signType,
              paySign: res.data.params.paySign,
              success (res) { 
                wx.redirectTo({
                  url: '../../my/orderDetail/orderDetail?type=1' + "&id=" + id
                })
              },
              fail (res) {
                wx.redirectTo({
                  url: '../../my/orderDetail/orderDetail?type=0' + "&id=" + id
                })
               }
            })
          }
          if(res.code == 300){
            wx.showToast({
              title: res.msg,
              duration: 2000,
              icon: 'none',
              success(data) {
                setTimeout(function () {
                
                }, 1000) //延迟时间
              }
            })
          }
        
          wx.hideLoading()
        })
    }



    
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