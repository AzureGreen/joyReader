import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/pages/login/index.vue';
import Register from '@/pages/login/register/index.vue';
import Forget from '@/pages/login/forget/index.vue';
import Home from '@/pages/home/index.vue';
import Chat from '@/pages/chat/index.vue';
import ChatRoom from '@/pages/chat/chat-room/index.vue';
import Contacts from '@/pages/contacts/index.vue';
import Discover from '@/pages/discover/index.vue';
import Me from '@/pages/me/index.vue';
import Settings from '@/pages/me/settings/index.vue';
import ChangeName from '@/pages/me/settings/changeName.vue';
import AboutUs from '@/pages/me/settings/aboutUs.vue';
import HeadPic from '@/pages/me/head-pic/index.vue';
import BookRoom from '@/pages/book/book-room/index.vue';
import BookDetail from '@/pages/book/book-detail/index.vue';
import AddBook from '@/pages/book/add-book/index.vue';
import AddFriend from '@/pages/contacts/add-friend/index.vue';
import NewFriend from '@/pages/contacts/new-friend/index.vue';

Vue.use(Router);

const router = new Router({
    history: true,
    hashbang: false,
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/', redirect: 'login' },
        { path: '/home', component: Home,
            children: [
                {
                    path: 'chat', component: Chat
                },
                {
                    path: 'contact', component: Contacts
                },
                {
                    path: 'discover', component: Discover
                },
                {
                    path: 'me', component: Me
                }
            ]
        },
        { path: '/book-room/:userId', component: BookRoom, name: 'BookRoom', props: true },
        { path: '/book-detail', component: BookDetail, name: 'BookDetail', props: true },
        { path: '/add-book/:type', component: AddBook, name: 'AddBook', props: true },
        { path: '/chat-room/:id', component: ChatRoom, name: 'ChatRoom', props: true },
        { path: '/add-friend/', component: AddFriend, name: 'AddFriend', props: true },
        { path: '/new-friend/', component: NewFriend, name: 'NewFriend', props: true },
        { path: '/head-pic', component: HeadPic, name: 'head-pic', props: true },
        { path: '/settings', component: Settings, name: 'Settings', props: true },
        { path: '/change-name', component: ChangeName, name: 'ChangeName', props: true },
        { path: '/about-us', component: AboutUs, name: 'AboutUs', props: true },
        { path: '/login',	component: Login },
        { path: '/register', component: Register },
        { path: '/forget', component: Forget }
    ]
});

export default router;