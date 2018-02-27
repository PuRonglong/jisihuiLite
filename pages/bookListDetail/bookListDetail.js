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
    getBookCategoryList(booklistId) {
        var that = this;
        var url = '/m/booklist/' + booklistId;
        util.http('GET', url, {}, (response) => {
            if(response.errMsg) {
                util.showModel(response.errMsg);
            } else {
                that.setData({
                    bookCategoryList: response.bookList
                })
            }
        })
    },
    setNavigationBarTitleText:function(option){
        wx.setNavigationBarTitle({
            title: option.title
        })
    },
    goBookDetail(e) {
        wx.navigateTo({
            url: '../../pages/bookDetail/bookDetail?id=' + e.currentTarget.dataset.id
        })
    },
    getMoreBookList() {
        this.setData({
            num: (this.data.num) + 1
        })
        this.oldListArray = this.data.bookCategoryList;
        var page = (this.data.num);
        this.getBookCategoryList(this.getOption.type, page, true);
    },
    // 刷新数据
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh();
    },
    // 加载更多
    onReachBottom: function() {
        // this.getMoreBookList();
    },
    onLoad: function(option){
        console.log(option);
        // this.getOption = option;
        this.setNavigationBarTitleText(option);
        this.getBookCategoryList(option.id);
    },
    onReady: function() {
        // this.getUserInfo();
        // this.getBookCategoryList();
    }
})