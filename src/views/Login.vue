<template>
    <section class="input_box">
            <Header title="ログインページ" icon="fa-solid fa-list-check" />
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
            <button class="red center" @click="login">ログイン</button>

            <router-link to="/register" class="blue">アカウント登録</router-link>

            <p class="success" v-if="notify.message">
            <span>{{ notify.message }}</span>
        </p>

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
let router = useRouter()

let email = ref('')
let password = ref('')

const login =  async () :Promise<void> =>{
    const success = await auth.login(email.value,password.value)
    if(success){
        notify.success("ログインしました")
        router.push('/')
    }
}


</script>