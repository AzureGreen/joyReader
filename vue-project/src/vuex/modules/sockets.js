import api from '../../api/index'
import * as types from '../types'

const state = {
    connect: false,
    message: null,
    requestMap: JSON.parse(localStorage.getItem('Request')) || {},
    newTextMsg: [],
};

const actions = {

    // sendIdentify (context, message) {
    //     console.log(this);
    //     // console.log(this._vm.$socket);
    //     // context.rootState.useraccount.userAccount.phoneno

    // }

    socket_connect (context, message) {
        console.log('action connect');
        console.log(message);
    },

    socket_disconnect (context, message) {
        console.log('action disconnect');
        console.log(message);
    },

    socket_identify (context, message) {
        console.log('action identify');
        let userId = context.rootState.useraccount.userAccount.userId;
        if (userId) {
            // 认证
            this._vm.$socket.emit('identify', userId);
        }
    },

    socket_identifyFeedback (context, message) {
        console.log('action identifyFeedback');
        context.commit(types.SET_LOGIN_STATUS, message);
    },

    socket_borrowRequst (context, message) {
        console.log('action borrowRequst');

        // 提示有新订单需要处理

        // 新消息
        // 如果当前打开了对话框，则更新对话列表
        console.log(message);
        if (message.borrowerId == context.rootState.chat.userInfo.userId) {
            context.dispatch('getChatRecords', {
                selfId: message.ownerId,
                userId: message.borrowerId
            }).then(records => {
                console.log(records);
            })
        }
    },
    
    // socket_borrowRequstFeedback (context, message) {
    //     console.log(message);
    //     if (message) {
    //         // 请求成功
    //         console.log('succ');
    //         // this._vm.$emit('borrowRequstSucc');
    //     } else {
    //         // 请求失败
    //         console.log('failed');
    //         // this._vm.$emit('borrowRequstFail');
    //     }
    // },

    socket_updateBackTime (context, message) {
        console.log('action updateBackTime');
        // 新消息
        // 如果当前打开了对话框，则更新
        if (message.borrowerId == context.rootState.chat.userInfo.userId) {
            context.dispatch('getChatRecords', {
                selfId: message.ownerId,
                userId: message.borrowerId
            }).then(records => {
                console.log(records);
            })
        }
    },

    socket_updateBackTimeFeedback (context, message) {
        console.log('action updateBackTimeFeedback');
        // 新消息
        // 如果当前打开了对话框，则更新
        if (message.bFlag) {
            
            if (message.ownerId == context.rootState.chat.userInfo.userId) {
                context.dispatch('getChatRecords', {
                    selfId: message.borrowerId,
                    userId: message.ownerId
                });
            }
        }
    },

    socket_optionOfBorrowRequest (context, message) {
        console.log('action optionOfBorrowRequest');
        // 新消息
        // 如果当前打开了对话框，则更新
        if (message.ownerId == context.rootState.chat.userInfo.userId) {
            context.dispatch('getChatRecords', {
                selfId: message.borrowerId,
                userId: message.ownerId
            }).then(records => {
                console.log(records);
            })
        }
    },

    socket_optionOfBorrowRequestFeedback (context, message) {
        console.log('action optionOfBorrowRequestFeedback');
        // 新消息
        if (message.bFlag) {
            // 如果当前打开了对话框
            // 发送同意/拒绝消息
            let text = message.agree ? '同意你的借阅请求' : '拒绝你的借阅请求';
            let msg = {
                sendId: message.ownerId,
                recvId: message.borrowerId,
                context: escape(text)
            };
            this._vm.$socket.emit('textMessage', msg);
            if (message.borrowerId == context.rootState.chat.userInfo.userId) {
                context.dispatch('getChatRecords', {
                    selfId: message.ownerId,
                    userId: message.borrowerId
                });
            }
        }
    },

    socket_textMessage (context, message) {
        console.log('action textMessage');
        // 新消息
        // 如果当前打开了对话框，则更新
        if (message.sendId == context.rootState.chat.userInfo.userId) {
            context.dispatch('getChatRecords', {
                selfId: message.recvId,
                userId: message.sendId
            }).then(records => {
                console.log(records);
            })
        }
    },

    socket_textMessageFeedback (context, message) {
        console.log('action textMessageFeedback');
        // 新消息
        
        // 如果当前打开了对话框，则更新
        if (message.recvId == context.rootState.chat.userInfo.userId) {
            context.dispatch('getChatRecords', {
                selfId: message.sendId,
                userId: message.recvId
            });
        }
    },

    socket_addFriend (context, message) {
        console.log('action socket_addFriend');

        // 

    },

    socket_agreeAddFeedback (context, message) {
        if (message) {
            // 刷新 contact
            context.dispatch('getFriendList');
        }
    },

    socket_agreeAdd (context, message) {
        console.log('action socket_agreeAdd');

        // 更新
        if (message) {
            // 刷新 contact
            context.dispatch('getFriendList');
        }
    },
}


const mutations = {
    [types.SOCKET_CONNECT] (state) {
        console.log('mutations connect');
        state.connect = true;
    },
    [types.SOCKET_DISCONNECT] (state) {
        console.log('mutations disconnect');
        state.connect = false;
    },
    [types.SOCKET_BORROWREQUST] (state, message) {
        console.log('mutations borrowRequst');
        /* requestPackage 字段解释
         * fromId: 被请求的目标id
         * toId: 发起请求者id
         * bookindex: 图书索引
         * backTime: 预计归还时间
         * requestTime: 服务器响应时间
         */
        state.message = message;
        
        if (!state.requestMap[message.fromId]) {
            state.requestMap[message.fromId] = new Array();
        }

        let requestArray = state.requestMap[message.fromId];

        requestArray[requestArray.length] = message;
        localStorage.setItem('Request', JSON.stringify(state.requestMap));
        console.log(state.requestMap);
    },
    [types.SOCKET_TEXTMESSAGE] (state, message) {
        console.log('mutations textMessage');
        /* requestPackage 字段解释
         * fromId: 被请求的目标id
         * toId: 发起请求者id
         * bookindex: 图书索引
         * backTime: 预计归还时间
         * requestTime: 服务器响应时间
         */
        state.newTextMsg.push(message);
        
    }
}

export default {
    state,
    actions,
    mutations
}