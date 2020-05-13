const app = getApp();
var time = require('../../utils/util.js');
Page({
  data: {
    inputImg: 'display:block',
    endTime: '2020-05-21 10:40:30',
    leixingList: [],
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
    minusStatus: 'disabled',
    list: [],
    inputShowed: false,
    noticeList: [],
    iconList: [],
    type: 'selling',
    zongList: [],
    index: 0,
    bottomStyle: "display:none",
    page: 1,
    size: 5,
    last_page: 1,
    carList: [],
    teamer: null,
    // 1是未登录2是登陆
    teamType: 1,
    keywords: '',
    fxContent: null,
    fxImg: null,
    fxQrcode: null,
    fxBg: null,
    start_time: null,
    end_time: null,
    sss: 0,
    mmm: 0,
    hhh: 0,
    bannerList:[],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    imgList:null,
    imgheights: [],
    imgheights2: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    current: 0,
    current2: 0
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

    var that = this
    that.setData({
      navH: app.globalData.navHeight,
      imgUrl: app.globalData.imgUrl
    })
    if (wx.getStorageSync('latitude') == null || wx.getStorageSync('latitude') == '') {
      wx.redirectTo({
        url: 'position/position'
      })
    } else {

    }
    this.loadTime()
    this.loadBanner()
    this.loadGg()
    this.loadNotice()
    this.loadIcon()
    this.loadPro()
    this.attached()


  },
  // 加载通知
  loadNotice: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/noticeList', {
        type: 1
      }, "GET")
      .then(res => {
        that.setData({
          noticeList: res.data.noticeList.data
        })
        wx.hideLoading()
      })
  },
  // 加载分类
  loadIcon: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/cateList', {}, "GET")
      .then(res => {
        that.setData({
          iconList: res.data.categoryList
        })
        var list = res.data.categoryList
        var all = {
          name: '热卖',
          id: 'selling'
        }
        list.unshift(all)
        that.setData({
          leixingList: list
        })
        wx.hideLoading()
      })
  },
  // 获取开团时间
  loadTime: function () {
    var that = this
    app.http('api/time', {}, "GET")
      .then(res => {
        var year = new Date().getFullYear()
        var mouth = (new Date().getMonth() + 1)>9?(new Date().getMonth()+1):('0'+(new Date().getMonth()+1))
        var day = new Date().getDate()>9?(new Date().getDate()):('0'+new Date().getDate())
        var time = year + '-' + mouth + '-' + day + ' ' + res.data.end_time
        var time1 = new Date(time.replace(/-/g, "/"))
        var standardDay = time1.getTime(time1);
        console.log(time1,'---------')
        that.setData({
          end_time: parseInt(standardDay)
        })
        console.log(that.data.end_time,'shijian')
        this.countDown()
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
  onMyEvent: function (e) {
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
  // 倒计时
  countDown: function () {
    var that = this;
    var nowTime = new Date().getTime(); //现在时间（时间戳）
    var endtime = +that.data.end_time; //结束时间（时间戳）
    var endTime = new Date(endtime).getTime();
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
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio - 20;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },


  imageLoad2: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio - 20;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights2;
    //把每一张图片的对应的高度记录到数组里
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights2: imgheights
    })
  },
  bindchange2: function (e) {
    // console.log(e.detail.current)
    this.setData({ current2: e.detail.current })
  },



  searchInput: function (e) {
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
      keywords: e.detail.value
    })
  },

  dsad: function () {
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
    var index = e.currentTarget.dataset.index
    var zong = that.data.zongList
    that.setData({
      currentIndexs: query,
      type: label,
      page: 1,
      bottomStyle: "display:none"
    })
    this.loadPro()
    this.selectComponent("#list").carNum()
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

    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/goodsRecommend', {}, "GET")
      .then(res => {
        that.setData({
          fxContent: res.data
        })
        wx.downloadFile({
          url: '../../image/fenxbg.jpg',
          success(res) {
            if (res.statusCode === 200) {
              that.setData({
                fxBg: res.tempFilePath
              })
            }
          }
        })
        wx.downloadFile({
          url: that.data.imgUrl + that.data.fxContent.img,
          success(res) {
            if (res.statusCode === 200) {
              that.setData({
                fxImg: res.tempFilePath
              })
            }
          }
        })
        wx.downloadFile({
          url: that.data.fxContent.qrcode,
          success(res) {
            if (res.statusCode === 200) {
              that.setData({
                fxQrcode: res.tempFilePath
              })
            }
          }
        })
        wx.hideLoading()
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

  bindMinus: function (e) {
    this.selectComponent("#list").gouwuchejian()
    var that = this
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var carList = that.data.carList
    var carId = null
    var num = e.currentTarget.dataset.num
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
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
            this.selectComponent("#list").carNum()
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

  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回 
    this.setData({
      num: num
    });
  },
  tarCommander: function () {

    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: 'commander/commander'
      })
    }
  },
  bindconfirm: function () {
    var that = this
    if (that.data.keywords == null || that.data.keywords == '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: 'search/search?name=' + that.data.keywords
      })
    }
  },
  goNotice: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'notice/notice?id=' + id
    })
  },
  goList: function (e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: 'list/list?id=' + id + "&index=" + index
      })
    }
  },
  goCp: function (e) {
    var id = e.currentTarget.dataset.id
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: 'proDetail/proDetail?id=' + id
      })
    }
  },
  moreNotice: function () {
    wx.navigateTo({
      url: 'noticeList/noticeList'
    })
  },
  attached: function () {
    var that = this;
    let custom = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: function (e) {
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
  // 轮播图加载
  loadBanner:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/bannerList', {
      id:3
      }, "GET")
      .then(res => {
        that.setData({
          bannerList:res.data.bannerList
        })
        wx.hideLoading()
      })
  },
   // 广告位加载
   loadGg:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/bannerList', {
      id:5
      }, "GET")
      .then(res => {
        that.setData({
          imgList:res.data.bannerList
        })
        wx.hideLoading()
      })
  },
  // 默认加载未登录团长信息
  loadTeam: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/teamer/getTeamer', {
        latitude: wx.getStorageSync('latitude'),
        longitude: wx.getStorageSync('longitude')
      }, "GET")
      .then(res => {
        that.setData({
          teamType: 1,
          teamer: res.data
        })
        wx.hideLoading()
      })
  },
  // 默认加载登录后的团长信息
  loadUserTeam: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/defaultTeamer', {
        token: wx.getStorageSync('token')
      }, "GET")
      .then(res => {
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
        }
        that.setData({
          teamer: res.data.defaultTeamer,
          teamType: 2
        })
        wx.hideLoading()
      })
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    if (wx.getStorageSync('token') == null || wx.getStorageSync('token') == '' || wx.getStorageSync('token') == undefined) {
      this.setData({
        teamType: 1,
        teamer: wx.getStorageSync('teamList')
      })
    } else {
      this.setData({
        teamType: 2
      })
      this.loadUserTeam()
    }
  },

  baocun: function () {
    this.h()
  },
  h: function () {
    var c = wx.createCanvasContext('share')

    c.drawImage('../../image/fenxbg.jpg', 0, 0, 602, 836)
    c.drawImage(this.data.fxImg, 90, 250, 422, 264)
    // c.setFillStyle('#fff')
    c.setFontSize(22)
    c.fillText(this.data.fxContent.name, 90, 550)
    c.setFillStyle('#e94638')
    c.fillText(this.data.fxContent.price, 90, 590)
    c.drawImage(this.data.fxQrcode, 80, 640, 130, 130)
    c.setFillStyle('#000000')
    c.setFontSize(18)
    c.fillText('长按识别小程序二维码', 240, 680)
    c.setFillStyle('#666666')
    c.fillText('薇姐爱团GO 有用有趣有温度', 240, 720)
    c.draw(false, this.getsss)
  },
  getsss() {
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
        this.saveImggeToPhontos(res.tempFilePath)
      }
    })
  },
  saveImggeToPhontos(imgurl) {
    if (imgurl) {
      wx.saveImageToPhotosAlbum({
        filePath: imgurl,
        success: (res) => {
          wx.showToast({
            title: '保存成功'
          })
          drawin = false
          //删除海报
          wx.request({
            url: app.url + 'api/UserCenter/DeleteUserPoster',
            data: {
              url: this.data.hz
            },
            success: function () {

            }
          })
          //删除海报
          wx.request({
            url: app.url + 'api/UserCenter/DeleteUserPoster',
            data: {
              url: this.data.hde
            },
            success: function () {

            }
          })
        },
        fail: (err) => {
          wx.showToast({
            title: '保存失败'
          })
          drawin = false
        }
      })
    } else {
      wx.showToast({
        title: '绘制中',
        icon: 'loading',
        duration: 3000
      })
    }
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
    var that = this
    var page = that.data.page
    if (page == that.data.last_page) {
      that.setData({
        bottomStyle: "display:block"
      })
    } else {
      that.setData({
        page: that.data.page + 1
      })
      that.loadPro()
      this.selectComponent("#list").carNum()
    }



  },
  onShareAppMessage: function (e) {
    // 用户点击右上角分享
    let that = this;
    if (e.from == 'button') {
      return {
        title: '薇姐爱团Go每日推荐', // 转发后 所显示的title
        path: '/pages/index/proDetail/proDetail?id=' + that.data.fxContent.id,
        success: (res) => { // 成功后要做的事情

        },
        fail: function (res) {
          // 分享失败
        }
      }
    }
  }
})