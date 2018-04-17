import api from '../../api/index'
import * as types from '../types'

const state = {
    userAccount: JSON.parse(localStorage.getItem('UserAccount')) || {},
    loginStatus: false,
    userInfo: {},
    friendList: [],
    searchResult: null,
    friendRequest: null,
};

const actions = {

    login ({commit, state}, userAccount) {
        console.log('enter login');
        if (userAccount) {
            localStorage.setItem('UserAccount', JSON.stringify(userAccount));
            commit(types.SET_USER_ACCOUNT, userAccount);
        }
        return new Promise((resolve, reject) => {
            if (state.userAccount) {
                api.login(state.userAccount).then(data => {
                    commit(types.SET_LOGIN_STATUS, data.success);
                    resolve(data.success);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
            } else {
                // reject(data.success);
            }
        })
    },

    register ({commit}, userAccount) {
        console.log('enter register');
        return new Promise((resolve, reject) => {
            api.register(userAccount).then(data => {
                resolve(data.success);
            }).catch(err => {
                reject(err);
            });
        })
    },
    forget ({commit}, userAccount) {
        console.log('enter forget');
        return new Promise((resolve, reject) => {
            api.forget(userAccount).then(data => {
                console.log(data);
                resolve(data.success);
            }).catch(err => {
                reject(err);
            });
        })
    },

    checkRegistered ({commit}, account) {
        console.log('enter checkRegistered');
        return new Promise((resolve, reject) => {
            api.checkRegistered(account.userId).then(data => {
                resolve(data.register);
            }).catch(err => {
                reject(err);
            });
        })
    },

    setUserAccount ({commit}, account) {
        console.log('enter setUserAccount');
        localStorage.setItem('UserAccount', JSON.stringify(account));
        commit(types.SET_USER_ACCOUNT, account);
    },
    removeUserAccount ({commit}) {
        console.log('enter removeUserAccount');
        localStorage.removeItem('UserAccount');
        commit(types.SET_USER_ACCOUNT, {});
    },
    getUserInfo ({commit}) {
        
        api.getUserInfo(state.userAccount.userId).then(data => {
            commit(types.SET_USER_INFO, data.userinfo);
        }).catch(err => {
            console.error(err);
        });
    },

    getFriendList ({commit}) {
        
        api.getFriendList(state.userAccount.userId).then(data => {
            commit(types.SET_FRIEND_LIST, data.friends);
        }).catch(err => {
            console.error(err);
        });
    },
    
    searchPeople ({commit}, ids) {
        api.searchPeople(ids).then(data => {
            console.log(data.result);
            commit(types.SET_SEARCH_RESULT, data.result);
        }).catch(err => {
            console.error(err);
        });
    },
    setSearchResult ({commit}, result) {
        commit(types.SET_SEARCH_RESULT, result);
    },
    
    getFriendRequest ({commit}, userId) {
        api.getFriendRequest(userId).then(data => {
            commit(types.SET_FRIEND_REQUEST, data.request);
        }).catch(err => {
            console.error(err);
        });
    },

    agreeFriendRequest ({commit}, ids) {
        api.agreeFriendRequest(ids).then(data => {
            // commit(types.SET_FRIEND_REQUEST, data.request);
        }).catch(err => {
            console.error(err);
        });
    },
}


const mutations = {
    [types.SET_USER_ACCOUNT] (state, account) {
        state.userAccount = account;
    },
    [types.SET_LOGIN_STATUS] (state, status) {
        state.loginStatus = status;
    },
    [types.SET_USER_INFO] (state, userInfo) {
        state.userInfo = userInfo;
    },
    [types.SET_FRIEND_LIST] (state, friendList) {
        state.friendList = friendList;
    },
    [types.SET_SEARCH_RESULT] (state, result) {
        state.searchResult = result;
    },
    [types.SET_FRIEND_REQUEST] (state, request) {
        state.friendRequest = request;
    },
}

export default {
    state,
    actions,
    mutations
}