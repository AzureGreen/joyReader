<template>
    <div class="chat-room">
        <header class="header">
            <div class="back2chat" @click="removeChatRoomUserInfo">
                <back-btn></back-btn>
            </div>
            <header class="room-title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="room-container">
            <div class="wrapper">
                <div class="row" v-for="record in chatRecords">
                    <!-- <normal-dlg :record="record" :key="record.id" v-if="record.type == 1" :class="{ 'dlg-right': Number(record.flag), 'dlg-left': !Number(record.flag) }"></normal-dlg>
                    <borrow-dlg :record="record" :flag="Number(record.flag)" :key="record.id" v-else-if="record.type == 2" :class="{ 'dlg-right': Number(record.flag), 'dlg-left': !Number(record.flag) }"></borrow-dlg> -->
                    <normal-dlg :record="record" v-if="record.type == 1" :class="{ 'dlg-right': Number(record.flag), 'dlg-left': !Number(record.flag) }"></normal-dlg>
                    <borrow-dlg :record="record" 
                                :flag="Number(record.flag)" 
                                :userInfo="{selfId: selfInfo.userId, userId: userInfo.userId}" 
                                v-else-if="record.type == 2" 
                                :class="{ 'dlg-right': Number(record.flag), 'dlg-left': !Number(record.flag) }" 
                                @displayBorrow="displayBorrow">
                    </borrow-dlg>
                </div>
            </div>
        </section>
        <section class="room-input">
            <div class="input-div">
                <input type="text" class="input-box">
            </div>
            <div class="btn-div">
                <button class="send-btn" @click="sendMsg"><span>发送</span></button>
            </div>
        </section>
        <borrow :flag="Number(0)" :updateTimePackage="updateTimePackage" :class="{ hide: !updateTime }" @hideborrow="hideBorrow"></borrow>
    </div>
</template>

<script>
import BackBtn from '../../components/back-btn'
import NormalDlg from '../normal-dlg'
import BorrowDlg from '../borrow-dlg'
import Borrow from '../../book/borrow'

import { mapActions, mapState} from 'vuex'

export default {
    components: { BackBtn, NormalDlg, BorrowDlg, Borrow },
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        userInfo: store => store.chat.userInfo,
        title: store => store.chat.userInfo.name,
        /**@description
         * context: 内容
         * date: 预计归还时间
         * flag: 1->发送（右边） 2->接收（左边）
         * img: 头像
         * type: 1->普通 2->借阅
         */
        chatRecords: store => store.chat.chatRecords,
    }),
    data () {
        return {
            updateTime: false,
            updateTimePackage: null,
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
        this.getData();
    },
    mounted () {
        let container = document.querySelector('.room-container'),
            h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        h -= 2 * 2.8 * 20;
        container.style.height = h + 'px';
    },
    updated () {
        let container = document.querySelector('.room-container');
        container.scrollTop = container.scrollHeight - container.offsetHeight;
    },
    destroyed () {
        // this.removeChatRoomUserInfo();
    },
    watch: {
        $route: this.getData
    },
    methods: {
        ...mapActions(['getChatRecords', 'removeChatRoomUserInfo']),
        getData () {
            let routerParams = this.$route.params;
            this.getChatRecords({
                selfId: this.selfInfo.userId,
                userId: routerParams.id}).then(records => {
                    // 从数据库获得的数据先添加
                    // 后续聊天内容 说一句，前端加一次，后台保存一次
                })
        },
        /**@description
         * 发送文字消息
         */
        sendMsg () {
            let input = document.querySelector('.input-box'),
                context = input.value,
                msg = {
                    sendId: this.selfInfo.userId,
                    recvId: this.userInfo.userId,
                    context: escape(context)
                };
            if (context) {
                console.log(msg);
                this.$socket.emit('textMessage', msg);
            }
            input.value = '';
        },

        /**@description
         * 显示借阅框
         */
        displayBorrow (updateTimePackage) {
            this.updateTime = true;
            updateTimePackage.borrowerId = this.selfInfo.userId;
            updateTimePackage.ownerId = this.userInfo.userId;
            this.updateTimePackage = updateTimePackage;
        },
        /**@description
         * 隐藏借阅框
         */
        hideBorrow () {
            this.updateTime = false;
        },
    },
    
}
</script>
