<template>
    <div class="change-name">
        <header class="header">
            <back-btn></back-btn>
            <header class="title">
                <span>{{ title }}</span>
            </header>
            <button class="ok-btn" type="button" @click="changeNickName">
                <span>确定</span>
            </button>
        </header>
        <section class="container">
            <div class="input">
                <input type="text" v-model="changedName">
            </div>
        </section>
    </div>
</template>

<script>
import BackBtn from '../../components/back-btn'
import api from '../../../api'
import { mapActions, mapState} from 'vuex'

export default {
    components: { BackBtn },
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
    }),
    data () {
        return {
            title: '修改昵称',
            changedName: '',
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
    },
    methods: {
        ...mapActions([]),
       
        changeNickName () {
            let self = this;
            if (this.changedName) {
                api.updateNickName({
                    userId: this.selfInfo.userId,
                    nickName: this.changedName
                }).then(data => {
                    if (data.success) { 
                        self.$router.go(-1);
                    }
                })
            }
        }
    },
}
</script>
