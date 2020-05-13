// pages/my/commanderOrg/commanderOrg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      {
        id:1,
        name:'正常营业'
      },
      {
        id:2,
        name:'暂停营业'
      }
    ],
    defult:'正常营业',
    notice:null,
    user:null,
    // 1正常营业，2暂停营业
    type:1,
    priceList:null,
    phone:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 加载公告列表
    app.http('api/noticeList', {
      type:2,
      pageSize:20
    }, "GET").then(res => {
      console.log(res, '公告')
      that.setData({
        notice:res.data.noticeList.data
      })
      wx.hideLoading()
    })

    // 加载电话
    app.http('api/phone', {
    }, "GET").then(res => {
      console.log(res, '电话')
      that.setData({
        phone:res.data.value
      })
    })
    that.loadPrice()
    that.loadweiOrder()
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e)
    this.setData({
      type: parseInt(e.detail.value) + 1,
      defult:this.data.array[e.detail.value].name
    })
    // 改变营业状态
    this.updata()
  },

  // 获取未取货订单
  loadweiOrder:function(){
    var that = this
    app.http('api/teamer/teamOrder', {
      token: wx.getStorageSync('token'),
      type:1,
      pageSize:100
    }, "GET")
    .then(res => {
      console.log(res, '社区订单-------')
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
        weiList:res.data.teamOrder.data
      })
      wx.hideLoading()

    })
  },


  // 加载佣金金额
loadPrice:function(){
  var that = this
  wx.showLoading({ //显示 loading 提示框
    title: "加载中..."
  })
  app.http('api/teamer/team_commission', {
    token:wx.getStorageSync('token')
  }, "POST").then(res => {
    console.log(res, '金额')
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
      priceList:res.data.team_commission
    })
    wx.hideLoading()
  })
},

  // 改变营业状态
  updata:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/teamer/status', {
      token:wx.getStorageSync('token'),
      status:that.data.type
    }, "POST").then(res => {
      console.log(res, '状态修改')
      wx.showToast({
        title: '修改状态成功！',
        icon: 'success',
        duration: 2000
      })
      that.loadTeam()
   
      wx.hideLoading()
    })
  },  
  goHexiao:function(){
    wx.scanCode({
      success: (res) => {
        var result = res.result
        wx.navigateTo({
          url: '../writeOrder/writeOrder?id=' + result
        })
      },
      fail: (res) => {
        
      }
    })
  },
  goCaiwu:function(){
    wx.navigateTo({
      url: '../finance/finance'
    })
  },
  goHexiaoss:function(){
    wx.navigateTo({
      url: '../writeOrderlist/writeOrderlist'
    })
  },
  goShequ:function(){
    wx.navigateTo({
      url: '../sqOrder/sqOrder'
    })
  },
  goYanshou:function(){
    wx.navigateTo({
      url: '../acceptance/acceptance'
    })
  },
  goShouhou:function(){
    wx.navigateTo({
      url: '../aftermarket/aftermarket'
    })
  },
  phone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
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
    // 加载团长信息
    that.loadTeam()
  },

  loadTeam:function(){
    var that = this
    app.http('api/user', {
      token: wx.getStorageSync('token')
    }, "GET").then(res => {
      console.log(res, 'dsadadsashuaxin')
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
        that.setData({
          user: res.data.teamerInfo,
          type: 2,
          defult:that.data.array[parseInt(res.data.teamerInfo.status) - 1].name
        })
      }
      wx.hideLoading()
    })
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