
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        isPassword: true,
        userInfoType: '未登录',
        defaultSize: 'default',
        primarySize: 'default',
        warnSize: 'default',
        disabled: false,
        plain: false,
        loading: false,
        typeName: '',
        selectName: '1个月',
        colletBookList: [],
        bookActivityUrl: 'https://mp.weixin.qq.com/s?__biz=MzAxOTUzNTcyMg==&mid=2648503562&idx=2&sn=470aa293bd37e7ac1dc6c8dd2b02a36b&chksm=83edd70fb49a5e198e75dbca2f157179415b97a40d2d7c42b44550cf1e8a91374cf3218b3b9b&mpshare=1&scene=1&srcid=0222paEmfy4wI1I8f82aw4r3#rd',
        useHelpUrl: 'https://jisihui.com/user/notice'
    },
    bindKeyInputMail: function(e) {
        this.setData({
            inputMail: e.detail.value
        })
    },
    bindKeyInputPassword: function(e) {
        this.setData({
            inputPassword: e.detail.value
        })
    },
    doLogin: function () {
        var that = this;
        var url = '/m/login';
        var data = {
            username: this.data.inputMail,
            password: this.data.inputPassword
        };
        var header = "application/x-www-form-urlencoded";
        util.http('POST', url, data, (response) => {
            if(response.data) {
                wx.showToast({
                    title: response.data.msg,
                    icon: 'none',
                    duration: 2000
                })
            } else {

                wx.showToast({
                    title: '登录成功',
                    icon: 'none',
                    duration: 2000
                })
                that.setData({
                    auth: response.msg
                })
                wx.setStorage({
                    key: 'auth',
                    data: response.msg
                });
                that.doGetUserInfo();
            }
            
        }, header)
    },
    doGetUserInfo: function () {
        var that = this;
        var url = '/m/auth/user';
        var header = "application/json";
        util.http('POST', url, {}, (response) => {
            if(response.id) {
                that.setData({
                    userInfo: response
                })
                wx.setStorage({
                    key: 'userInfo',
                    data: response
                });
                that.goUserCenter();
            } else {
                wx.showToast({
                    title: response.data.msg,
                    icon: 'none',
                    duration: 2000
                })
            }

        },'',that.data.auth)
    },
    doLogout: function(){
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('auth');
        this.goUserCenter();
    },
    getUserInfo: function() {
        var that = this;
        wx.getStorage({
            key: 'userInfo',
            success (res) {
                var nowTime = new Date().getTime();
                if(res.data.expiration && res.data.expiration > nowTime){
                    that.setData({
                        isInVipTime: true
                    });
                }else{
                    that.setData({
                        isInVipTime: false
                    });
                }
                
                that.setData({
                    userInfo: res.data,
                    isLogin: true
                });
            },
            fail (error) {
                that.setData({
                    typeName: '登录'
                });
                that.setNavigationBarTitleText('登录');
            }
        });
        wx.getStorage({
            key: 'auth',
            success (res) {
                that.setData({
                    auth: res.data || ''
                });
                if(that.data.typeName == '收藏'){
                    that.getUserCollect();
                }
                if(that.data.typeName == '推送记录'){
                    that.getPushHistory();
                }
            },
            fail (error) {
                that.setData({
                    typeName: '登录'
                })
                that.setNavigationBarTitleText('登录');
            }
        });
    },
    vipButton: function(){
        wx.showToast({
            title: '请在 APP 上完成',
            icon: 'none',
            duration: 1000
        })
    },
    getUserCollect: function () {
        wx.showLoading({
            title: '加载中'
        });
        var that = this;
        var url = '/m/auth/collect';
        util.http('POST', url, {}, (response) => {
            if(Array.isArray(response)){
                var array = response;
                for (let i = 0; i < array.length; i++) {
                    array[i].formatTime = array[i].time ? that.timeFormat(array[i].time) : '';
                }
                that.setData({
                    colletBookList: array
                });
                setTimeout(function(){
                    wx.hideLoading()
                },500)
            }else if(response.data.msg == '未登录'){
                this.setData({
                    typeName: '登录'
                })
                this.setNavigationBarTitleText('登录');
            }
        },'',that.data.auth)
    },
    getPushHistory: function () {
        wx.showLoading({
            title: '加载中'
        });

        var that = this;
        var url = '/m/auth/push';
        util.http('POST', url, {}, (response) => {
            if(Array.isArray(response)){
                var array = response;
                for (let i = 0; i < array.length; i++) {
                    array[i].formatTime = array[i].time ? that.timeFormat(array[i].time) : '';
                }
                that.setData({
                    colletBookList: array
                });
                setTimeout(function(){
                    wx.hideLoading()
                },1000)
            }else if(response.data.msg == '未登录'){
                this.setData({
                    typeName: '登录'
                })
                this.setNavigationBarTitleText('登录');
            }
        },'',that.data.auth)
    },
    clickOne: function(e){
        this.setData({
            selectName: e.currentTarget.dataset.type
        })
    },
    timeFormat: function(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
    },
    setNavigationBarTitleText: function (name) {
        wx.setNavigationBarTitle({
            title: name
        })
    },
    goUserCenter: function(){
        wx.switchTab({
            url: '../../pages/userCenter/userCenter'
        })
    },
    goBookDetail(e){
        wx.navigateTo({
            url: '../../pages/bookDetail/bookDetail?id=' + e.currentTarget.dataset.id
        })
    },
    goRegister: function(){
        wx.showToast({
            title: '请在网站上注册',
            icon: 'none',
            duration: 1000
        })
    },
    goForget: function(){
        wx.showToast({
            title: '请在网站上找回密码',
            icon: 'none',
            duration: 1000
        })
    },
    onPullDownRefresh: function () {
        if(this.data.typeName == '推送记录'){
            this.getPushHistory();
        };
        if(this.data.typeName == '收藏'){
            this.getUserCollect();
        };
        wx.stopPullDownRefresh();
    },
    onLoad: function (option) {
        var type = option.type || '登录';
        this.setNavigationBarTitleText(option.type);
        this.setData({
            typeName: option.type
        })
    },
    onShow: function(){
        if(this.data.typeName != '关于我们'){
            this.getUserInfo();
        }
    }
})