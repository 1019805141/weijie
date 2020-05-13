// pages/my/writeOfforder/writeOfforder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail: null,
    orderList: [],
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id: options.id,
      imgUrl: app.globalData.imgUrl
    })
    that.loadOrder()
  },
  // 加载核销订单
  loadOrder: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/teamer/detail', {
        token: wx.getStorageSync('token'),
        o_id: that.data.id
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

        var data = res.data.detail
        data.goods_list.map(function (n) {
          n.checked = false
        })


        that.setData({
          detail: res.data.detail
        })
        wx.hideLoading()

      })
  },
  checkbox1: function (e) {
    console.log(e)
  },
  checkboxChangeAll: function (e) {
    console.log(e)
    var orderList = this.data.orderList
    var value = e.detail.value[0]
    var data = this.data.detail
    var obj = {}

    if (value == "all") {
      obj.o_id = this.data.detail.id,
        obj.gids = [],
        obj.type = 1
      data.goods_list.map(function (n) {
        console.log(n)
        n.checked = true
        obj.gids.push(n.id)
      })
      orderList.push(obj)
      this.setData({
        detail: data,
        orderList: orderList
      })
    } else {
      obj = {}
      data.goods_list.map(function (n) {
        console.log(n)
        n.checked = false
      })
      this.setData({
        detail: data,
        orderList: []
      })

    }
    console.log(this.data.orderList, '----')
  },
  checkboxChangeList: function (e) {
    console.log(e)
    var that = this
    var orderList = this.data.orderList
    var value = e.detail.value
    var data = this.data.detail
    var obj = {}
    obj.o_id = this.data.detail.id
    obj.gids = []
    if (value.length > 0) {
      value.map(function (n) {
        orderList = []
        console.log(n)
        if (value.length == data.goods_list.length) {
          obj.gids.push(n)
          obj.type = 1
          that.setData({
            checked: true
          })
        } else {
          obj.gids.push(n)
          obj.type = 2
          that.setData({
            checked: false
          })
        }
      })
      orderList.push(obj)
      that.setData({
        orderList:orderList
      })
    
      console.log(that.data.orderList,'array')
    } else {
      that.setData({
        orderList: []
      })
      console.log(that.data.orderList,'array')
    }
    console.log(obj, '====d==ds=d=sad=as=')



  },

  goWrite:function(){
    var that= this
    var arr = that.data.orderList

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
                  wx.navigateBack({
                    delta: 1
                  })
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