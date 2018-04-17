import Vue from 'vue'
import Vuex from 'vuex'

import useraccount from './modules/useraccount'
import bookroom from './modules/bookroom'
import sockets from './modules/sockets'
import chat from './modules/chat'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        useraccount,
        bookroom,
        sockets,
        chat,
        
    }
});

export default store;