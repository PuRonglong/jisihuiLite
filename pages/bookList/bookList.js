var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        isShow: false,
        isShowQues: false,
        bookCategoryList: [],
        loadMore: '加载更多',
        isLoading: false,
        historyList: [],
        searchVal: '',
        num: 1,
        oldListArray: []
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
    getBookList(rankType, page, flag) {
        var that = this;
        var url = '/m/booklist/page/' + rankType + '/' + page;
        util.http('GET', url, {}, (response) => {
            if(response.errMsg) {
                util.showModel(response.errMsg);
            } else {

                if(flag){
                    this.setData({
                        bookList: that.data.bookList.concat(response)
                    })
                }else{
                    that.setData({
                        bookList: response
                    })
                }
            }
        })
    },
    setNavigationBarTitleText:function(){
        wx.setNavigationBarTitle({
            title: "精品书单"
        })
    },
    goBookListDetail(e) {
        wx.navigateTo({
            url: '../../pages/bookListDetail/bookListDetail?title=' + e.currentTarget.dataset.title + '&id=' + e.currentTarget.dataset.id
        })
    },
    getMoreBookList() {
        this.setData({
            num: (this.data.num) + 1
        })
        this.oldListArray = this.data.bookList;
        var page = (this.data.num);
        this.getBookList('1', page, true);     
    },
    // 刷新数据
    onPullDownRefresh: function(){
        this.getBookList('1', '1', false);
        wx.stopPullDownRefresh();
    },
    // 加载更多
    onReachBottom: function() {
        this.getMoreBookList();
    },
    onReady: function() {
        this.getBookList('1', '1', false);
        this.setNavigationBarTitleText();
    }
})
