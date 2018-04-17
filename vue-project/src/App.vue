<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    name: 'app',
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
    })
}
</script>

<style lang="scss">
    @import './app.scss'
</style>
