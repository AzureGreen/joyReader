<template>
    <div class="login">
        <header class="title">
            <h2 class="login-title">{{ title }}</h2>
            <img src="./../../assets/logo.png" alt="" class="login-pic">
        </header>
      <section class="login-input">
            <div class="login-input-item">
                <div class="login-fa">
                    <i class="fa fa-user-o" aria-hidden="true"></i>
                </div>
                <div class="login-number">
                    <input type="text" id="number"  maxlength="11" placeholder="输入手机号码" v-model="phoneno" @blur="inputValid" @keyup="phoneno=phoneno.replace(/\D/g, '')">
                </div>
            </div>
            <div class="login-input-item">
                <div class="login-fa">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                </div>
                <div class="login-passwd">
                    <input type="password" id="passwd" placeholder="输入密码" v-model="passwd">
                </div>
            </div>
            <button class="login-submit" @click="submit"><span>登录</span></button>
        </section>
        <div class="forget-register">
            <span class="login-register"><router-link to="/register">现在去注册</router-link></span>
            <span class="login-forget"><router-link to="/forget">忘记密码？</router-link></span>
        </div>
    </div>
</template>

<script>

import { mapActions, mapState} from 'vuex'


export default {
    computed: mapState({
        userInfo: store => store.useraccount.userAccount,
    }),
    data () {
        return {
            title: '欢迎回到您的书房！',
            phoneno: '',
            passwd: '',
        }
    },
    created () {
        // 自动登入
        this.login().then(status => {
            if (status) {
                // 向服务器传递id号，唯一标识用户                
                this.sendIdentify();
                this.$router.push('/home');
            }
        })
    },
    methods: {

        ...mapActions(['login', 'checkRegistered']),

        inputValid () {
            
            this.checkRegistered({userId: this.phoneno}).then(register => {
                if (!register) {
                    console.log('尚未注册');
                }
            })

        },
        submit () {
            this.login({
                userId: this.phoneno,
                passwd: this.passwd
            }).then(status => {
                if (status) {
                    this.sendIdentify();
                    this.$router.push('/home');
                }
            })
        },
        sendIdentify () {
            this.$socket.emit('identify', this.userInfo.userId);
        }
    }
}
</script>

