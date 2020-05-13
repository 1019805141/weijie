// pages/my/writeOrder/writeOrder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [{
        o_id: 1,
        order: '202011421312121',
        num: 2,
        cp: [{
            img: '../../../image/cpimg.png',
            name: '沙窝林子天津萝卜',
            price: '9.99',
            num: 1,
            id: 1
          },
          {
            img: '../../../image/cpimg.png',
            name: '沙窝林子天津萝卜',
            price: '9.99',
            num: 1,
            id: 2
          }
        ]
      },
      {
        o_id: 2,
        order: '202011421312121',
        num: 2,
        cp: [{
            img: '../../../image/cpimg.png',
            name: '沙窝林子天津萝卜',
            price: '9.99',
            num: 1,
            id: 3
          },
          {
            img: '../../../image/cpimg.png',
            name: '沙窝林子天津萝卜',
            price: '9.99',
            num: 1,
            id: 4
          }
        ]
      }
    ],
    id: null,
    user: null,
    orderList: [],
    list: [],
    lists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      imgUrl: app.globalData.imgUrl
    })
    this.loadOrder()
  },
  // 加载订单
  loadOrder: function () {
    var that = this
    app.http('api/teamer/userQrCode', {
      token: wx.getStorageSync('token'),
      pageSize: 30,
      id: that.data.id
    }, "GET").then(res => {
      console.log(res, '获取订单')

      var data = res.data.userOrder.data
      data.map(function(n){
        n.checked =false
      })


      that.setData({
        user: res.data.userInfo,
        orderList: data
      })


      wx.hideLoading()
    })
  },
  checkboxChange: function (e) {
    var that = this
    console.log(e)
    var value = e.detail.value
    var order = that.data.orderList
    var arr = []
    var nu = ''
    var list = this.data.list
    var lists = this.data.lists

    this.setData({
      list: list
    })

  },

  checkboxChangeAll: function (e) {
    var that = this
    console.log(e)
    var index = e.detail.value
    var order = that.data.orderList
    var arr = []
    index.map(function (n) {
      var obj = {}
      obj.o_id = order[n].id
      obj.type = 1
      var gids = []
      order[n].goods_list.map(function (s) {
        console.log(s)
        gids.push(s.id)
        obj.gids = gids
      })
      arr.push(obj)
    })
    that.setData({
      list:arr
    })
    console.log(that.data.list)

  },
  checkboxChangeAllss:function(e){
    var that = this
    var all = e.detail.value[0]
    var orderList = that.data.orderList
    console.log(orderList)
    var arr =[]
    var carId = []
    if (all == null || all == "") {
      orderList.map(function (n) {
        n.checked = false
      })
      that.setData({
        payNum: 0,
        orderList: orderList,
        list:[]
      })
      console.log(that.data.list)
    } else {
      orderList.map(function (n) {
        var obj={}
        var gids=[]
        obj.o_id=n.id
        obj.type =1
        n.goods_list.map(function(dd){
          gids.push(dd.id)
        })
        obj.gids = gids
        n.checked = true
        arr.push(obj)
      })
      that.setData({
        orderList: orderList,
        list:arr
      })
      console.log(that.data.list)
    }
  },

  goWrite:function(){
    var that= this
    var arr = that.data.list

    var obj = {}

    obj.token = wx.getStorageSync('token')
    obj.orderList = JSON.stringify(arr)
    if(arr.length>0){ 
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/teamer/checkOrder', obj, "POST")
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
          if(res.code == 200){
            wx.showToast({
              title: '商品核销成功',
              duration: 2000,
              icon: 'none',
              success(data) {
                setTimeout(function () {
                  that.loadOrder()
                }, 1000) //延迟时间
              }
            })
          }

          
          wx.hideLoading()
  
        })
      
    }else{
      wx.showToast({
        title: '请选择要核销的商品',
        duration: 1000,
        icon: 'none'
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