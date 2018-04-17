<template>
    <div class="bookborrow" @click.self="hideBorrow">
        <div class="borrow-dlg">
            <header class="title">
                <span>{{ title }}</span>
            </header>
            <input class="date" type="date" v-model="backTime">
            <button class="submit" @click="submit()">提交</button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState} from 'vuex'

/**@description
 * requestPackage 字段解释 (借书使用)
 * borrowerId: 借书者Id currentUserId
 * ownerId: 书所属者Id bookroom.userInfo.userId
 * bookindex: 图书索引
 * backTime: 预计归还时间
 * requestTime: 服务器响应时间
 * shareNo: sharebooklist 编号
 */

export default {
    props: ['flag', 'updateTimePackage'],  // flag:1->书房借阅书籍 0->修改时间
    computed: mapState({
        requestPackage: store => {
            let requestPackage = {};
            requestPackage.borrowerId = store.useraccount.userAccount.userId;
            requestPackage.ownerId = store.bookroom.userInfo.userId;
            requestPackage.bookIndex = store.bookroom.selectedbook.index;
            requestPackage.shareNo = store.bookroom.selectedbook.no;
            return requestPackage;
        },
    }),
    data () {
        return {
            title: this.flag ? '预计归还时间' : '修改归还时间',
            backTime: null,
        }
    },
    // create () {
    //     if (!this.flag) {
    //         this.updateTimePackage.textNo = this.textNo;
    //         this.updateTimePackage.requestNo = this.requestNo;
    //     }
    // },
    methods: {
        hideBorrow () {            
            console.log('enter hideBorrow');
            this.$emit('hideborrow');
        },
        submit () {
            console.log('enter submit');
            if (this.backTime) {
                if (this.flag) {
                    // 插入借书请求
                    this.requestPackage.backTime = this.backTime;
                    // console.log(this.requestPackage);
                    this.$socket.emit('borrowRequst', this.requestPackage);
                } else {
                    this.updateTimePackage.backTime = this.backTime;
                    console.log(this.updateTimePackage);
                    this.$socket.emit('updateBackTime', this.updateTimePackage);
                }
            }
            this.hideBorrow();
            this.backTime = null;
        },
    },
}
</script>
