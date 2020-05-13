// pages/index/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputImg:'display:block',
    name:null,
    list:[],
    num: 0,
    carList: [],
    p: 0,
    jxList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      name:options.name,
      imgUrl: app.globalData.imgUrl
    })
    that.loadOrder()
    that.loadJingpin()
  },
  // 加载搜索订单
  loadOrder:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/goodsSearch', {
      name:that.data.name,
      size:30
    }, "GET")
    .then(res => {
      // token失效
        console.log(res,'dsadasdsa')

        var list = res.data.data
        list.map(function (n) {
          n.num = 0
        })
        that.setData({
          list:list
        })
        wx.hideLoading()
      
    })
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
      name:e.detail.value
    })
  },
  bindconfirm: function () {
    var that = this
    that.loadOrder()
  },
  goCp: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../../login/login'
      })
    } else {
      wx.navigateTo({
        url: '../proDetail/proDetail?id=' + id
      })
    }
  },

  // 加载购物车
  loadCar:function(){

  },
  onMyEvent: function (e) {
    this.setData({
      carList: e.detail.carlist
    })
    console.log(this.data.carList, '3213213123')
    var carList = this.data.carList
    var list = this.data.list
    // 循环替换购物车与商品列表的购买数量
    carList.map(function (n) {
      list.map(function (s) {
        if (n.get_goods_info.id == s.id) {
          s.num = n.amount
        }
      })
    })
    this.setData({
      list: list
    })

  },

    /* 点击减号 */

    bindMinus: function (e) {
      console.log(e)
      var that = this
      var index = e.currentTarget.dataset.index
      var id = e.currentTarget.dataset.id
      var carList = that.data.carList
      var carId = null
      var num = e.currentTarget.dataset.num
      if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
        wx.navigateTo({
          url: '../../login/login'
        })
      } else {
        wx.showLoading({ //显示 loading 提示框
          title: "加载中..."
        })
        // 循环购物车列表,比对id 取购物车id进行数量减1
        carList.map(function (n) {
          if (id == n.get_goods_info.id) {
            carId = n.id
          }
        })
        app.http('api/redNum', {
            token: wx.getStorageSync('token'),
            id: carId
          }, "POST")
          .then(res => {
            // token失效
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
              var data = this.data.list
              console.log(res, '购物车减少数量')
              that.selectComponent("#list").carNum()
              // 如果大于1时，才可以减 
              if (data[index].num >= 1) {
                data[index].num--
              }
              if (num == 1) {
                app.http('api/delCar', {
                  token: wx.getStorageSync('token'),
                  id: carId
                }, "POST").then(res => {
                  wx.showToast({
                    title: '该商品已在购物车删除',
                    duration: 2000,
                    icon: 'none'
                  })
                })
              }
              that.setData({
                list: data
              });
              // this.selectComponent("#list").carNum()
              // 如果数量等于1时 从购物车删除
  
              wx.hideLoading()
            }
          })
      }
    },
    /* 点击加号 */
    bindPlus: function (e) {
      var that = this
      var id = e.currentTarget.dataset.id
      var index = e.currentTarget.dataset.index
      if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
        wx.navigateTo({
          url: '../../login/login'
        })
      } else {
        wx.showLoading({ //显示 loading 提示框
          title: "加载中..."
        })
        // 加入购物车
        app.http('api/car', {
            token: wx.getStorageSync('token'),
            g_id: id,
            amount: 1
          }, "POST")
          .then(res => {
            // token失效
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
              wx.showToast({
                title: '加入购物车成功！',
                duration: 2000,
                icon: 'none',
              })
              console.log(res, '加入购物车')
              // this.selectComponent("#list").carNum()
              console.log(e)
              var data = this.data.list
              data[index].num++
              // 将数值与状态写回 
              that.setData({
                list: data
              });
              wx.hideLoading()
            }
          })
      }
    },
    // 加载精品商品
    loadJingpin:function(){
      var that = this
      app.http('api/goodsSearch', {
        is_recommend:1,
        size:6
      }, "GET").then(res => {
        console.log(res, '精选商品')
        that.setData({
          jxList:res.data.data
        })
      })
    },

    goqg:function(e){
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../proDetail/proDetail?id=' + id
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