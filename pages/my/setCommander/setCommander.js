// pages/my/setCommander/setCommander.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.loadUserTeam()
    that.loadTeamer()
  },
    // 默认加载登录后的团长信息
    loadUserTeam:function(){
      var that =this
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/defaultTeamer', {
        token: wx.getStorageSync('token')
        }, "GET")
        .then(res => {
          console.log(res,'tuanzhang')
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
            teamer:res.data.defaultTeamer
          })
          wx.hideLoading()
        })
    },
    // 加载附近团长
    loadTeamer:function(){
      var that = this
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/teamer/list', {
        latitude: wx.getStorageSync('latitude'),
        longitude: wx.getStorageSync('longitude')
      }, "GET").then(res => {
        console.log(res, '团长列表')
        that.setData({
          teamList:res.data
        })
        wx.hideLoading()
      })
    },


    team: function (e) {
      var that = this
      var id = e.currentTarget.dataset.id
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/user/setTeamer', {
          token: wx.getStorageSync('token'),
          teamer_id: id
        }, "POST")
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
          } else {
            wx.showToast({
              title: '选择默认团长成功！',
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
            wx.hideLoading()
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