// pages/my/commander/commander.js
const app = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk;
var areaInfo = []; //所有省市区县数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    defult: '请选择地区',
    sendTime: '获取验证码',
    sendColor: '#ffffff',
    snsMsgWait: 60,
    name: null,
    tel: null,
    address: null,
    code: null,
    latitude: null,
    longitude: null,
    province_code: null,
    area_code: null,
    located_detail: null,
    located_name: null,
    teamList: null,
    // 审核状态 1待审核 2 通过未确认 3 通过已确认 4未通过驳回 5 初次
    type: 1,
    tuisong:'display:none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    qqmapsdk = new QQMapWX({
      key: 'B5SBZ-PDJWW-S5ORQ-RAAEX-L7Z7H-H3FY3'
    });

    that.loadTeam()

  },
  // 查询是否申请过团长
  loadTeam: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/isApply', {
        token: wx.getStorageSync('token')
      }, "POST")
      .then(res => {

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
          if (res.code == 400) {
            that.setData({
              type: 5
            })
          } else {
            that.setData({
              teamList: res.data.isApply,
              type: res.data.isApply.state
            })
          }
          wx.hideLoading()
        }

      })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  goMap: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res, 'dingwei')
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
          defult: res.name,
          located_detail: res.address
        })
        that.getLocal(latitude, longitude)
      }
    });
  },
  // 获取验证码
  sendCode: function () {
    var that = this
    if (that.data.tel == null || that.data.tel == '') {
      wx.showToast({
        title: '请填写手机号',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    // 60秒后重新获取验证码
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/applyCode', {
        token: wx.getStorageSync('token'),
        phone: that.data.tel
      }, "POST")
      .then(res => {
        console.log(res, 'dddddd')
        var inter = setInterval(function () {
          this.setData({
            smsFlag: true,
            sendColor: '#cccccc',
            sendTime: this.data.snsMsgWait + 's后重发',
            snsMsgWait: this.data.snsMsgWait - 1
          });
          if (this.data.snsMsgWait < 0) {
            clearInterval(inter)
            this.setData({
              sendColor: '#ffffff',
              sendTime: '获取验证码',
              snsMsgWait: 60,
              smsFlag: false
            });
          }
        }.bind(this), 1000);
        wx.hideLoading()
      })
  },
  forName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  forTel: function (e) {
    console.log(e)
    this.setData({
      tel: e.detail.value
    })
  },
  forCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  forAdress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  // 经纬度转化名称
  getLocal: function (latitude, longitude) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res, ';ddddddd')
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        let area_code = res.result.ad_info.adcode
        let city_code = area_code.substr(0, 4) + '00'
        let province_code = area_code.substr(0, 2) + '0000'
        console.log(province_code, city_code)
        that.setData({
          province: province,
          city: city,
          district: district,
          area_code: area_code,
          province_code: province_code,
          city_code: city_code
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  submit: function () {
    var that = this
    // 判断当前团长状态
    if (that.data.type == 1) {
      wx.showToast({
        title: '请等待管理员审核',
        duration: 2000,
        icon: 'none'
      })
    } else if (that.data.type == 2) {
      wx.showModal({
        title: '是否确认成为团长',
        content: '审核已通过，\r\n点击下方确认按钮方可成为团长',
        success(res) {
          if (res.confirm) {
            app.http('api/confirmApply', {
              token: wx.getStorageSync('token')
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
              }else{
                wx.showToast({
                  title: '恭喜您已成为团长！',
                  duration: 2000,
                  icon: 'none',
                  success(data) {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                      wx.hideLoading()
                    }, 2000) //延迟时间
                  }
                })
              }
            })
          } else if (res.cancel) {}
        }
      })
    } else {
      if (that.data.name == null || that.data.name == '') {
        wx.showToast({
          title: '请填写姓名',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      if (that.data.tel == null || that.data.tel == '') {
        wx.showToast({
          title: '请填写手机号',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      if (that.data.code == null || that.data.code == '') {
        wx.showToast({
          title: '请填写验证码',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      if (that.data.latitude == null && that.data.longitude == null) {
        wx.showToast({
          title: '请选择地区',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      if (that.data.address == null || that.data.address == '') {
        wx.showToast({
          title: '请填写详细地址',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/apply', {
          token: wx.getStorageSync('token'),
          name: that.data.name,
          phone: that.data.tel,
          code: that.data.code,
          address: that.data.address,
          province_code: that.data.province_code,
          city_code: that.data.city_code,
          area_code: that.data.area_code,
          longitude: that.data.longitude,
          latitude: that.data.latitude,
          located_name: that.data.defult,
          located_detail: that.data.located_detail
        }, "POST")
        .then(res => {
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
          if (res.code == 200) {
            wx.showToast({
              title: '提交成功请等待审核',
              duration: 2000,
              icon: 'none',
              success(data) {
                setTimeout(function () {
                  that.setData({
                    tuisong:'display:block'
                  })

                
                  wx.hideLoading()
                }, 2000) //延迟时间
              }
            })
          }
          if (res.code == 301) {
            wx.showToast({
              title: '已提交过请等待审核',
              duration: 2000,
              icon: 'none'
            })
          }
          wx.hideLoading()
        })
    }
  },
  tuisong_hide:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  tuisong_t:function(){
    this.setData({
      tuisong:'display:none'
    })
    wx.requestSubscribeMessage({
      tmplIds: ['aIaCLzzGQyFCo7JrRhilddWEatlILCTCRf3Vm4WF-kY'],
      success (res) {
        wx.navigateBack({
          delta: 1
        })
       },
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