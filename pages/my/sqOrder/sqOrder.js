// pages/my/sqOrder/sqOrder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputImg: 'display:block',
    list: [{
        name: '全部',
        id: 'all'
      },
      {
        name: '待支付',
        id: 0
      },
      {
        name: '待提货',
        id: 1
      },
      {
        name: '已完成',
        id: 2
      },
      {
        name: '已取消',
        id: 3
      }
    ],
    selected: 0,
    selectedquyu: 0,
    type: 'all',
    size: 10,
    page: 1,
    orderList: [],
    last_page: 1,
    bottomStyle: "display:none",
    keywords:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.loadOrder()
  },
  // 加载社区列表
  loadOrder: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/teamer/teamOrder', {
        token: wx.getStorageSync('token'),
        type: that.data.type,
        pageSize: that.data.size * that.data.page,
        keywords:that.data.keywords
      }, "GET")
      .then(res => {
        console.log(res, '13213213-------')
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
        }

        var data = res.data.teamOrder.data
        data.map(function (n) {
          n.zong = 0
          n.goods_list.map(function (s) {
            console.log(parseInt(s.amount))
            n.zong += parseInt(s.amount)
          })
        })
        that.setData({
          orderList: data,
          last_page: res.data.teamOrder.last_page
        })
        wx.hideLoading()

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
        size: 10
      })
    } else if (index == 1) {
      that.setData({
        selected: 1,
        size: 10
      })
    } else if (index == 2) {
      that.setData({
        selected: 2,
        size: 10
      })
    } else if (index == 3) {
      that.setData({
        selected: 3,
        size: 10
      })
    } else if (index == 4) {
      that.setData({
        selected: 4,
        size: 10
      })
    }
    that.setData({
      type: id
    })
    that.loadOrder()
  },
  searchInput: function (e) {
    console.log(e)
    if (e.detail.value == null || e.detail.value == '') {
      this.setData({
        inputImg: 'display:block'
      })
    } else {
      this.setData({
        inputImg: 'display:none'
      })
    }
    this.setData({
      keywords:e.detail.value
    })
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    if(status == 1){
      wx.navigateTo({
        url: '../writeOfforder/writeOfforder?id=' + id
      })
    }
  },
  search:function(){
    this.setData({
      size:10
    })
    this.loadOrder()
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
    var that = this
    var page = that.data.page
    console.log(page)
    if (page >= that.data.last_page) {
      that.setData({
        bottomStyle: "display:block"
      })
      console.log(1)
    } else {
      that.setData({
        page: that.data.page + 1
      })
      that.loadOrder()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})