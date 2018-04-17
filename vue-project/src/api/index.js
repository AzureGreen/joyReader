const baseUrl = 'http://localhost:8080/';  // server address

export function post (url, params) {
    return new Promise((resolve, reject) => {
        fetch(baseUrl + url, {
            method: 'post',
            headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: params
        }).then(response => {
            return response.json();
        }).then(data => {
            resolve(data);
        }).catch(err => {
            console.log('parsing failed', err);
            reject(err);
        });
    });
}

export function get (url) {
    return new Promise((resolve, reject) => {
        fetch(baseUrl + url)
        .then(response => {
            return response.json();
        }).then(data => {
            resolve(data);
        }).catch(err => {
            console.log('parsing failed', err);
            reject(err);
        });
    });
}

export default {

    /**
     * user account 相关
     */
    login (userAccount) {
        return post('/assist/login.php', 'phoneno=' + userAccount.userId + '&passwd=' + userAccount.passwd);
    },
    register (userAccount) {
        return post('/assist/register.php', 'phoneno=' + userAccount.userId + '&passwd=' + userAccount.passwd);
    },
    forget (userAccount) {
        return post('/assist/forget.php', 'phoneno=' + userAccount.userId + '&passwd=' + userAccount.passwd);
    },
    checkRegistered (userId) {
        return get('/assist/register.php?phoneno=' + userId);
    },
    getUserInfo (userId) {
        return get('/assist/userInfo.php?phoneno=' + userId);
    },
    getFriendList (userId) {
        return get('/assist/friendlist.php?phoneno=' + userId);
    },
    searchPeople (ids) {
        return get('/assist/searchpeople.php?selfId=' + ids.selfId + '&userId=' + ids.userId)
    },
    addFriend (ids) {
        return get('/assist/addfriend.php?selfId=' + ids.selfId + '&userId=' + ids.userId);
    },
    getFriendRequest (userId) {
        return get('/assist/friendrequest.php?userId=' + userId);
    },
    agreeFriendRequest (ids) {
        return get('/assist/agreefriend.php?requestId=' + ids.requestId + '&requestedId=' + ids.requestedId);
    },
    updateHeadPic (infos) {
        return post('/assist/updateheadpic.php', 'userId=' + infos.userId + '&headPic=' + infos.headPic);
    },
    updateNickName (infos) {
        return get('/assist/updatenickname.php?userId=' + infos.userId + '&nickName=' + infos.nickName);
    },
    submitComments (infos) {
        return get('/assist/commitComment.php?userId=' + infos.userId + '&comment=' + infos.comment);
    },
    /**
     * bookroom 相关
     */
    getBooks (userId) {
        return get('/assist/booklist.php?phoneno=' + userId);
    },
    addBook (bookInfo) {
        return post('/assist/addbook.php', 'userId=' + bookInfo.userId + '&bookIndex=' + bookInfo.bookIndex + '&bookName=' + bookInfo.bookName
            + '&bookAuthor=' + bookInfo.bookAuthor + '&bookPublisher='+ bookInfo.bookPublisher 
            + '&bookIntroduction=' + bookInfo.bookIntroduction + '&bookImg=' + bookInfo.bookImg );
    },
    updateBook (bookInfo) {
        return post('/assist/updatebook.php', 'shareNo=' + bookInfo.shareNo + '&userId=' + bookInfo.userId + '&bookIndex=' + bookInfo.bookIndex + '&bookName=' + bookInfo.bookName
            + '&bookAuthor=' + bookInfo.bookAuthor + '&bookPublisher='+ bookInfo.bookPublisher 
            + '&bookIntroduction=' + bookInfo.bookIntroduction + '&bookImg=' + bookInfo.bookImg );
    },
    /**
     * chat 相关
     */
    getBorrowRequests (userId) {
        return get('/assist/borrowrequest.php?userId=' + userId);
    },

    getChatRecords (ids) {
        return get('/assist/chatrecord.php?selfId=' + ids.selfId + '&userId=' + ids.userId);
    }
}