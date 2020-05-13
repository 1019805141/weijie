// pages/index/proDetail/proDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    background: ['../../../image/cpbanner.png', '../../../image/cpbanner.png', '../../../image/cpbanner.png'],
    current: 0,
    endTime: '2020-05-21 10:40:30',
    id: null,
    detail: null,
    num: null,
    end_time: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    that.setData({
      id: options.id,
      imgUrl: app.globalData.imgUrl
    })
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../../login/login'
      })
    }
    this.loadPro()
    this.countDown()
    this.loadCar()
    this.loadTime()
  },
  loadTime: function () {
    var that = this
    app.http('api/time', {}, "GET")
      .then(res => {
        console.log(res, '开团时间')
        var year = new Date().getFullYear()
        var mouth = (new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : ('0' + (new Date().getMonth() + 1))
        var day = new Date().getDate() > 9 ? (new Date().getDate()) : ('0' + new Date().getDate())
        var time = year + '-' + mouth + '-' + day + ' ' + res.data.end_time
        var time1 = new Date(time.replace(/-/g, "/"))
        var standardDay = time1.getTime(time1);
        that.setData({
          end_time: standardDay
        })
        this.countDown()
        console.log(standardDay)
        wx.hideLoading()
      })
  },
  // 购物车
  loadCar: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/car', {
        token: wx.getStorageSync('token'),
        pageSize: 100
      }, "GET")
      .then(res => {
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
          console.log(res, '1231321321')
          that.setData({
            num: res.data.carList.data.length
          })
          wx.hideLoading()
        }
      })
  },
  // 加载商品
  loadPro: function () {
    var that = this
    app.http('api/goodsDetail', {
        id: that.data.id
      }, "GET")
      .then(res => {
        console.log(res, '---------加载商品详情')
        that.setData({
          detail: res.data.goodsDetail,
          content: res.data.goodsDetail.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"'),
          endTime: res.data.goodsDetail.end_time
        })
        wx.hideLoading()
      })
  },
  swiperChange: function (e) {
    console.l
    if (e.detail.source == 'touch') {
      this.setData({
        current: e.detail.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 倒计时
  countDown: function () {
    var that = this;
    var nowTime = new Date().getTime(); //现在时间（时间戳）
    var endtime = +that.data.end_time; //结束时间（时间戳）
    var endTime = new Date(endtime).getTime();
    var time = (endTime - nowTime) / 1000; //距离结束的毫秒数
    // 获取天、时、分、秒
    let day = parseInt(time / (60 * 60 * 24));
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    // console.log(day + "," + hou + "," + min + "," + sec)
    day = that.timeFormin(day),
      hou = that.timeFormin(hou),
      min = that.timeFormin(min),
      sec = that.timeFormin(sec)
    that.setData({
      day: that.timeFormat(day),
      hou: that.timeFormat(hou),
      min: that.timeFormat(min),
      sec: that.timeFormat(sec)
    })
    // 每1000ms刷新一次
    if (time > 0) {
      that.setData({
        countDown: true
      })
      setTimeout(this.countDown, 1000);
    } else {
      that.setData({
        countDown: false
      })
    }
  },
  //小于10的格式化函数（2变成02）
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //小于0的格式化函数（不会出现负数）
  timeFormin(param) {
    return param < 0 ? 0 : param;
  },
  onImageLoad: function (e) {
    console.log(e, '图片')
    this.setData({
      imgHeight: e.detail.height
    })
  },
  goPay: function () {
    var lists = this.data.detail
    delete lists.content
    delete lists.img_list
    console.log(lists)
    var list = JSON.stringify(this.data.detail)
    wx.navigateTo({
      url: '../order/order?list=' + list + '&type=2'
    })
  },
  // 加入购物车
  addCart: function () {
    var that = this
    app.http('api/car', {
        token: wx.getStorageSync('token'),
        g_id: that.data.detail.id,
        amount: 1
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
          console.log(res, '1231321321')
          wx.showToast({
            title: '加入购物车成功',
            icon: 'none',
            success(data) {
              setTimeout(function () {
                that.loadCar()
              }, 500)
            }
          })
          wx.hideLoading()
        }
      })
  },
  goCart: function () {
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../../login/login'
      })
    } else {
      wx.navigateTo({
        url: '../payCar/payCar'
      })
    }
  },
  goIndex: function () {
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../../login/login'
      })
    } else {
      wx.navigateTo({
        url: '../index'
      })
    }
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
  onShareAppMessage: function (e) {
    let that = this;
    console.log(e)
    if (e.from == 'button') {
      return {
        title: '薇姐爱团Go商品推荐  ', // 转发后 所显示的title
        path: '/pages/index/proDetail/proDetail?id=' + that.data.id,
        success: (res) => { // 成功后要做的事情
          console.log(res, '成功')

        },
        fail: function (res) {
          // 分享失败
          console.log(res, 'fail')
        }
      }
    }
  }
})