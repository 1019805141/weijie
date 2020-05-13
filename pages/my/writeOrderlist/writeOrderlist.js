// pages/my/writeOrderlist/writeOrderlist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      id:'all',
      name:'全部'
    },{
      id:2,
      name:'已核销'
    },
    {
      id:4,
      name:'部分核销'
    }],
    selected: 0,
    selectedquyu:0,
    inputImg:'display:block',
    type:'all',
    keywords:'',
    size: 10,
    page: 1,
    last_page: 1,
    orderList:null,
    endtime:'2019-06-30',
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrder()
  },
  loadOrder:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/teamer/checkRecord', {
        token: wx.getStorageSync('token'),
        type: that.data.type,
        pageSize: that.data.size * that.data.page,
        keywords:that.data.keywords,
        start_time:that.data.time
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
        that.setData({
          orderList:res.data.recordsList.data,
          last_page:res.data.recordsList.last_page
        })
        wx.hideLoading()
      })
  },
  selected: function (e) {
    console.log(e)
    let that= this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if( index == 0){  
      that.setData({
        selected: 0,
        type:'all'
      })
    }else if( index == 1) {
      that.setData({
        selected: 1,
        type:2
      })
    }else if( index == 2) {
      that.setData({
        selected: 2,
        type:4
      })
    }
    this.loadOrder()
  },
  bindTimeChange:function(e){
      console.log(e,'=====')
      this.setData({
        time:e.detail.value,
        size:10
      })
      this.loadOrder()
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
  search:function(){
    this.setData({
      size:10
    })
    this.loadOrder()
  },  
  _bindpreDay(e) {
    console.log(e)
    var day = e.detail.day
    var month = e.detail.month
    var year = e.detail.year
    var time = year +'-' + month +'-'+day
    this.setData({
      time:time,
      size:10
    })
    this.loadOrder()
  },
  _bindnextDay(e) {
    console.log(e)
    var day = e.detail.day
    var month = e.detail.month
    var year = e.detail.year
    var time = year +'-' + month +'-'+day
    this.setData({
      time:time,
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