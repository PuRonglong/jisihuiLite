var util = require('../../utils/util.js')

Page({
    data: {
        interval: 5000,
        duration: 500,
        pictureList: [],
        adInfo: {},
        newsList: [],
        partList: [],
        specialList: [],
        goodBookList: [],
        hotBookList: [],
        isInputDisabled: true
    },
    getIndexList: function() {
        var that = this;
        var url = '/app/getIndexInfo';
        util.http('GET', url , {}, (response) => {
            if (response.errMsg) {
                util.showModel(response.errMsg);
            } else {
                console.log('请求首页列表接口成功！');
                that.setData({
                    pictureList: response.pictureList || [],
                    newsList: response.newsList || [],
                    partList: response.partList || [],
                    newBookList: response.newBookList || [],
                    goodBookList: response.goodBookList || [],
                    hotBookList: response.hotBookList || []
                })
            }
        })
    },
    getMoreBook: function(){
        var that = this;
        var url = '/app/getMore';
        var data = {
            type: "GOOD",
            page: 1,
            pageSize: 10
        };
        util.http('GET', url , data, (response) => {
            if (response.errMsg) {
                util.showModel(response.errMsg);
            } else {
                console.log(response);
            }
        })
    },
    goBookCity(e){
        wx.switchTab({
            url: '../../pages/bookCity/bookCity'
        })
    },
    goBookList(e){
        wx.switchTab({
            url: '../../pages/bookList/bookList'
        })
    },
    goRankList(e){
        wx.navigateTo({
            url: '../../pages/rankList/rankList'
        })
    },
    goMoreBook(e){
        wx.navigateTo({
            url: '../../pages/moreBook/moreBook?type=' + e.currentTarget.dataset.type + '&category=' + e.currentTarget.dataset.category
        })
    },
    goSearchPage(){
        wx.navigateTo({
            url: '../../pages/searchPage/searchPage'
        })
    },
    goBookDetail(e){
        wx.navigateTo({
            url: '../../pages/bookDetail/bookDetail?id=' + e.currentTarget.dataset.id
        })
    },
    setNavigationBarTitleText:function(){
        wx.setNavigationBarTitle({
            title: '集思会Lite'
        })
    },
    onPullDownRefresh: function() {
        this.getIndexList();
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
    },
    onLoad: function(){
        this.setNavigationBarTitleText();
    },
    onReady: function() {
        this.getIndexList();
    }
})