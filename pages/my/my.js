// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 3,
    user: null,
    // 1为普通用户，2位团长
    type: 1,
    token: null,
    imgList: null,
    imgheights: [],
    imgheights2: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    that.setData({
      imgUrl: app.globalData.imgUrl
    })
    that.loadGg()

  },
  // 加载广告位
  loadGg: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/bannerList', {
        id: 4
      }, "GET")
      .then(res => {
        console.log(res, '广告位')
        that.setData({
          imgList: res.data.bannerList
        })
        wx.hideLoading()
      })
  },
  imageLoad: function (e) {//获取图片真实宽度  
    console.log(e)
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
      console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio - 20;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
    console.log(this.data.imgheights)
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },
  goOrder: function (e) {
    var type = e.currentTarget.dataset.type
    var selected = e.currentTarget.dataset.selected
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: 'myOrder/myOrder?type=' + type + '&selected=' + selected
      })
    }
  },
  goTuan: function (e) {
    var type = e.currentTarget.dataset.type
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {

      if (type == 1) {
        wx.navigateTo({
          url: 'commander/commander'
        })
      } else {
        wx.navigateTo({
          url: 'commanderOrg/commanderOrg'
        })
      }
    }
  },
  goSettuan: function () {
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: 'setCommander/setCommander'
      })
    }
  },
  getPhone: function () {
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: 'setPhone/setPhone'
      })
    }
  },
  goNotice: function () {
    wx.navigateTo({
      url: 'about/about'
    })
  },
  goLogin: function () {
    wx.navigateTo({
      url: '../login/login'
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
    var that = this
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {

    } else {

      that.setData({
        token: wx.getStorageSync('token')
      })
      // 加载用户信息
      app.http('api/user', {
        token: wx.getStorageSync('token')
      }, "GET").then(res => {
        console.log(res, 'dsadadsashuaxin')
        if (res.status_code == 401) {
          wx.showToast({
            title: '登录超时，重新登录中..',
            duration: 2000,
            icon: 'none',
            success(data) {
              setTimeout(function () {
                wx.navigateTo({
                  url: '../login/login'
                })
              }, 1000) //延迟时间
            }
          })
        } else {

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
            wx.setStorageSync('erweima', res.data.userInfo.get_user_info.qrcode_url)
          }
        }
        wx.hideLoading()
      })
    }
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