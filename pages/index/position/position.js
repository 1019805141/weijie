// pages/index/position/position.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84', //默认wgs84
      success: function (res) {
        console.log(res,'成功')
        wx.setStorageSync('longitude', res.longitude)
        wx.setStorageSync('latitude', res.latitude)
        wx.redirectTo({
          url: '../commander/commander?type=1'
        })
      },
      fail: function (res) {
        console.log('fail', res)
        wx.hideLoading();
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '',
                content: '由于未能获取您当前的位置，所以\r\n无法为您准确推荐附近的机构，请\r\n及时开启您的定位',
                confirmText: '去开启',
                success: function (res) {
                  console.log(res)
                  if (res.confirm) {
                    that.openSetting()
                  } else {
                    console.log('get location fail');
                  }
                }
              })
            } else {
              //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              wx.showModal({
                title: '',
                content: '请在系统设置中打开定位服务并刷新小程序',
                confirmText: '确定',
                success: function (res) {}
              })
            }
          }
        })
      }
    })
  },
  openSetting() {
    wx.openSetting({
      success:(res)=>{
        console.log(res,'设置')
      }
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