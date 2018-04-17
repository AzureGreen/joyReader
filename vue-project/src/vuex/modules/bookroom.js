import api from '../../api/index'
import * as types from '../types'

const state = {
    userInfo: JSON.parse(localStorage.getItem('BookRoomUserInfo')) || {},
    books: [],
    selectedbook: JSON.parse(localStorage.getItem('SelectedBookInfo')) || {},
};

const actions = {

    /**
     * 将bookroomuserinfo信息保存在localstorage里
     * @param {commit} param0 
     * @param {用户信息} userInfo 
     */
    setBookRoomUserInfo ({commit}, userInfo) {
        console.log('enter setBookRoomUserInfo');
        localStorage.setItem('BookRoomUserInfo', JSON.stringify(userInfo));
        commit(types.SET_BOOKROOM_USER_INFO, userInfo);
    },

    /**
     * 从localstorage移除bookroomuserinfo信息
     * @param {对象} param0 
     */
    removeBookRoomUserInfo ({commit}) {
        console.log('enter removeBookRoomUserInfo');
        localStorage.removeItem('BookRoomUserInfo');
        commit(types.SET_BOOKROOM_USER_INFO, {});
    },

    /**
     * 通过userid向服务器请求用户图书
     * @param {commit} param0 
     * @param {userid} userId 
     */
    getBooks ({commit}, userId) {
        console.log('enter getBooks');
        // 通过服务器，获得书房书籍信息
        api.getBooks(userId).then(data => {
            commit(types.SET_BOOK_LIST, data.books)
        }).catch(err => {
            // ...
        });
    },

    /**
     * 保存用户选择书籍对象
     * @param {commit} param0 
     * @param {book对象} book 
     */
    setSelectedBookInfo ({commit}, book) {
        console.log('enter setSelectedBookInfo');
        localStorage.setItem('SelectedBookInfo', JSON.stringify(book));
        commit(types.SET_BOOK_SELECTED, book);
    },
    
    /**
     * 从localstorage移除selectedbookinfo信息
     * @param {对象} param0 
     */
    removeSelectedBookInfo ({commit}) {
        console.log('enter removeSelectedBookInfo');
        localStorage.removeItem('SelectedBookInfo');
        commit(types.SET_BOOK_SELECTED, {});
    },


}

// const getters = {
//     userInfo: state => state.userInfo,
//     books: state => state.books,
// }

const mutations = {
    [types.SET_BOOKROOM_USER_INFO] (state, userInfo) {
        state.userInfo = userInfo;
    },
    [types.SET_BOOK_LIST] (state, books) {
        state.books = books;
    },
    [types.SET_BOOK_SELECTED] (state, book) {
        state.selectedbook = book;
    },
}

export default {
    state,
    actions,
    // getters,
    mutations
}