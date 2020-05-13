const app = getApp();
Page({
  data: {
    currentTab: 0, //对应样式变化
    scrollTop: 0, //用作跳转后右侧视图回到顶部
    p: 1,
    screenArray: [], //左侧导航栏内容
    screenId: "", //后台查询需要的字段
    list: [],
    type:1,
    size:10,
    page:1,
    bottomStyle: "display:none",
    carList: []
  },

  onLoad: function (options) {
    var that = this;
    console.log(options,'32321321---------')
    that.setData({
      imgUrl: app.globalData.imgUrl
    })
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    // 加载icon
    app.http('api/cateList', {}, "GET")
      .then(res => {
        that.setData({
          screenArray: res.data.categoryList
        })
        // 判断来源
        if(options.id == "" || options.id == null){
          that.setData({
            type:that.data.screenArray[0].id
          })
        }else{
          that.setData({
            type:options.id,
            currentTab:options.index
          })
        }
        that.loadPro()
        wx.hideLoading()
      })
  },
  // 加载商品列表
  loadPro: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/goodsList', {
        type: that.data.type,
        pageSize: that.data.size * that.data.page
      }, "GET")
      .then(res => {
        console.log(res, '商品')
        var list = res.data.goodsList.data
        list.map(function (n) {
          n.num = 0
        })
        that.setData({
          list: list,
          last_page: res.data.goodsList.last_page
        })
        wx.hideLoading()
      })
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
  // 加载分类
  loadIcon: function () {
    var that = this
  
  },
  navbarTap: function (e) {
    var that = this;
    console.log(e);
    var id = e.currentTarget.dataset.id
    this.setData({
      currentTab: e.currentTarget.dataset.index, //按钮CSS变化
      screenId: e.currentTarget.dataset.screenid,
      scrollTop: 0, //切换导航后，控制右侧滚动视图回到顶部
      type:id,
      bottomStyle: "display:none",
      page: 1
    })
    console.log(this.data.type)
    this.loadPro()
    this.selectComponent("#list").carNum()
    //刷新右侧内容的数据
    var screenId = this.data.screenId;
  },
  onMyEvent: function (e) {
    console.log(e, '组件传参')
    this.setData({
      carList: e.detail.carlist
    })
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
 
  bindMinus: function (e) {
    console.log(e)
    this.selectComponent("#list").gouwuchejian()
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
            this.selectComponent("#list").carNum()
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
})