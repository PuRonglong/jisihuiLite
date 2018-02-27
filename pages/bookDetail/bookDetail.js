//index.js
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        bookDetail: {},
        loadMore: '加载更多',
        isLoading: false,
        bookTags: [],
        searchVal: '',
        bookContent:'',
        bookId:'',
        bookStatus: 'DEFAULT',
        showIndex: [],
        isShowPartContent: true
    },
    getBookDetail: function(id){
        var that = this;
        var url = '/m/book/' + id;
        util.http('GET',url, {}, (response) => {
            if (response.errMsg) {
                util.showModel(response.errMsg);
            } else {
                var array = response.book.tags ? (response.book.tags + '').replace(/[\[\]]/g, '').split(', ') : '';
                that.setData({
                    bookDetail: response,
                    bookTags: array,
                    bookAllContent: response.book.content,
                    bookContent: response.book.content,
                    bookPartContent: response.book.content ? response.book.content.substring(0, 100) + '...': '',
                    bookStatus: response.bookStatus
                })
            }
        })
    },
    getAuthBookDetail: function(id){
        var that = this;
        var url = '/m/auth/book/' + id;
        util.http('POST',url, {}, (response) => {
            if (response.errMsg) {
                util.showModel(response.errMsg);
            } else {
                var array = response.book.tags ? (response.book.tags + '').replace(/[\[\]]/g, '').split(', ') : '';
                that.setData({
                    bookDetail: response,
                    bookTags: array,
                    bookContent: response.book.content,
                    bookStatus: response.bookStatus
                })
            }
        },'',that.data.auth)
    },
    doCollect: function(){
        var that = this;
        var url = '/m/auth/collect/create';
        var data = {
            bookIds: that.data.bookId,
            bookshelfType: 'TOREAD'
        };
        util.http('POST',url, data, (response) => {
            if (response.code == 'success') {
                wx.showToast({
                    title: '收藏成功',
                    icon: 'none',
                    duration: 1000
                })
                that.setData({
                    bookStatus: 'TOREAD'
                })
            } else {
                wx.showToast({
                    title: response.code || response.data.msg,
                    icon: 'none',
                    duration: 1000
                })
                if(response.data){
                    wx.showToast({
                        title: response.data.msg,
                        icon: 'none',
                        duration: 1000
                    })
                }
                if(response.code){
                    if(response.code == 'error_repeat'){
                        wx.showToast({
                            title: '重复收藏',
                            icon: 'none',
                            duration: 1000
                        })
                    }else if(response.code == 'success'){
                        wx.showToast({
                            title: '操作成功',
                            icon: 'none',
                            duration: 1000
                        })
                    }else if(response.code == 'no_login'){
                        wx.showToast({
                            title: '用户未登录',
                            icon: 'none',
                            duration: 1000
                        })
                    }else if(response.code == 'error_book_id'){
                        wx.showToast({
                            title: '图书不存在',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                }
                if(response.data.msg == '未登录'){
                    setTimeout(function (params) {
                        that.goUserInfo();
                    },1000)
                }
            }
        },'',that.data.auth)
    },
    doCancelCollect: function(){
        var that = this;
        var url = '/m/auth/collect/';
        var data = {
            bookIds: that.data.bookId
        };
        util.http('DELETE',url, data, (response) => {
            if (response.code == 'success') {
                wx.showToast({
                    title: '取消收藏成功',
                    icon: 'none',
                    duration: 1000
                })
                that.setData({
                    bookStatus: 'DEFAULT'
                })
            } else {
                wx.showToast({
                    title: response.code,
                    icon: 'none',
                    duration: 1000
                })
            }
        },'',that.data.auth)
    },
    doPush: function(){
        var that = this;
        var url = '/m/auth/push/' + that.data.bookId;
        util.http('POST',url, {}, (response) => {
            if(response.data){
                wx.showToast({
                    title: response.data.msg,
                    icon: 'none',
                    duration: 1000
                })
                if(response.data.msg == '未登录'){
                    setTimeout(function (params) {
                        that.goUserInfo();
                    },1000)
                }
            }else{
                wx.showToast({
                    title: response.msg,
                    icon: 'none',
                    duration: 1000
                })
            }
        },'',that.data.auth)
    },
    doShowAllContent: function() {
        var isShowPartContent = !this.data.isShowPartContent;
        this.setData({
            isShowPartContent: isShowPartContent
        })
    },
    getUserInfo: function() {

        this.setData({
            userInfo: wx.getStorageSync('userInfo')
        });

        this.setData({
            auth: wx.getStorageSync('auth')
        });

        if(this.data.auth && this.data.userInfo){
            this.getAuthBookDetail(this.data.bookId);
        }else{
            this.getBookDetail(this.data.bookId);
        }
    },
    goUserInfo(){
        wx.navigateTo({
            url: '../../pages/userInfo/userInfo?type=' + '登录' + '&isInVipTime=' + 'false'
        })
    },
    goBookTag(e) {
        wx.navigateTo({
            url: '../../pages/bookTag/bookTag?tag=' + e.currentTarget.dataset.tag
        })
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onLoad: function(option){
        this.setData({
            bookId: option.id
        })
        this.getUserInfo();
    },
    onReady: function() {
    }
})