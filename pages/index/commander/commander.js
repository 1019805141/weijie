// pages/index/commander/commander.js
const app = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defult: '请选择地区',
    latitude: null,
    longitude: null,
    place: '获取中...',
    teamList: [],
    // 1未登录2已登录    
    type:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      type:options.type
    })
    qqmapsdk = new QQMapWX({
      key: 'B5SBZ-PDJWW-S5ORQ-RAAEX-L7Z7H-H3FY3'
    });
    var latitude = wx.getStorageSync('latitude')
    var longitude = wx.getStorageSync('longitude')
    that.getLocal(latitude, longitude)
    that.loadTeamer()
  },

  getLocal: function (latitude, longitude) {
    var that = this;
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res, ';ddddddd')
        that.setData({
          place: res.result.formatted_addresses.recommend
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  // 加载附近团长
  loadTeamer: function () {
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
        teamList: res.data
      })
      wx.hideLoading()
    })
  },
  goMap: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res, 'dingwei')
        that.setData({
          place: res.name
        })
        wx.setStorageSync('longitude', res.longitude)
        wx.setStorageSync('latitude', res.latitude)
        that.loadTeamer()
      }
    });
  },
  team: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    console.log(e)
    if(that.data.type == 1){
      wx.setStorageSync('teamList', that.data.teamList[index])
      wx.redirectTo({
        url: '../index'
      })
    }else{
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
              title: '选择团长成功！',
              duration: 2000,
              icon: 'none',
              success(data) {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../index'
                  })
                }, 1000) //延迟时间
              }
            })
            wx.hideLoading()
          }
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