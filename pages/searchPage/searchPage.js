var util = require('../../utils/util.js')

Page({
    data: {
        searchValue: '',
        isFocus: true,
        resultList: []
    },
    doSearch:function(){
        var that = this;
        if(that.data.searchValue){
            var url = '/m/search/' + that.data.searchValue;
            util.http('GET', url , {}, (response) => {
                if (response.errMsg) {
                    util.showModel(response.errMsg);
                } else {
                    that.setData({
                        resultList: response || []
                    })
                }
            })
        }else{
            that.setData({
                resultList: []
            })
        }
    },
    bindKeyInput: function(e) {
        this.setData({
            searchValue: e.detail.value
        })
        this.doSearch();
    },
    setNavigationBarTitleText:function(){
        wx.setNavigationBarTitle({
            title: '搜索'
        })
    },
    goBookDetail(e){
        wx.navigateTo({
            url: '../../pages/bookDetail/bookDetail?id=' + e.currentTarget.dataset.id
        })
    },
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh();
    },
    onReady: function() {
        this.setNavigationBarTitleText();
    }
})