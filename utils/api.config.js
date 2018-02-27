var base = 'https://www.easy-mock.com/mock/5a39d3d2717d4953ed48bd47/weChatApp/';
var url = 'https://www.easy-mock.com/mock/5a6a944f396ee930b9c4b8bc/jisihui';
var officalUrl = 'https://jisihui.com';
var api = {
    officalUrl: 'https://jisihui.com',
    indexListApi: {
        development: officalUrl + '/app/getIndexInfo'
    },
    weekAndMonth: {
        development: officalUrl + '/m /weekAndMonth'
    },
    bookDetailApi: {
        development: officalUrl + '/book'
    },
    bookCategoryApi: {
        development: url + '/m/good/c/1/1'
    },
    bookListApi: {
        development: url + '/bookList/bookList'
    },
}

module.exports = api;