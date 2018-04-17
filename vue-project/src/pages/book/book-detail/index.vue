<template>
    <div class="bookdetail">
        <header class="header">
            <div class="back2bookroom" @click="removeSelectedBookInfo">
                <back-btn></back-btn>
            </div>
            <header class="title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="bookdetail-container">
            <section class="wrapper">
                <div class="img">
                    <img :src="book.img" alt="">
                </div>
                <div class="detail-info">
                    <span class="author">作者：{{ book.author }}</span>
                    <span class="publisher">出版社：{{ book.publisher }}</span>
                    <span class="price">价格：{{ book.price }}</span>
                </div>
                <div class="introduction">
                    <span>图书简介</span>
                    <p>{{ book.introduction }}</p>
                </div>
            </section>
            <section class="select-book">
                <div class="info">
                    <span class="name">《{{ book.name }}》</span>
                    <span class="author">作者：{{ book.author }}</span>
                    <span class="publisher">出版社：{{ book.publisher }}</span>
                </div>
                <div class="detail"><span>详情戳这儿</span></div>
                <div class="borrow" @click="displayBorrow" v-if="!isSelfBookRoom">
                    <span>{{ book.canBorrow ? '我要借阅' : '预约借书' }}</span>
                </div>
                <div class="borrow" @click="updateBookInfo" v-else>
                    <span>修改信息</span>
                </div>
            </section>
            <borrow :flag="Number(1)" :class="{ hide: !borrow }" @hideborrow="hideBorrow"></borrow>
        </section>
    </div>
</template>

<script>
import BackBtn from '../../components/back-btn/index.vue'
import Borrow from '../borrow/index.vue'
import { mapActions, mapState} from 'vuex'

export default {
    components: { BackBtn, Borrow},
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        userInfo: store => store.bookroom.userInfo,
        title: store => '《' + store.bookroom.selectedbook.name + '》',
        book: store => store.bookroom.selectedbook,
        isSelfBookRoom: store => (store.useraccount.userAccount.userId == store.bookroom.userInfo.userId) ? true : false,
    }),
    data () {
        return {
            borrow: false,
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
    },
    methods: {

        ...mapActions(['removeSelectedBookInfo', 'setChatRoomUserInfo']),

        /**@description
         * 显示借阅框
         */
        displayBorrow () {
            this.borrow = true;
        },
        /**@description
         * 隐藏借阅框
         */
        hideBorrow () {
            this.borrow = false;
        },

        borrowRequstSucc () {
            console.log('借阅成功');
            // 设置聊天房间信息
            this.setChatRoomUserInfo({userId: this.userInfo.userId, name: this.userInfo.name});
            this.$router.push('/chat-room/' + this.userInfo.userId);
        },

        updateBookInfo () {
            this.$router.push('/add-book/2');
        },        
    },
    sockets: {
        borrowRequstFeedback (flag) {
            if (flag) {
                // 请求成功
                console.log('succ');
                this.borrowRequstSucc();
            } else {
                // 请求失败
                console.log('failed');

            }
        },
    }
}
</script>
