<template>
    <div class="home">
        <router-view></router-view>
        <tab-bar></tab-bar>
    </div>
</template>

<script>
import TabBar from '../components/tabbar/index.vue'

export default {
    components: { TabBar},
    data () {
        return {

        }
    }
}
</script>
