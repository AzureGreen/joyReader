<template>
    <div class="chat-list">
        <header class="header">
            <div class="chat-tab out" :class="{clicked: part}" @click="switchChatTab_Out">
                <span>借出</span>
            </div>
            <div class="chat-tab in" :class="{clicked: !part}" @click="switchChatTab_In">
                <span>借入</span>
            </div>
        </header>
        <section class="chat-container">
            <section class="search">
                <div class="search-input"><span>搜索</span></div>
            </section>
            <section class="out-list" :class="{clicked: part}">
                <div class="item" v-for="item in outRequests" @click="setChatRoomUserInfo({userId: item.id, name: item.name})">
                    <router-link :to="{ name: 'ChatRoom', params: {id: item.id} }">
                        <img :src="item.img" alt="">
                        <span class="name">{{ item.name }}</span>
                        <span class="book">向你借阅《{{ item.book }}》</span>
                        <span class="date">预计归还日期{{ item.date }}</span>
                    </router-link>
                </div>
            </section>
            <section class="in-list" :class="{clicked: !part}">
                <div class="item" v-for="item in inRequests" @click="setChatRoomUserInfo({userId: item.id, name: item.name})">
                    <router-link :to="{ name: 'ChatRoom', params: {id: item.id} }">
                        <img :src="item.img" alt="">
                        <span class="name">{{ item.name }}</span>
                        <span class="book">借给你一本《{{ item.book }}》</span>
                        <span class="date">预计归还日期{{ item.date }}</span>
                    </router-link>
                </div>
            </section>
        </section>
    </div>
</template>

<script>
import { mapActions, mapState} from 'vuex'

export default {
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        inRequests: store => store.chat.inRequests,
        outRequests: store => store.chat.outRequests,
    }),
    data () {
        return {
            title: '全部书友',
            part: true,    // 指示当前页面是借出还是借入 true out  false in
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }

        // 通过request拿到目标书籍的 img 
        this.getBorrowRequests(this.selfInfo.userId);
    },
    methods: {
        ...mapActions(['getBorrowRequests', 'setChatRoomUserInfo']),
        
        switchChatTab_Out () {
            if (!this.part) {
                this.part = !this.part;
            }
        },
        switchChatTab_In () {
            if (this.part) {
                this.part = !this.part;
            }
        },
    }
}
</script>
