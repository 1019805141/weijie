
const App = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName:String,
    showNav:{
      type:Boolean,
      value:true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    
  },
 
  lifetimes: {
    attached: function () {
      this.setData({
        navH: App.globalData.navHeight
      })
     }
  },
  methods: {
    //回退
    navBack: function () {
        wx.navigateBack({
          delta: 1
        })      
    },
   
    //回主页
    toIndex: function () {
      wx.navigateTo({
        url: '/pages/admin/home/index/index'
      })
    },
     
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
     
    },
    hide: function () { },
    resize: function () { },
  },
})