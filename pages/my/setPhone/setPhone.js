// pages/my/setPhone/setPhone.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    receiver_name: '',
    receiver_phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载用户信息
    this.loadUser()
  },
  // 加载用户信息
  loadUser: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user', {
        token: wx.getStorageSync('token')
      }, "GET")
      .then(res => {
        console.log(res, '用户-----')
        // token失效
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
          if (res.data.userInfo) {
            var receiver_name = res.data.userInfo.receiver_name
            var receiver_phone = res.data.userInfo.receiver_phone
          } else {
            var receiver_name = res.data.teamerInfo.get_user_info.receiver_name
            var receiver_phone = res.data.teamerInfo.get_user_info.receiver_phone
          }
          if (receiver_name == null || receiver_phone == null) {
            that.setData({
              receiver_name: '',
              receiver_phone: ''
            })
          } else {
            that.setData({
              receiver_name: receiver_name,
              receiver_phone: receiver_phone
            })
          }
      
          wx.hideLoading()
        }
      })
  },
  forName: function (e) {
    this.setData({
      receiver_name: e.detail.value
    })
  },
  forTel: function (e) {
    this.setData({
      receiver_phone: e.detail.value
    })
  },
  submit: function () {
    var that = this
    if (that.data.receiver_name == null || that.data.receiver_name == '') {
      wx.showToast({
        title: '请填写姓名',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    if (that.data.receiver_phone == null || that.data.receiver_phone == '') {
      wx.showToast({
        title: '请填写手机号',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user/setReceiver', {
        token: wx.getStorageSync('token'),
        name: that.data.receiver_name,
        phone: that.data.receiver_phone
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
        }
        wx.showToast({
          title: '设置成功!',
          duration: 2000,
          icon: 'none',
          success(data) {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
              wx.hideLoading()
            }, 1500) //延迟时间
          }
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