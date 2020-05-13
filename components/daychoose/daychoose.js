
// components/daychoose/daychoose.js
var util = require('../../utils/util.js');
Component({
  attached() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day=date.getDate();
 
    const maxDate = new Date(this.properties.endDate);
    console.log("maxDate", maxDate);
    let maxYear=maxDate.getFullYear();
    let maxMonth=maxDate.getMonth()+1;
    let maxDay = maxDate.getDate();
    let isNext = (maxYear > year) || (maxYear == year && maxMonth > month) || (maxYear == year && maxMonth == month&&maxDay>day);
 
    this.setData({
      year: year,
      month: month,
      day:day,
      maxYear: maxYear,
      maxMonth: maxMonth,
      maxDay: maxDay,
      nextActive: isNext
    });
  },
  /**
   * 组件的属性列表
   */
  properties: {
    endDate:{
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, 
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    year: 1900,
    month: 1,
    day:1,
    maxYear: 1900,
    maxMonth: 1,
    maxDay:1,
    preActive:false,
    nextActive:false
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    bindPreDay:function(){
      let { year, month,day} = this.data;
      let curday = year + '-' + month + '-' + day;
      //前一天的日期
      let dateText = util.getNextPreDate(curday, -1).split('-');
      year = dateText[0];
      month = dateText[1];
      day = dateText[2];
 
      const date = new Date();
      let minYear = date.getFullYear();
      let minMonth = date.getMonth() + 1;
      let minDay=date.getDate();
      let isPre = (year > minYear) || (year == minYear && month > minMonth) || (year == minYear && month == minMonth&&day>minDay);
      this.setData({
        year: year,
        month: month,
        day:day,
        nextActive: true,
        preActive: isPre
      });
      this.triggerEvent("bindpreDay", { year, month,day});
    },
    bindNextDay:function(){
      let { year, month,day, maxYear, maxMonth,maxDay}=this.data;
      let curday=year+'-'+month+'-'+day;
      //后一天的日期
      let dateText=util.getNextPreDate(curday,1).split('-');
      year = dateText[0];
      month=dateText[1];
      day=dateText[2];
      let isNext = (maxYear > year) || (maxYear == year && maxMonth > month) || (maxYear == year && maxMonth == month && maxDay > day);
      this.setData({
        year: year,
        month: month,
        day:day,
        nextActive: isNext,
        preActive:true
      });
      this.triggerEvent("bindnextDay", { year, month,day })
    }
  }
})