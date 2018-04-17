<template>
    <div class="me">
        <header class="header">
            <header class="title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="me-container">
            <section class="info-background">
                <img :src="userInfo.img" alt="background" class="background">
                <section class="info">
                    <label for="uploadfile">
                        <input type="file" name="uploadfile" id="uploadfile" accept="image/jpeg,image/gif,image/png" @change="changeHeadPic">
                        <img :src="userInfo.img" alt="pic">
                    </label>
                    <span>{{ userInfo.name }}</span>
                </section>
            </section>
            <section class="items">
                <div class="item" v-for="(item, index) in items" @click="selectItem(index)">
                    <img :src="item.src" :alt="item.alt">
                    <span>{{ item.alt }}</span>
                </div>
            </section>
        </section>
    </div>
</template>

<script>
import compressPic from '../../utils/compress'
import { mapActions, mapState} from 'vuex'

export default {
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        userInfo: store => store.useraccount.userInfo,
    }),
    data () {
        return {
            title: '个人中心',
            items: [
                {
                    src: '/static/assets/me/detail.png',
                    alt: '我的书房'
                },
                // {
                //     src: '/static/assets/me/history.png',
                //     alt: '我的书评'
                // },
                {
                    src: '/static/assets/me/history.png',
                    alt: '基本信息'
                },
                {
                    src: '/static/assets/me/history.png',
                    alt: '关于我们'
                },
                {
                    src: '/static/assets/me/history.png',
                    alt: '退出登入'
                }
            ],
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
        ...mapActions(['getUserInfo', 'setBookRoomUserInfo', 'removeUserAccount', 
        'removeBookRoomUserInfo', 'removeSelectedBookInfo', 'removeChatRoomUserInfo']),
        changeHeadPic (event) {
            compressPic(event.target.files[0]).then(dataURL => {
                // 上传后台服务器
                this.$router.push({ name: 'head-pic', params: { url: dataURL }});
            }) ;
        },
        enterMyLib () {
            this.setBookRoomUserInfo({
                userId: this.selfInfo.userId,
                name: '我'
            })
            this.$router.push('/book-room/' + this.selfInfo.userId);
        },  
        settings () {
            this.$router.push('/settings');
        },
        aboutUs () {
            this.$router.push('/about-us');
        },
        logout () {
            this.removeUserAccount();
            this.removeBookRoomUserInfo();
            this.removeSelectedBookInfo();
            this.removeChatRoomUserInfo();
            localStorage.clear();
            this.$router.push('/');
        },
        selectItem (index) {
            switch (index) {
                case 0:
                    this.enterMyLib();
                    break;
                case 1:
                    this.settings();
                    break;
                case 2:
                    this.aboutUs();
                    break;
                case 3:
                    this.logout();
                    break;
                case 4:
                    this.logout();
                    break;
                default:
                    break;
            }
        }
    },
}
</script>
