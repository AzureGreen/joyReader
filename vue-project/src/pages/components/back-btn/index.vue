<template>
    <div class="back-btn" @click="back2Former">
        <img :src="btnSrc" alt="返回">
    </div>
</template>

<script>
export default {
    data () {
        return {
            btnSrc: '/static/assets/common/back.png'
        }
    },
    methods: {
        back2Former() {
            this.$router.go(-1);
        }
    }
}
</script>

