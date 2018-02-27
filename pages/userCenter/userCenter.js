Page({
    data: {
        userInfo: {},
        isLogin: false,
        isInVipTime: false,
        userCenterList: [],
        auth: '',
        theme: 'light',
        vipTime: ''
    },
    getUserInfo: function() {
        var that = this;
        wx.getStorage({
            key: 'userInfo',
            success (res) {
                var nowTime = new Date().getTime();
                if(res.data.expiration){
                    that.setData({
                        vipTime: that.formatDate(res.data.expiration)
                    });
                }else{
                    that.setData({
                        vipTime: ''
                    });
                }
                if(res.data.expiration && res.data.expiration > nowTime){
                    that.setData({
                        isInVipTime: true
                    });
                }else{
                    that.setData({
                        isInVipTime: false
                    });
                }
                console.log(res.data);
                that.setData({
                    userInfo: res.data,
                    isLogin: true
                });
            },
            fail (error) {
                that.setData({
                    userInfo: {},
                    isLogin: false
                });
            }
        });
        wx.getStorage({
            key: 'auth',
            success (res) {
                that.setData({
                    auth: res.data || ''
                });
            },
            fail (error) {
                that.setData({
                    userInfo: {},
                    isLogin: false
                });
            }
        });
    },
    formatDate: function(time){
        var date =  new Date(time);
        var y = 1900+date.getYear();
        var m = "0"+(date.getMonth()+1);
        var d = "0"+date.getDate();
        return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
    },
    goUserInfo(e){
        wx.navigateTo({
            url: '../../pages/userInfo/userInfo?type=' + e.currentTarget.dataset.type + '&isInVipTime=' + this.data.isInVipTime
        })
    },
    setNavigationBarTitleText:function(){
        wx.setNavigationBarTitle({
            title: '我'
        })
    },
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh();
    },
    onShow: function(){
        // wx.clearStorage();
        this.getUserInfo();
    },
    onLoad: function(){
        // this.getUserInfo();
    },
    onReady: function() {
        this.setNavigationBarTitleText();
    }
})