// pages/my/acceptance/acceptance.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        name: '榴莲',
        num: 5
      }, {
        name: '榴莲',
        num: 5
      },
      {
        name: '榴莲',
        num: 5
      }
    ],
    controls: true,
    showModalStatus: false,
    list: null,
    queList: [],
    goods: [],
    message:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadList()
  },
  loadList: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/teamer/sale', {
        token: wx.getStorageSync('token')
      }, "GET")
      .then(res => {
        console.log(res, '3213232131-----')
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
            list: res.data.saleList
          })
          wx.hideLoading()
        }
      })
  },
  checkboxChange: function (e) {
    console.log(e)
    var queList = []
    var list = this.data.list
    var index = e.detail.value
    index.map(function (n) {
      queList.push(list[n])
    })
    console.log(queList)
    this.setData({
      queList: queList
    })
  },

  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    var that = this
    if (that.data.queList.length > 0) {
      this.util(currentStatu)
    } else {
      wx.showToast({
        title: '请先选择商品',
        duration: 2000,
        icon: 'none'
      })
    }

  },
  changeinput: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var queList = this.data.queList
    var value = e.detail.value
    queList[index].amount = value
    this.setData({
      goods:queList
    })
  },
    formessage:function(e){
      this.setData({
        message:e.detail.value
      })
  },
  submit:function(e){
    var currentStatu = e.currentTarget.dataset.statu;
    var that= this
    var goods = that.data.goods
    var queList = that.data.queList

    if(goods.length==0){
      wx.showToast({
        title: '请输入缺货数量',
        duration: 2000,
        icon: 'none'
      })
      
    }else{
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/teamer/outSale', {
        token: wx.getStorageSync('token'),
        goods: JSON.stringify(goods),
        message:that.data.message
      }, "POST").then(res => {
  
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
            title: '提交成功..',
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
    }

    
    


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