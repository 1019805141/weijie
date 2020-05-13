// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello',
    userInfo: {},
    hasUserInfo: false,
    getUserInfoFail: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('token'))

    if (app.globalData.userInfo) {
      console.log(1)
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
      if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
        this.setData({
          getUserInfoFail: true,
          hasUserInfo: false
        })
      }
    } else if (this.data.canIUse) {
      console.log(this.data.canIUse, '------')
      console.log(2)
      if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
        this.setData({
          getUserInfoFail: true
        })
      }
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res, "=========")
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      console.log(this.data.hasUserInfo, 'hasUserInfo')
    } else {
      console.log(3)
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          this.setData({
            getUserInfoFail: true
          })
          console.log(this.data.getUserInfoFail, 1)
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.login();
    } else {
      this.openSetting();
    }
  },
  // 登录
  login: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: function (res) {
            //由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            //所以此处加入 callback 以防止这种情况
            app.globalData.userInfo = res.userInfo
            app.http('api/login', {
                code: code,
                iv: res.iv,
                encryptedData: res.encryptedData
              }, "POST")
              .then(res => {
                console.log(res, '登录')
                wx.setStorageSync('token', res.data.token)
                var teamer_id = wx.getStorageSync('teamList')
                // 设置默认团长
                app.http('api/user/setTeamer', {
                    teamer_id: teamer_id.id,
                    token: wx.getStorageSync('token')
                  }, "POST")
                  .then(res => {
                    console.log(res, '登录')
                  })
                // 获取个人信息将二维码放入缓存
                app.http('api/user', {
                  token: wx.getStorageSync('token')
                }, "GET").then(res => {
                  console.log(res, '个人信息')
                  if (res.data.userInfo) {
                    console.log('普通用户')
                    that.setData({
                      user: res.data.userInfo,
                      type: 1
                    })
                    wx.setStorageSync('erweima', res.data.userInfo.qrcode_url)
                  }
                  if (res.data.teamerInfo) {
                    console.log('团长')
                    that.setData({
                      user: res.data.teamerInfo,
                      type: 2
                    })
                    wx.setStorageSync('erweima', res.data.teamerInfo.get_user_info.qrcode_url)
                  }
                  wx.hideLoading()
                })
                wx.hideLoading()
                wx.navigateBack({
                  delta: 1
                })
              })

            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }

            //平台登录
          },
          fail: function (res) {
            that.setData({
              getUserInfoFail: true
            })
            console.log(this.data.getUserInfoFail, 2)
          }
        })
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