<template>
    <div class="about-us">
        <header class="header">
            <back-btn></back-btn>
            <header class="title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="container">
            <div class="tips">
                <p>{{ tips }}</p>
            </div>
            <label for="comment">
                <span>您可以反馈宝贵的意见给我们：</span>
                <textarea name="comment" id="comment" cols="20" rows="10" v-model="comment"></textarea>
                <button class="ok-btn" @click="submitComment">提交</button>
            </label>
        </section>
    </div>
</template>

<script>
import BackBtn from '../../components/back-btn'
import api from '../../../api'
import { mapActions, mapState} from 'vuex'

export default {
    components: { BackBtn },
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
    }),
    data () {
        return {
            title: '关于我们',
            tips: '该应用主要功能实现熟人之间的图书共享功能，主题简洁明确',
            comment: '',
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
    },
    methods: {
        ...mapActions([]),
       
        submitComment () {
            let self = this;
            if (this.comment) {
                api.submitComments({
                    userId: this.selfInfo.userId,
                    comment: this.comment
                }).then(data => {
                    if (data.success) { 
                        self.$router.go(-1);
                    }
                })
            }
        }
    },
}
</script>
