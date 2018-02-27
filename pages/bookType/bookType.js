var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        bookCategoryList: [],
        loadMore: '加载更多',
        isLoading: false,
        historyList: [],
        searchVal: '',
        getOption: {},
        oldListArray: [],
        num: 1
    },

    // 获取用户权限
    getSetting: function() {
        console.log('获取用户权限')
        var that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success(res) {
                            that.login()
                        },
                        error() {}
                    })
                } else {
                    that.data.logged ? that.getUserInfo() : that.login();
                }
            }
        })
    },
    // 获取图书分类列表
    getBookCategoryList(type, page, flag) {
        var that = this;
        var url = '/m/good/c/' + type + '/' + page;
        util.http('GET', url, {}, (response) => {
            if(response.errMsg) {
                util.showModel(response.errMsg);
            } else {
                if(flag){
                    this.setData({
                        bookCategoryList: that.data.bookCategoryList.concat(response)
                    })
                }else{
                    that.setData({
                        bookCategoryList: response
                    })
                }
            }
        })
    },
    setNavigationBarTitleText:function(option){
        wx.setNavigationBarTitle({
            title: option.category
        })
    },
    goBookDetail(e) {
        wx.navigateTo({
            url: '../../pages/bookDetail/bookDetail?id=' + e.currentTarget.dataset.id
        })
    },
    getMoreBookTypeList() {
        this.setData({
            num: (this.data.num) + 1
        })
        this.oldListArray = this.data.bookCategoryList;
        var page = (this.data.num);
        this.getBookCategoryList(this.getOption.type, page, true);     
    },
    // 刷新数据
    onPullDownRefresh: function(){
        this.getBookCategoryList(this.getOption.type, '1', false);
        wx.stopPullDownRefresh();
    },
    // 加载更多
    onReachBottom: function() {
        this.getMoreBookTypeList();
    },
    onLoad: function(option){
        this.getOption = option;
        this.setNavigationBarTitleText(option);
        this.getBookCategoryList(option.type, '1');
    },
    onReady: function() {
        // this.getUserInfo();
        // this.getBookCategoryList();
    }
})