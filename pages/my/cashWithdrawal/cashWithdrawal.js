// pages/my/cashWithdrawal/cashWithdrawal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:null,
    zong:null,
    jine:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options)
     var that = this
     that.setData({
       price:parseInt(options.price)
     })
  },
  all:function(){
    var that = this
    that.setData({
      zong:that.data.price
    })

  },
  forPrice:function(e){
    console.log(e)
    
    if(e.detail.value<0){
      this.setData({
        jine:0,
        zong:0
      })
      console.log(1)
    }
    this.setData({
      jine:e.detail.value
    })
    
  },
  goPrice:function(){
    var that = this
    if(that.data.jine == null || that.data.jine == ""){
      wx.showToast({
        title:'请输入金额',
        icon:'none'
      })
      return
    }
    if(that.data.jine <= 0){
      wx.showToast({
        title:'请输入金额',
        icon:'none'
      })
      return
    }
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/teamer/withdrawal', {
      token:wx.getStorageSync('token'),
      money:that.data.jine
    }, "POST").then(res => {
      console.log(res, '提现')
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
              wx.navigateBack({
                delta: 1
              })
            }, 1000) //延迟时间
          }
        })
      }


      wx.hideLoading()
    })
  },
  goDetail:function(){
    wx.navigateTo({
      url: '../withdrawalList/withdrawalList'
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