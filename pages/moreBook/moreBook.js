var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        moreBookList: [],
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
    getMoreBookList(type, page, flag) {
        var that = this;
        var url = '/app/getMore';
        var data = {
            type: type,
            page: page,
            pageSize: 10
        };
        util.http('GET', url, data, (response) => {
            if(response.errMsg) {
                util.showModel(response.errMsg);
            } else {
                if(flag){
                    this.setData({
                        moreBookList: that.data.moreBookList.concat(response.bookList)
                    })
                }else{
                    that.setData({
                        moreBookList: response.bookList
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
        this.oldListArray = this.data.moreBookList;
        var page = (this.data.num);
        this.getMoreBookList(this.getOption.type, page, true);     
    },
    // 刷新数据
    onPullDownRefresh: function(){
        this.getMoreBookList(this.getOption.type, '1', false);
        wx.stopPullDownRefresh();
    },
    // 加载更多
    onReachBottom: function() {
        this.getMoreBookTypeList();
    },
    onLoad: function(option){
        this.getOption = option;
        this.setNavigationBarTitleText(option);
        this.getMoreBookList(option.type, '1');
    },
    onReady: function() {
    }
})