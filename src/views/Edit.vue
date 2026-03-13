<template>
    <div class="parent">
        <Header title="編集" icon="fa-solid fa-pen-to-square" />     
        <div class="error">
            <span>{{useStore.error}}</span>
        </div>

        <div class="task_input">
          <label><i class="fa-sharp fa-solid fa-file-lines"></i> タイトル</label>
          <input type="text" v-model="editTitle">
        </div>

        <div class="task_input">
            <label><i class="fa-sharp fa-solid fa-comment-dots"></i> 内容</label>
            <input type="text" v-model="editContent">
        </div>
        
        <div class="task_input">
           <label><i class="fa-solid fa-check"></i> タスク状態</label>
           <div class="flex">
             <label>達成:<input type="radio" :value="useStore.taskState.COMPLETE" v-model="editState"></label>　
             <label>未達成:<input type="radio" :value="useStore.taskState.NOCOMPLETE" v-model="editState"></label>
           </div>
        </div>
       
        <div class="flex">
          <button class="red" @click="onCommit">編集完了</button>
          <router-link to="/" class="blue">home</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue"
import { ref,computed,onMounted,watch } from 'vue'
import {taskStore} from "../stores/task"
import { useRoute,useRouter } from 'vue-router'
import { useNorifyStore } from "../stores/notify"

const useStore = taskStore()
let route = useRoute()
let router = useRouter()
const notify = useNorifyStore()

const editTitle = ref('')
const editContent = ref('')
const editState = ref('')

onMounted(async () =>{ //ブラウザ更新でstateが空になるので再取得
  if(!useStore.taskArrays.length){
    await useStore.fetchTasks()
  }
})

const task = computed(() =>
  useStore.taskArrays.find(t => t.id === Number(route.params.id))
)

watch(task,(val)=>{
  if(val){
    editTitle.value = val.title
    editContent.value = val.content
    editState.value = val.state
  }
},{
  immediate:true //即1度実行、task変化後も実行
})

const onCommit = async (): Promise<void> => {
  if (!task.value) {
    useStore.error = "タスクが見つかりません"
    return
  }

  if (await useStore.taskEdit(
    task.value.id,
    editTitle.value,
    editContent.value,
    editState.value
  )) {
    notify.success("更新しました")
    router.push('/')
  }
}

</script>