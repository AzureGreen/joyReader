<template>
    <div class="new-friend">
        <header class="header">
            <back-btn></back-btn>
            <header class="title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="container">
            <div class="request-list" v-for="item in requests">
                <div class="item">
                    <div class="img">
                        <img :src="item.img" alt="">
                    </div>
                    <div class="info">
                        <span class="name">{{ item.name }}</span>
                        <!-- <span>验证消息</span> -->
                    </div>
                    <div class="add">
                        <span v-if="Number(item.agree)" class="added">已添加</span>
                        <!-- <button v-else class="add-btn" @click="agreeFriendRequest({requestId: item.userId, requestedId: selfInfo.userId})"> -->
                        <button v-else class="add-btn" @click="agreeFriendRequest({requestId: item.userId, requestedId: selfInfo.userId})">
                            <span>添加</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import BackBtn from '../../components/back-btn'
import { mapActions, mapState } from 'vuex'
export default {
    components: { BackBtn },
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        requests: store => store.useraccount.friendRequest,
    }),
    data () {   
        return {
            title: '新朋友',
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
        this.getFriendRequest(this.selfInfo.userId);
    },
    methods: {

        ...mapActions(['getFriendRequest']),

        agreeFriendRequest (ids) {

            // 通知服务器 修改 friendrequest 插入 friendlist

            this.$socket.emit('agreeAdd', ids);
            this.$router.push('/home/contact');
        }

    },
    watch: {
        searchText () {
            console.log('change');
            // 后台请求 好友列表
            this.searchPeople({
                selfId: this.selfInfo.userId, 
                userId: this.searchText
                });
        }
    }
}
</script>
