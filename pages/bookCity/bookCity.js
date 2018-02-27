Page({
    data: {
        userInfo: {}
    },
    setNavigationBarTitleText:function(){
        wx.setNavigationBarTitle({
            title: "分类"
        })
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    goBookType(e) {
        wx.navigateTo({
            url: '../../pages/bookType/bookType?category=' + e.currentTarget.dataset.category + '&type=' + e.currentTarget.dataset.type
        })
    },
    onReady: function() {
        this.setNavigationBarTitleText();
    }
})