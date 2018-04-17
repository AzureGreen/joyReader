<template>
    <div class="tabbar">
        <div class="tab">
            <div class="tab-item" v-for="(tabBar, index) in tabBars" @click="changeTab(index)">
                <router-link :to="tabBar.routerLink">
                    <div class="tab-icon"><img :src="tabBar.pic" alt=""></div>
					<span class="tab-text" :class="{clicked: tabBar.clicked}">{{ tabBar.tabText }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Storage from '../../../utils/storage.js'

const StorageKey = 'TABBAR';

export default {
    data () {
        return {
            tabBars: [
                {
                    routerLink: '/home/chat',
                    tabText: '最近书友',
                    pic: '/static/assets/tabbar/chat.png',
                    clicked: false
                },
                {
                    routerLink: '/home/contact',
                    tabText: '书友列表',
                    pic: '/static/assets/tabbar/contact.png',
                    clicked: false
                },
                // {
                //     routerLink: '/home/discover',
                //     tabText: '发现',
                //     pic: /*this.tabBars[2].clicked ? '/static/assets/tabbar/discover.click.png' :*/ '/static/assets/tabbar/discover.png',
                //     clicked: false
                // },
                {
                    routerLink: '/home/me',
                    tabText: '个人中心',
                    pic: '/static/assets/tabbar/center.png',
                    clicked: false
                }
            ],
            pic: [
                '/static/assets/tabbar/chat.png',
                '/static/assets/tabbar/contact.png',
                // '/static/assets/tabbar/discover.png',
                '/static/assets/tabbar/center.png'
            ],
            clickPic: [
                '/static/assets/tabbar/chat.click.png',
                '/static/assets/tabbar/contact.click.png',
                // '/static/assets/tabbar/discover.click.png',
                '/static/assets/tabbar/center.click.png'
            ],
            currentIndex: Storage.fetch(StorageKey) ? Storage.fetch(StorageKey) : 2
        }
    },
    created () {
        this.tabBars[this.currentIndex].clicked = true;
        this.tabBars[this.currentIndex].pic = this.clickPic[this.currentIndex];
        this.$router.push(this.tabBars[this.currentIndex].routerLink);
    },
    methods: {
        changeTab (index) {

            if (index === this.currentIndex) {

            } else {
                this.tabBars[this.currentIndex].clicked = false;
                this.tabBars[this.currentIndex].pic = this.pic[this.currentIndex];
                this.currentIndex = index;
                this.tabBars[this.currentIndex].clicked = true;
                this.tabBars[this.currentIndex].pic = this.clickPic[this.currentIndex];
            }

            Storage.save(StorageKey, this.currentIndex);
        }
    }
}
</script>

