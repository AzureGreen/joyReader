import api from '../../api/index'
import * as types from '../types'

const state = {
    inRequests: null,
    outRequests: null,
    userInfo: JSON.parse(localStorage.getItem('ChatRoomUserInfo')) || {},
    chatRecords: null,
};

const actions = {

    /**
     * 与后台服务器通信，获取borrowrequests
     * @param {commit} param0 
     * @param {当前用户自己的id} userId 
     */
    getBorrowRequests ({commit}, userId) {
        console.log('enter getBorrowRequests');

        // 通过服务器，获得书房书籍信息
        api.getBorrowRequests(userId).then(data => {
            commit(types.SET_BORROW_REQUESTS, data.requests)
        }).catch(err => {
            // ...
            console.error(err);
        });
    },


    /**
     * 将chatroomuserinfo信息保存在localstorage里
     * @param {commit} param0 
     * @param {用户信息} userInfo 
     */
    setChatRoomUserInfo ({commit}, userInfo) {
        console.log('enter setChatRoomUserInfo');
        localStorage.setItem('ChatRoomUserInfo', JSON.stringify(userInfo));
        commit(types.SET_CHATROOM_USER_INFO, userInfo);
    },
    
    removeChatRoomUserInfo ({commit}) {
        console.log('enter removeChatRoomUserInfo');
        localStorage.removeItem('ChatRoomUserInfo');
        commit(types.SET_CHATROOM_USER_INFO, {});
    },

    getChatRecords ({commit}, ids) {
        console.log('enter getChatRecords');
        
        // 通过服务器，获得书房书籍信息
        return new Promise((resolve, reject) => {
            api.getChatRecords(ids).then(data => {
                commit(types.SET_CHAT_RECORDS, data.records);
                resolve(data.records);
            }).catch(err => {
                // ...
                console.error(err);
            });
        })
        
    }


}


const mutations = {
    [types.SET_BORROW_REQUESTS] (state, requests) {
        state.inRequests = requests.inRequests || {};
        state.outRequests = requests.outRequests || {};
    },
    [types.SET_CHATROOM_USER_INFO] (state, userInfo) {
        state.userInfo = userInfo;
    },
    [types.SET_CHAT_RECORDS] (state, chatRecords) {
        state.chatRecords = chatRecords;
    },
}

export default {
    state,
    actions,
    mutations
}