<template>
    <div class="settings">
        <header class="header">
            <back-btn></back-btn>
            <header class="title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="container">
            <div class="item">
                <label for="headpic">
                    <input type="file" name="headpic" id="headpic" accept="image/jpeg,image/gif,image/png" @change="changeHeadPic">
                    <span class="tag">头像</span>
                    <div class="img">
                        <img :src="userInfo.img" alt="">
                    </div>
                </label>
            </div>
            <div class="item" @click="changeNickName">
                <span class="tag">昵称</span>
                <span class="text">{{ userInfo.name }}</span>
            </div>
            <div class="item">
                <span class="tag">ID</span>
                <span class="text">{{ selfInfo.userId }}</span>
            </div>
        </section>
    </div>
</template>

<script>
import BackBtn from '../../components/back-btn'
import compressPic from '../../../utils/compress'
import { mapActions, mapState} from 'vuex'

export default {
    components: { BackBtn },
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        userInfo: store => store.useraccount.userInfo,
    }),
    data () {
        return {
            title: '基本信息',
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
        // 获取个人信息
        this.getUserInfo();
    },
    methods: {
        ...mapActions(['getUserInfo']),
       
        changeHeadPic (event) {
            compressPic(event.target.files[0]).then(dataURL => {
                // 上传后台服务器
                this.$router.push({ name: 'head-pic', params: { url: dataURL }});
            }) ;
        },

        changeNickName () {
            this.$router.push('/change-name')
        },
    },
}
</script>
