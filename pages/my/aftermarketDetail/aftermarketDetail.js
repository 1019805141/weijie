// pages/my/aftermarketDetail/aftermarketDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    controls: true,
    showModalStatus: false,
    motaltype:null,
    id:null,
    detail:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id:options.id,
      imgUrl: app.globalData.imgUrl
    })
    that.loadDetail()
  },
  // 加载详情
  loadDetail:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/afterDetail', {
        token: wx.getStorageSync('token'),
        o_id:that.data.id
      }, "GET")
      .then(res => {
        console.log(res, '退款详情-----')
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
          that.setData({
            detail:res.data.orderDetail
          })
          wx.hideLoading()
        }
      })
  },
  tongyi:function(e){
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认同意退款吗',
      content: '确认后无法更改状态，请谨慎操作',
      success (res) {
        if (res.confirm) {
          wx.showLoading({ //显示 loading 提示框
            title: "加载中..."
          })
          app.http('api/teamer/handOrder', {
              token: wx.getStorageSync('token'),
              r_id:id,
              hand:2
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
                if(res.code == 200){
                  wx.showToast({
                    title: '退款成功',
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
              }
            })



        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  jujue:function(e){
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认同意退款吗',
      content: '确认后无法更改状态，请谨慎操作',
      success (res) {
        if (res.confirm) {
          wx.showLoading({ //显示 loading 提示框
            title: "加载中..."
          })
          app.http('api/teamer/handOrder', {
              token: wx.getStorageSync('token'),
              r_id:id,
              hand:3
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
                if(res.code == 200){
                  wx.showToast({
                    title: '已拒绝退款',
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
              }
            })



        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    var type = e.currentTarget.dataset.type
    this.setData({
      motaltype:type
    })
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例  
    var animation = wx.createAnimation({
      duration: 300, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
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