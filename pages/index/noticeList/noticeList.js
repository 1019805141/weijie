// pages/index/noticeList/noticeList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      imgUrl:app.globalData.imgUrl
    })
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/noticeList', {
      type: 1
    }, "GET")
    .then(res => {
      console.log(res, '公告')
      that.setData({
        noticeList:res.data.noticeList.data
      })
      wx.hideLoading()
    })
  },
  goDetail:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../notice/notice?id=' + id
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