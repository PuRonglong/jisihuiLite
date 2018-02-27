var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        isShow: false,
        isShowQues: false,
        isActive: 1,
        animationData: {},
        loadMore: '加载更多',
        isLoading: false,
        historyList: [],
        searchVal: ''
    },
    // 获取周榜月榜
    getRankList(flag) {
        var that = this;
        var url = '/m /weekAndMonth';
        util.http('GET',url, {}, (res) => {
            if(res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                if(!flag) {
                    that.setData({
                        weekList: res.week,
                        monthList: res.month
                    })
                }
            }
        })
    },
    goBookDetail(e){
        wx.navigateTo({
            url: '../../pages/bookDetail/bookDetail?id=' + e.currentTarget.dataset.id
        })
    },
    goTitleDetail(e) {
        wx.navigateTo({
            url: '../../pages/titleDetail/titleDetail?id=' + e.target.dataset.id + '&title=' + e.target.dataset.title
        })
    },
    goContentDetail(e) {
        wx.navigateTo({
            url: '../../pages/contentDetail/contentDetail?id=' + e.target.dataset.id + '&title=' + e.target.dataset.title + '&avatar=' + e.target.dataset.avatar + '&content=' + e.target.dataset.content + '&like=' + e.target.dataset.like + '&comment=' + e.target.dataset.comment
        })
    },
    setNavigationBarTitleText:function(){
        wx.setNavigationBarTitle({
            title: "排行榜"
        })
    },
    // 刷新数据
    onPullDownRefresh: function(){
        // if(!this.data.isShow && !this.data.isShowQues) {
        //     wx.showNavigationBarLoading();
        //     switch(+this.data.isActive) {
        //         case 0: this.getFocusList(true); break;
        //         case 1: this.getRecommendList(true); break;
        //         case 2: this.getHotList(true); break;
        //         default: break;
        //     }
        // }
    },
    onReady: function() {
        // this.getUserInfo();
        this.setNavigationBarTitleText();
        // this.getFocusList();
        // this.getRecommendList();
        this.getRankList();
        // this.getHotList();
    }
})