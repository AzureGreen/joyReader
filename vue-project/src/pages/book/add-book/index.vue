<template>
    <div class="add-book">
        <header class="header">
            <back-btn></back-btn>
            <header class="title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="container">
            <div class="input">
                <label for="uploadbookimg">
                    <input type="file" name="uploadbookimg" id="uploadbookimg" accept="image/jpeg,image/gif,image/png" @change="selectBookImg">
                    <img :src="bookImg" alt="点击添加图片">
                </label>
            </div>
            <div class="input">
                <span>索引*</span>
                <input type="text" placeholder="书后面的一维码数值" v-model="index" @blur="checkEmpty">
            </div>
            <div class="input">
                <span>书名*</span>
                <input type="text" placeholder="书名" v-model="bookname" @blur="checkEmpty">
            </div>
            <div class="input">
                <span>作者</span>
                <input type="text" v-model="author">
            </div>
            <div class="input">
                <span>出版社</span>
                <input type="text" v-model="publisher">
            </div>
            <div class="input">
                <span>介绍*</span>
                <textarea placeholder="简单介绍下吧（100字以内哦）" v-model="introduction" @blur="checkEmpty"></textarea>
            </div>
            <div class="submit">
                <button @click="submit">提交</button>
            </div>
        </section>
    </div>
</template>

<script>
import BackBtn from '../../components/back-btn/index.vue'
import compressPic from '../../../utils/compress'
import api from '../../../api'
import { mapActions, mapState} from 'vuex'


export default {
    components: { BackBtn },
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        selectedbook: store => store.bookroom.selectedbook,
    }),
    data () {
        return {
            type: null,
            title: '添加书籍',
            bookImg: '',
            index: '',
            bookname: '',
            author: '',
            publisher: '',
            introduction: '',
            shareNo: null,
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
        this.getData();
        if (this.type == 1) {
            this.title = '添加书籍';
        } else {
            this.title = "更改书籍"
            this.bookImg = this.selectedbook.img;
            this.index = this.selectedbook.index;
            this.bookname = this.selectedbook.name;
            this.author = this.selectedbook.author;
            this.publisher = this.selectedbook.publisher;
            this.introduction = this.selectedbook.introduction;
            this.shareNo = this.selectedbook.no;
        }
    },
    methods: {

        ...mapActions(['getBooks', 'setSelectedBookInfo', 'removeBookRoomUserInfo', ]),

        getData () {
            let routerParams = this.$route.params;
            this.type = routerParams.type;
        },

        selectBookImg (event) {
            let self = this;
            compressPic(event.target.files[0]).then(dataURL => {
                // 上传后台服务器
                self.bookImg = dataURL;
            }) ;
        },

        checkEmpty (e) {
            let ele = e.target;
            if (!ele.value) {
                ele.placeholder = '必须输入';
            }
        },

        addBook () {
            if (!this.bookImg || !this.index || !this.bookname) {
                return;
            }
            let self = this;

            api.addBook({
                userId: this.selfInfo.userId,
                bookIndex: this.index,
                bookName: this.bookname,
                bookImg: this.bookImg,
                bookAuthor: this.author,
                bookPublisher: this.publisher,
                bookIntroduction: this.introduction
            }).then(data => {
                if (data.success) {
                    self.$router.go(-1);
                } else {
                    console.log(data.msg);
                }
            })
        },
        updateBook () {
            if (!this.bookImg || !this.index || !this.bookname) {
                return;
            }
            let self = this,
                bookInfo = {
                    shareNo: this.shareNo,
                    userId: this.selfInfo.userId,
                    bookIndex: this.index,
                    bookName: this.bookname,
                    // bookImg: this.bookImg,
                    bookAuthor: this.author,
                    bookPublisher: this.publisher,
                    bookIntroduction: this.introduction
                };

            // 主要判断一下图片url是否变化，变化则更新，否则不重新保存图片
            if (this.bookImg !== this.selectedbook.img) {
                // 更新了
                bookInfo.bookImg = this.bookImg;
            }
            console.log(bookInfo);
            api.updateBook(bookInfo).then(data => {
                if (data.success) {
                    self.$router.go(-1);
                } else {
                    console.log(data.msg);
                }
            })
        },
        submit () {
            if (this.type == 1) {
                // 添加书籍
                this.addBook();
            } else {
                // 修改书籍
                this.updateBook();
            }
        }
    },
    
}
</script>
