// pages/my/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['全部','待支付','待提货','已完成','已取消'],
    selected: 0,
    selectedquyu:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  selected: function (e) {
    console.log(e)
    let that= this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if( index == 0){  
      that.setData({
        selected: 0,
      })
    }else if( index == 1) {
      that.setData({
        selected: 1
      })
    }else if( index == 2) {
      that.setData({
        selected: 2
      })
    }else if( index == 3) {
      that.setData({
        selected: 3
      })
    }else if( index == 4) {
      that.setData({
        selected: 4
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