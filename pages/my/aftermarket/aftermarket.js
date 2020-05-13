// pages/my/aftermarket/aftermarket.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 10,
    last_page: 1,
    type: 'all',
    list: [{
        name: '全部',
        id: 'all'
      },
      {
        name: '待审核',
        id: 1
      },
      {
        name: '团长确认',
        id: 2
      },
      {
        name: '团长驳回',
        id: 3
      },
      {
        name: '后台放款',
        id: 4
      }
    ],
    selected: 0,
    selectedquyu: 0,
    orderList: [],
    bottomStyle: "display:none",
    page: 1,
    size: 5,
    last_page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../aftermarketDetail/aftermarketDetail?id=' + id
    })
  },
  loadList: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/teamer/returnOrder', {
        token: wx.getStorageSync('token'),
        pageSize: 20,
        audit_state: that.data.type
      }, "GET")
      .then(res => {
        console.log(res, '3213232131-----')
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
          var data = res.data.returnOrder.data
          that.setData({
            orderList: data,
            last_page:res.data.returnOrder.last_page
          })
          wx.hideLoading()
        }
      })
  },

  selected: function (e) {
    console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    console.log(index)
    if (index == 0) {
      that.setData({
        selected: 0,
        type: 'all'
      })
    } else if (index == 1) {
      that.setData({
        selected: 1,
        type: 1
      })
    } else if (index == 2) {
      that.setData({
        selected: 2,
        type: 2
      })
    } else if (index == 3) {
      that.setData({
        selected: 3,
        type: 3
      })
    } else if (index == 4) {
      that.setData({
        selected: 4,
        type: 4
      })
    }
    that.setData({
      type: id
    })
    that.loadList()
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
    this.loadList()
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
    if (page == that.data.last_page) {
      that.setData({
        bottomStyle: "display:block"
      })
    } else {
      that.setData({
        page: that.data.page + 1
      })
      that.loadList()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})