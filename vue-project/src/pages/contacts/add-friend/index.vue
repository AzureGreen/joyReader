<template>
    <div class="add-friend">
        <header class="header">
            <back-btn></back-btn>
            <header class="title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="container">
            <section class="search">
                <div class="search-fa">
                    <i class="fa fa-search" aria-hidden="true"></i>
                </div>
                <div class="search-input">
                    <input type="text" placeholder="搜索" v-model="searchText" maxlength="11" @keyup="searchText=searchText.replace(/\D/g, '')">
                </div>
            </section>
            <section class="search-result">
                <div class="not-found" v-if="result == null">
                    <span>未搜索到结果</span>
                </div>
                <div class="found" v-else>
                    <div class="info">
                        <div class="img">
                            <img :src="result.img" alt="">
                        </div>
                        <div class="basic-info">
                            <span class="name">{{ result.name }}</span>
                            <span class="readerId">readerID: {{ result.userId }}</span>
                        </div>
                    </div>
                    <div class="add">
                        <button class="add-btn" @click="dosth">
                            <span v-if="!Number(result.ok)">加为好友</span>
                            <span v-else>发送消息</span>
                        </button>
                    </div>
                </div>
            </section>
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
        result: store => store.useraccount.searchResult,
    }),
    data () {   
        return {
            title: '添加好友',
            searchText: '',
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
    },
    destroyed () {
        this.setSearchResult(null);
    },
    methods: {

        ...mapActions(['searchPeople', 'addFriend', 'setSearchResult']),

        dosth () {
            if (!Number(this.result.ok)) {
                // this.addFriend({
                //     selfId: this.selfInfo.userId, 
                //     userId: this.result.userId
                //     }).then(data => {
                //         console.log(data);
                // });

                // websocket通信，给服务器
                let msg = {
                    requestId: this.selfInfo.userId,
                    requestedId: this.result.userId
                };
                this.$socket.emit('addFriend', msg);
                this.$router.push('/home/contact');
            } else {
                /// 未开发
            }
            
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
