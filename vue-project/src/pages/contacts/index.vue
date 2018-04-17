<template>
    <div class="contact">
        <header class="header">
            <header class="title">
                <span @click="selectGroups">{{ title }}</span>
            </header>
            <div class="add-btn">
                <router-link to="/add-friend">
                    <img :src="addSrc" alt="">
                </router-link>
            </div>
        </header>
        <section class="contact-container">
            <section class="search">
                <div class="search-input"><span>搜索</span></div>
            </section>
            <section class="new-friend">
                <router-link to="/new-friend">
                    <span><label for="">></label>新朋友</span>
                </router-link>
            </section>
            <section class="tip">
                <span>点击书友名称进入书友的书房</span>
            </section>
            <section class="contact-list">
                <table>
                    <tr v-for="item in friendList">
                        <td class="tag"><span>{{ item.tag }}</span></td>
                        <td class="content">
                            <ul>
                                <li v-for="per in item.content " @click="setBookRoomUserInfo(per)">
                                    <router-link :to="{ name: 'BookRoom', params: {userId: per.userId} }">
                                        <span>{{ per.name }}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
                <div class="jmp-bar">
                    <span v-for="tag in searchItem">{{ tag }}</span>
                </div>
            </section>
        </section>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        friendList: store => store.useraccount.friendList,
    }),
    data () {
        return {
            title: '全部书友',
            addSrc: '/static/assets/common/add.png',
            searchItem: [],
            // searchItem: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            contactlist: [
                {
                    "tag": "A",
                    content: [
                        {
                            userId: '11111111111',
                            name: "阿冰"
                        },
                        {
                            userId: '22222222222',
                            name: "阿俊"
                        },
                        {
                            userId: '33333333333',
                            name: "阿凯"
                        }
                    ]
                },
                {
                    tag: "B",
                    content: [
                        {
                            userId: '4',
                            name: "白老师"
                        },
                        {
                            userId: '5',
                            name: "白立柯"
                        },
                        {
                            userId: '6',
                            name: "白展堂"
                        },
                        {
                            userId: '7',
                            name: "白教授"
                        },
                        {
                            userId: '8',
                            name: "表哥"
                        },
                        {
                            userId: '9',
                            name: "毕老师"
                        }
                    ]
                },
                {
                    tag: "C",
                    content: [
                        {
                            userId: '10',
                            name: "灿灿"
                        },
                        {
                            userId: '11',
                            name: "蔡老师"
                        },
                        {
                            userId: '12',
                            name: "陈娟"
                        }
                    ]
                }                
            ]
        }
    },
    created() {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
        this.getFriendList();
    },
    methods: {

        ...mapActions(['getFriendList', 'setBookRoomUserInfo']),

        selectGroups () {

        },

    }
}
</script>
