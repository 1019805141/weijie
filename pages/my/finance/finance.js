// pages/my/finance/finance.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    bottomStyle: "display:none",
    size: 10,
    page: 1,
    last_page: 1,
    priceList:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.loadList()

  },
  goPay:function(e){
    var price = e.currentTarget.dataset.price
    wx.navigateTo({
      url: '../cashWithdrawal/cashWithdrawal?price=' + price
    })
  },
    // 加载佣金金额
loadPrice:function(){
  var that = this
  wx.showLoading({ //显示 loading 提示框
    title: "加载中..."
  })
  app.http('api/teamer/team_commission', {
    token:wx.getStorageSync('token')
  }, "POST").then(res => {
    console.log(res, '金额')
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
    that.setData({
      priceList:res.data.team_commission
    })
    wx.hideLoading()
  })
},
  // 加载收益明细 
  loadList:function(){
    var that = this
    app.http('api/teamer/commission', {
      token: wx.getStorageSync('token')
      }, "GET")
      .then(res => {
        console.log(res,'收益-------------')
        that.setData({
          list:res.data.commissionList.data
        })
        wx.hideLoading()
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
    this.loadPrice()
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
    var that = this
    var page = that.data.page
    console.log(page)
    if (page >= that.data.last_page) {
      that.setData({
        bottomStyle: "display:block"
      })
      console.log(1)
    } else {
      that.setData({
        page: that.data.page + 1
      })
      that.loadOrder()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})