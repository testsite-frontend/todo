<template>
    <div class="parent">
        <Header title="詳細ページ" icon="fa-solid fa-book-open" />
        <table v-if="task">
            <tr><th>タイトル</th><td>{{ task.title }}</td></tr>
            <tr><th>内容</th><td>{{ task.content }}</td></tr>
            <tr><th>状態</th><td>{{ task.state ?? '未設定' }}</td></tr>
            </table>
        <router-link to="/" class="blue">home</router-link>
    </div>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue"
import { computed,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {taskStore} from "../stores/task"
 
const route = useRoute()
const useStore = taskStore()

let task = computed(() =>
    useStore.taskArrays.find( t => t.id === Number(route.params.id))
)

onMounted(async () => { //ブラウザ更新でstateが空になるので再取得
  if (!useStore.taskArrays.length) {
    await useStore.fetchTasks()
  }
})

</script>