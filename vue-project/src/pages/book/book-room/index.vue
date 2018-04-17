<template>
    <div class="bookroom">
        <header class="header">
            <div class="back2contact" @click="removeBookRoomUserInfo">
                <back-btn></back-btn>
            </div>
            <header class="title">
                <span>{{ title }}</span>
            </header>
        </header>
        <section class="bookroom-container">
            <section class="books">
                <div class="book-display" v-for="(book, index) in books" @click="selectBook(book)">
                    <span class="name">《{{ book.name }}》</span>
                    <img :src="book.img" alt="" class="book-img" @load="checkWidth(book, index)">
                </div>
                <div class="book-display" v-if="isSelfBookRoom">
                    <div class="add" @click="addBook">
                        <img :src="addSrc" alt="">
                    </div>
                </div>
            </section>
            <section class="select-book" :class="{ hide: !clicked }">
                <div class="info">
                    <span class="name">《{{ selectedbook.name }}》</span>
                    <span class="author">作者：{{ selectedbook.author }}</span>
                    <span class="publisher">出版社：{{ selectedbook.publisher }}</span>
                </div>
                <div class="detail">
                    <router-link :to="{ name: 'BookDetail' }">
                        <span>详情戳这儿</span>
                    </router-link>
                </div>
                <div class="borrow" @click="displayBorrow" v-if="!isSelfBookRoom">
                    <span>{{ selectedbook.canBorrow ? '我要借阅' : '预约借书' }}</span>
                </div>
                <div class="borrow" @click="updateBookInfo" v-else>
                    <span>修改信息</span>
                </div>
            </section>
            <borrow :flag="Number(1)" :class="{ hide: !borrow }" @hideborrow="hideBorrow"></borrow>
        </section>
    </div>
</template>

<script>
import BackBtn from '../../components/back-btn'
import Borrow from '../borrow'
import { mapActions, mapState} from 'vuex'

export default {
    components: { BackBtn, Borrow},
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        loginStatus: store => store.useraccount.loginStatus,
        userInfo: store => store.bookroom.userInfo,
        title: store => store.bookroom.userInfo.name + '的书房',
        books: store => store.bookroom.books,
        selectedbook: store => store.bookroom.selectedbook,
        isSelfBookRoom: store => (store.useraccount.userAccount.userId == store.bookroom.userInfo.userId) ? true : false,
    }),
    data () {
        return {
            clicked: false,
            borrow: false,
            addSrc: '/static/assets/common/add.png',
        }
    },
    created () {
        if (!this.loginStatus) {
            this.$socket.emit('identify', this.selfInfo.userId);
        }
        this.getData();
    },
    watch: {
        $route: this.getData,
    },
    methods: {

        ...mapActions(['getBooks', 'setSelectedBookInfo', 'removeBookRoomUserInfo', 'setChatRoomUserInfo']),

        /**@description
         * 通过路由获得userid，获得usersharebookinfo
         */
        getData () {
            let routerParams = this.$route.params;
            this.getBooks(routerParams.userId);
        },

        /**@description 
         * 根据图书照片宽度与高度对比，添加样式 
         */
        checkWidth (book, index) {
            var image = new Image();
            image.src = book.img;

            if ((image.height > image.width) ? false : true) {
                var index = this.books.indexOf(book);
                document.getElementsByClassName('book-img')[index].classList.add('wider');
            }
        },

        /**@description 
         * 根据用户选择图书，填充selected对象
         */
        selectBook (book) {
            this.clicked = true;
            this.setSelectedBookInfo(book);
        },
        /**@description
         * 显示借阅框
         */
        displayBorrow () {
            this.borrow = true;
        },
        /**@description
         * 隐藏借阅框
         */
        hideBorrow () {
            this.borrow = false;
        },

        borrowRequstSucc () {
            console.log('借阅成功');
            // 设置聊天房间信息
            this.setChatRoomUserInfo({userId: this.userInfo.userId, name: this.userInfo.name});
            this.$router.push('/chat-room/' + this.userInfo.userId);
        },

        /**@description
         * 给自己的书房添加书籍
         */
        addBook () {
            this.$router.push('/add-book/1');
        },
        /**@description
         * 修改自己书房的书籍
         */
        updateBookInfo () {
            this.$router.push('/add-book/2');
        },
    },
    sockets: {
        borrowRequstFeedback (flag) {
            if (flag) {
                // 请求成功
                console.log('succ');
                this.borrowRequstSucc();
            } else {
                // 请求失败
                console.log('failed');

            }
        },
    }
    
}
</script>
