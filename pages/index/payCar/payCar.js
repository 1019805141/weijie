// pages/index/payCar/payCar.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 2,
    list: [],
    payNum: 0,
    carId: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.attached()
    console.log(that.data.list, '---------')
    that.setData({
      imgUrl: app.globalData.imgUrl
    })
    that.loadJingpin()
  },
  // 加载购物车
  loadCar: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/car', {
      token: wx.getStorageSync('token'),
      pageSize: 100
    }, "GET").then(res => {
      console.log(res, '购物车')

      if (res.status_code == 500) {
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
        var list = res.data.carList.data
        list.map(function (n) {
          n.num = n.amount
          n.checked = false
        })
        this.setData({
          list: list
        })
      }
      wx.hideLoading()
    })
  },

  bindMinus: function (e) {
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      if (num == 1) {
        app.http('api/delCar', {
          token: wx.getStorageSync('token'),
          id: id
        }, "POST").then(res => {
          wx.showToast({
            title: '该商品已在购物车删除',
            duration: 2000,
            icon: 'none'
          })
          that.loadCar()
        })
      }
      app.http('api/redNum', {
          token: wx.getStorageSync('token'),
          id: id
        }, "POST")
        .then(res => {
          // token失效
          if (res.status_code == 500) {
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

            that.setData({
              list: data
            });
            wx.hideLoading()
          }
        })
    }
  },

  carDel:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除',
      content: '确定删除该商品？',
      success (res) {
        if (res.confirm) {
          app.http('api/delCar', {
            token: wx.getStorageSync('token'),
            id: id
          }, "POST").then(res => {
            wx.showToast({
              title: '该商品已在购物车删除',
              duration: 2000,
              icon: 'none'
            })
            that.loadCar()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  /* 点击加号 */
  bindPlus: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
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
          if (res.status_code == 500) {
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
            wx.showToast({
              title: '加入购物车成功！',
              duration: 2000,
              icon: 'none',
            })
            console.log(res, '加入购物车')
            this.selectComponent("#list").carNum()
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
  attached: function () {
    var that = this;
    let custom = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: function (e) {
        console.log(e)
        var ha = false
        if (e.screenHeight - e.windowHeight - e.statusBarHeight - 32 + e.statusBarHeight + custom.bottom + custom.top - e.statusBarHeight > 100) {
          ha = true
        } else {
          ha = false
        }
        that.setData({
          systemInfo: ha,
        })
      }
    })
  },
  checkboxChange: function (e) {
    var that = this
    var index = e.detail.value
    console.log(e)
    // 购物车列表
    var list = that.data.list
    var payNum = 0
    var price = null
    var carId = []
    // var index = e.
    if (index == '' || index == null) {
      if (index.length <= 0) {
        payNum = 0
        that.setData({
          payNum: payNum
        })
      }

    } else {
      // 选中了

      if (index.length > 0) {
        index.map(function (n) {
          payNum += (list[n].amount * list[n].get_goods_info.price)
          carId.push(list[n])
        })
      } else {
        payNum = 0
      }
      that.setData({
        payNum: payNum,
        carId: carId
      })
      console.log(that.data.carId, '======')
    }
  },
  // 全选
  checkboxChangeAll: function (e) {
    var that = this
    console.log(e)
    var all = e.detail.value[0]
    var list = that.data.list
    var price = null
    var carId = []
    if (all == null || all == "") {
      list.map(function (n) {
        n.checked = false
      })
      that.setData({
        payNum: 0,
        list: list
      })
    } else {
      list.map(function (n) {
        n.checked = true
        price += n.amount * n.get_goods_info.price
        console.log(n)
      })
      // 循环遍历取id
      // carId大于0时对比List id 取出未push的id
      if (carId.length > 0) {
        carId.map(function (n) {
          list.map(function (s) {
            if (n == s.id) {
              console.log(1)
            } else {
              console.log(2)
              carId.push(s)
            }
          })
        })
      } else {
        console.log(3)
        list.map(function (t) {
          carId.push(t)
        })
      }
      console.log(carId)

      that.setData({
        payNum: price,
        list: list,
        carId: carId
      })
    }
  },
  goPay: function () {
    var that = this
    var carId = that.data.carId
    var payNum = that.data.payNum
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      if (carId.length > 0) {
        var list = JSON.stringify(carId)
        wx.navigateTo({
          url: '../order/order?list=' + list +'&payNum=' + payNum + '&type=1'
        })
      } else {
        wx.showToast({
          title: '您还未选择商品',
          icon: 'none'
        })
      }
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
    var that = this
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../../login/login'
      })
    } else {
      that.loadCar()
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