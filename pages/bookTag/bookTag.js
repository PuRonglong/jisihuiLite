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
    // 获取图书分类列表
    getBookTagList(sKey, page, flag) {
        var that = this;
        var url = '/app/tags/' + sKey + '/' + page;
        util.http('GET', url, {}, (response) => {
            if(response.errMsg) {
                util.showModel(response.errMsg);
            } else {
                if(flag){
                    this.setData({
                        bookCategoryList: that.data.bookCategoryList.concat(response.resData)
                    })
                }else{
                    that.setData({
                        bookCategoryList: response.resData
                    })
                }
            }
        })
    },
    setNavigationBarTitleText:function(option){
        wx.setNavigationBarTitle({
            title: option.tag
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
        this.getBookTagList(this.getOption.type, page, true);     
    },
    // 刷新数据
    onPullDownRefresh: function(){
        this.getBookTagList(this.getOption.type, '1', false);
        wx.stopPullDownRefresh();
    },
    // 加载更多
    onReachBottom: function() {
        this.getMoreBookTypeList();
    },
    onLoad: function(option){
        this.getOption = option;
        this.setNavigationBarTitleText(option);
        this.getBookTagList(option.tag, '1');
    },
    onReady: function() {
        // this.getUserInfo();
        // this.getBookTagList();
    }
})