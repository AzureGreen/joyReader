<template>
    <div class="head-pic">
        <header class="header">
            <div @click="clearTmpUrl">
                <back-btn></back-btn>
            </div>
            <button class="ok-btn" type="button" @click="changeHeadPic"><span>确定</span></button>
        </header>
        <section class="head-pic-container">
            <div>
                <img :src="localImgUrl" alt="pic" id="image">
            </div>
        </section>
    </div>
</template>

<script>
import Cropper from 'cropperjs'
import BackBtn from '../../components/back-btn/index.vue'
import api from '../../../api'
import { mapActions, mapState} from 'vuex'

const TmpHeadPicUrl = 'TmpHeadPicUrl';

export default {
    components: { BackBtn},
    computed: mapState({
        selfInfo: store => store.useraccount.userAccount,
        // loginStatus: store => store.useraccount.loginStatus,
    }),
    data () {
        return {
            localImgUrl: '',
            cropper: '',
            croppable: false,
        }
    },
    created() {
        this.getParams();
    },
    mounted () {
        // 初始化裁剪框
        var self = this,
            image = document.getElementById('image');
        this.cropper = new Cropper(image, {
            dragMode: 'move',
            autoCropArea: 1,
            aspectRatio: 1,
            viewMode: 1,
            guides: false,
            center: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            ready: function () {
                self.croppable = true;
            }
        });
    },
    watch: {
        $route: this.getParams
    },
    methods: {

        getParams () {
            let routerParams = this.$route.params;
            if (routerParams.url) {
                this.localImgUrl = routerParams.url;
                localStorage.setItem(TmpHeadPicUrl, routerParams.url);
            } else {
                this.localImgUrl = localStorage.getItem(TmpHeadPicUrl);
            }
        },

        getRoundedCanvas (sourceCanvas) {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');

            canvas.width = sourceCanvas.width;
            canvas.height = sourceCanvas.height;

            context.imageSmoothingEnabled = true;
            context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
            context.globalCompositeOperation = 'destination-in';
            context.beginPath();
            context.fill();

            return canvas;
        },
        changeHeadPic () {
            var croppedCanvas,
                roundedCanvas,
                base64Img,
                self = this;

            if (!this.croppable) {
                return;
            }

            // Crop
            croppedCanvas = this.cropper.getCroppedCanvas(); // 裁剪的canvas

            // Round
            roundedCanvas = this.getRoundedCanvas(croppedCanvas);

            // upload
            base64Img = roundedCanvas.toDataURL('image/jpeg');

            api.updateHeadPic({
                userId: this.selfInfo.userId,
                headPic: base64Img
            }).then(data => {
                if (data.success) {
                    self.clearTmpUrl();
                    self.$router.go(-1);
                } else {
                    console.log(data.msg);
                }
            })
        },
        clearTmpUrl () {
            localStorage.removeItem(TmpHeadPicUrl);
        }
    }
}
</script>