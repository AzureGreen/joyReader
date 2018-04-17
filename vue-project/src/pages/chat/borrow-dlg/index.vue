<template>
    <div class="borrow-dlg">
        <div class="headpic">
            <img :src="record.img" alt="">
        </div>
        <div class="dlg">
            <div class="context">
                <div class="tips">
                    <span class="book">{{ book }}</span>
                    <span class="time">{{ time }}</span>
                </div>
                <div class="options">
                    <!-- <div class="left-option" @click="leftOption"><span>{{ leftOptionTip }}</span></div>
                    <div class="right-option" @click="rightOption"><span>{{ rightOptionTip }}</span></div> -->
                    <button :disabled="context.agree" :class="{ban: ban}" class="left-option" @click="leftOption"><span>{{ leftOptionTip }}</span></button>
                    <button :disabled="context.agree" :class="{ban: ban}" class="right-option" @click="rightOption"><span>{{ rightOptionTip }}</span></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import { mapActions, mapState} from 'vuex'

export default {
    props: ['record', 'flag', 'userInfo'],
    computed: {
        /**@description
         * flag 1 -> right 0 -> left
         */
        context () {
            return JSON.parse(this.record.context);
        },
        book () {
            // return !this.flag ? "向你借阅《" + JSON.parse(this.record.context).bookname + "》" : "发起借阅《" + JSON.parse(this.record.context).bookname + "》";
            return !this.flag ? "向你借阅《" + this.context.bookname + "》" : "发起借阅《" + this.context.bookname + "》";
        },
        time () {
            // return "预计归还日期" + JSON.parse(this.record.context).backtime;
            return "预计归还日期" + this.context.backtime;
        },
        leftOptionTip () {
            return !this.flag ? "婉言拒绝" : "修改归还日期";
        },
        rightOptionTip () {
            return !this.flag ? "好的" : "打赏感谢";
        },
        ban () {
            return this.context.agree == null ? false : true;
        },
        optionARPackage () {   // 这个包只有同意借阅或者拒绝借阅的时候才会用上 所以 ownerid是自己的 borrowid是对方的 (A/R)
            return {
                borrowerId: this.userInfo.userId,
                ownerId: this.userInfo.selfId,
                textNo: this.record.textNo,
                requestNo: this.context.requestno,
                shareNo: this.context.shareno,
            };
        }
    },
    data () {
        return {
        }
    },
    methods: {
        leftOption () {
            if (this.flag) {
                console.log('update time');
                // 修改日期
                // 1.弹出borrow 框框  选择时间
                // 2.服务器 node 发送 包
                // 3.修改 chattext(tNo) borrowrequest(bNo)
                let updateTimePackage = {
                    textNo: this.record.textNo,
                    requestNo: this.context.requestno
                }
                this.$emit('displayBorrow', updateTimePackage);
            } else {
                // 拒绝
                console.log('refuse');
                this.optionARPackage.agree = false;
                this.$socket.emit('optionOfBorrowRequest', this.optionARPackage);
            }
        },
        rightOption () {
            if (this.flag) {
                // 感谢
                // 暂时不做
                console.log('thx');
            } else {
                // 接受
                console.log('accept');
                // 更新 borrowrequest agree 域 
                // 更新 chattext context 的agree 
                this.optionARPackage.agree = true;
                this.$socket.emit('optionOfBorrowRequest', this.optionARPackage);
            }
        },
    }
}
</script>
