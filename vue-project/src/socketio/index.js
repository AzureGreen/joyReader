import Vue from 'vue'
import VueSocketio from 'vue-socket.io'

import store from '../vuex/store'

Vue.use(VueSocketio, '//localhost:3000', store);
// Vue.use(VueSocketio, '//node.zhangjiawei.top', store);

const sockets = {
    connect () {
        console.log('socket connect');
    },
    disconnect () {
        console.log('socket disconnect');
    }
}

export default sockets;