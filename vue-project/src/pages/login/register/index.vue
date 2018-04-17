<template>
    <div class="register">
        <header class="title">
            <h2 class="register-title">{{ title }}</h2>
        </header>
        <RegInputs :pageName="pageName"></RegInputs>
    </div>
</template>

<script>

import RegInputs from '../components/reg-inputs.vue'

export default {
    components: { RegInputs},

    data () {
        return {
            title: '新用户注册',
            pageName: 'register',
        }
    },
    methods: {

    }
}
</script>

