<template>
    <div class="normal-dlg">
        <div class="headpic">
            <img :src="record.img" alt="">
        </div>
        <div class="dlg">
            <div class="context">
                <span>{{ record.context }}</span>
            </div>
        </div>
    </div>
</template>

<script>

import { mapActions, mapState} from 'vuex'

export default {
    props: ['record'],
    computed: mapState({
        
    }),
    data () {
        return {
            
        }
    },
    created () {
        // console.log(this.record);
    },
    methods: {
       
    }
}
</script>



