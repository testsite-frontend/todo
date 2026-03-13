<template>
    <section class="input_box">
            <Header title="アカウント新規登録" icon="fa-solid fa-list-check" />
            <div class="error" v-if="auth.error">
                <span>{{auth.error}}</span>
            </div>
            <div class="task_input">
                <label><i class="fa-sharp fa-solid fa-file-lines"></i> メールアドレス</label>
                <input type="email" v-model="email">
            </div>
            <div class="task_input">
                <label><i class="fa-sharp fa-solid fa-file-lines"></i> パスワード</label>
                <input type="password" v-model="password">
            </div>
            <button class="red center" @click="register">アカウント登録</button>
            <router-link to="/login" class="blue">ログインページへ</router-link>
    </section>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue"
import { ref } from 'vue'
import { useAuthStore } from "../stores/auth"
import { useRouter } from 'vue-router'
import { useNorifyStore } from "../stores/notify"

const auth = useAuthStore()
const notify = useNorifyStore()
const router = useRouter()


let email = ref('')
let password = ref('')

const register =  async () :Promise<void> =>{
    const  success = await auth.register(email.value,password.value)
    if(success){
        notify.success("ユーザー登録が完了しました")
        router.push('/login')
    }
}

</script>