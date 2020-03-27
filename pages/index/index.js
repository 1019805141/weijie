const App = getApp();
Page({
  data: {
    inputImg: 'display:block',
    endTime: '2020-05-21 10:40:30',
    leixingList: [{
      label: '热卖'
    }, {
      label: '时令水果'
    }, {
      label: '新鲜蔬菜'
    }, {
      label: '肉蛋熟食'
    }, {
      label: '活鲜水产'
    }, {
      label: '粮油调味'
    }, ],
    currentIndexs: 0,
    p: 0,
    optionList: ['所有', '选项1', '选项2'],
    value: '所有',

    hideFlag: true, //true-隐藏  false-显示
    animationData: {},
    fenxiang: 'display:none',
    // input默认是1 
    num: 0,
    // 使用data数据对象设置样式名 
    minusStatus: 'disabled'
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      navH: App.globalData.navHeight
    })
    this.countDown()
  },
  // 倒计时
  countDown: function () {
    var that = this;
    var nowTime = new Date().getTime(); //现在时间（时间戳）
    var endtime = this.data.endTime.replace(new RegExp("-", "gm"), "/")
    var endTime = new Date(endtime).getTime(); //结束时间（时间戳）
    var time = (endTime - nowTime) / 1000; //距离结束的毫秒数
    // 获取天、时、分、秒
    let day = parseInt(time / (60 * 60 * 24));
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    // console.log(day + "," + hou + "," + min + "," + sec)
    day = that.timeFormin(day),
      hou = that.timeFormin(hou),
      min = that.timeFormin(min),
      sec = that.timeFormin(sec)
    that.setData({
      day: that.timeFormat(day),
      hou: that.timeFormat(hou),
      min: that.timeFormat(min),
      sec: that.timeFormat(sec)
    })
    // 每1000ms刷新一次
    if (time > 0) {
      that.setData({
        countDown: true
      })
      setTimeout(this.countDown, 1000);
    } else {
      that.setData({
        countDown: false
      })
    }
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
  },

  dsad: function () {
    console.log(1)
  },
  //小于10的格式化函数（2变成02）
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //小于0的格式化函数（不会出现负数）
  timeFormin(param) {
    return param < 0 ? 0 : param;
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    this.dialog = this.selectComponent("#dialog");
  },

  dianjis: function (e) {
    var that = this
    let query = e.currentTarget.dataset['index']
    var label = e.currentTarget.dataset.label
    that.setData({
      currentIndexs: query
    })
    // if (tabIndex == 0) {
    //   console.log(111)
    //   that.onLoadGY(typeOne)
    // } else if (tabIndex == 1) {
    //   // that.setData({
    //   //   currentIndex: e.currentTarget.dataset[0],
    //   // })
    //   console.log(222)

  },
  // 点击选项
  getOption: function (e) {
    var that = this;
    that.setData({
      value: e.currentTarget.dataset.value,
      hideFlag: true
    })
  },
  //取消
  mCancel: function () {
    var that = this;
    that.hideModal();
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideFlag: false
    })
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间
      timingFunction: 'ease', //动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    })
    this.animation = animation; //将animation变量赋值给当前动画
    var time1 = setTimeout(function () {
      that.slideIn(); //调用动画--滑入
      clearTimeout(time1);
      time1 = null;
    }, 100)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown(); //调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 220) //先执行下滑动画，再隐藏模块

  },
  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  fenxiang: function () {
    this.hideModal()
    this.setData({
      fenxiang: 'display:block'
    })
  },
  fenxiangHide: function () {
    this.setData({
      fenxiang: 'display:none'
    })
  },

  /* 点击减号 */

  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减 
    if (num >= 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1 
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },

  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回 
    this.setData({
      num: num
    });
  },

  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享

  }
})