<template>
    <section class="register-input">
        <div class="register-input-item">
            <div class="register-number">
              <input type="text" id="number" maxlength="11" placeholder="请输入手机号码" v-model="phoneno" @blur="inputValid" @keyup="phoneno=phoneno.replace(/\D/g, '')">
            </div>
        </div>
        <div class="register-input-item register-identify-item">
            <div class="register-identify">
               <input type="text" id="identify" placeholder="请输入短信验证码" v-model="identify">
            </div>
            <button class="register-identify-button"><span>发送验证码</span></button>
        </div>
        <div class="register-input-item">
            <div class="register-passwd">
                <input type="password" id="passwd" placeholder="请输入密码，6-13位英文字母或数字" v-model="passwd">
            </div>
        </div>
        <button class="register-submit" @click="submit"><span>提交</span></button>
    </section>
</template>

<script>

import { mapActions } from 'vuex'
import * as types from '../../../vuex/types'
export default {
    props: ['pageName'],
    data () {
        return {
            phoneno: '',
            passwd: '',
            identify: '',
            isregister: this.pageName == 'register' ? true : false    // 当前是否是注册界面
        }
    },
    methods: {
        ...mapActions(['register', 'forget', 'checkRegistered', 'setUserAccount']),

        inputValid (event) {
            if (this.isregister) {
                // 判断是否已经被注册过了
                if (this.phoneno.length != 11) {
                    let ele = event.target;
                    ele.value = '';
                    ele.placeholder = '请输入合法电话号码';
                }
                this.checkRegistered({userId: this.phoneno}).then(register => {
                    if (register) {
                        let ele = event.target;
                        ele.value = '';
                        ele.placeholder = '已被注册过';
                    }
                })
            }
        },
        submit () {
            let self = this,
                account = {
                userId: this.phoneno,
                passwd: this.passwd
            };
            if (account.userId && account.passwd) {
                if (this.isregister) {
                    this.register(account).then(success => {
                        if (success) {
                            // 保存在storage里面
                            console.log('注册成功');
                            self.setUserAccount(account);
                            self.$router.push('/login');
                        } else {

                        }
                    })
                } else {
                    this.forget(account).then(success => {
                        if (success) {
                            // 保存在storage里面
                            console.log('修改成功');
                            self.setUserAccount(account);
                            self.$router.push('/login');
                        } else {

                        }
                    })
                }
            }
        }
    }



}
</script>
