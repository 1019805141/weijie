// pages/my/myOrder/myOrder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {name:'全部',id:'all'},
      {name:'待支付',id:0},
      {name:'待提货',id:1},
      {name:'已完成',id:2},
      {name:'已取消',id:3},
      {name:'退款中',id:4},
      {name:'被驳回',id:5},
      {name:'已退款',id:6},
    ],
    currentIndexs: 0,
    selected: 0,
    selectedquyu:0,
    type:'all',
    size:10,
    page:1,
    last_page:1,
    orderList:[],
    bottomStyle: "display:none",
    price:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      type:options.type,
      currentIndexs:options.selected,
      imgUrl: app.globalData.imgUrl
    })
    this.loadOrder()
  },

  // 加载我的订单
  loadOrder:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/order', {
      token: wx.getStorageSync('token'),
      type:that.data.type,
      pageSize: that.data.size * that.data.page
    }, "POST")
    .then(res => {
      console.log(res,'3213232131-----')
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
        var data= res.data.orderList.data

        data.map(function(n){
          var price = 0
          n.goods_list.map(function(s){
           price +=parseInt(s.get_goods_info.price * s.amount)
          })
          n.price = price
        })


          that.setData({
            orderList:res.data.orderList.data,
            last_page:res.data.orderList.last_page
          })
        wx.hideLoading()
      }
    })
  },
  dianjis: function (e) {
    var that = this
    let query = e.currentTarget.dataset['index']
    var label = e.currentTarget.dataset.label
    var index = e.currentTarget.dataset.index
    var zong = that.data.zongList
    that.setData({
      currentIndexs: query,
      type: label,
      page: 1,
      bottomStyle: "display:none"
    })
    that.loadOrder()
  },

  selected: function (e) {
    console.log(e)
    let that= this
    let index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    console.log(index)
      if( index == 0){  
      that.setData({
        selected: 0,
     
      })
    }else if( index == 1) {
      that.setData({
        selected: 1
      })
    }else if( index == 2) {
      that.setData({
        selected: 2
      })
    }else if( index == 3) {
      that.setData({
        selected: 3
      })
    }else if( index == 4) {
      that.setData({
        selected: 4
      })
    }
    that.setData({
      type:id
    })
    that.loadOrder()
  },
  goDetail:function(e){
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + id + '&type=' + type
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
   // 页面上拉触底事件的处理函数
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
     that.loadPro()
     this.selectComponent("#list").carNum()
   }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})