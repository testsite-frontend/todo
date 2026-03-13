<template>
    <section class="input_box">
        <Header title="task管理" icon="fa-solid fa-list-check" />
        <div class="error">
            <span>{{useStore.error}}</span>
        </div>
        <div class="task_input">
            <label><i class="fa-sharp fa-solid fa-file-lines"></i> タイトル</label>
            <input type="text" v-model="addTitle">
        </div>
        <div class="task_input">
            <label><i class="fa-sharp fa-solid fa-comment-dots"></i> 内容</label>
            <input type="text" v-model="addContent">
        </div>
            <button class="red center margin-unset" @click="addTask">タスク追加</button>
    </section>
    
    <div>
        <div class="task_input">
           <div class="flex">
             <label><i class="fa-solid fa-sort"></i> ソート機能　</label>
             <label>
                全て:<input type="radio" name="sort" :value="useStore.taskState.ALL" v-model="useStore.filter">
             </label>　
             <label>
                達成:<input type="radio" name="sort" :value="useStore.taskState.COMPLETE" v-model="useStore.filter">
             </label>　
             <label>
                未達成:<input type="radio" name="sort" :value="useStore.taskState.NOCOMPLETE" v-model="useStore.filter">
             </label>
           </div>
        </div>
        <p>{{useStore.taskCount}}件:表示中</p>
        <br>
        <p class="success" v-if="notify.message">
            <span>{{ notify.message }}</span>
        </p>

        <!--disabledでtaskarraysの順序がずれるためソート機能中はドラッグを制御-->
        <draggable
            v-model="useStore.taskArrays"
            item-key="id"
            animation="200"
            :disabled="useStore.filter !== useStore.taskState.ALL"
            @end="updateOrder">
            <template #item="{element}">
                <section class="taskbox fade-in" v-if="useStore.filteredTasks.includes(element)">
                    <h2>{{element.title}}</h2>
                    <p>{{element.content}}</p>
                    <div class="flex">
                        <router-link :to="`/show/${element.id}`" class="red">詳細</router-link>
                        <router-link :to="`/edit/${element.id}`" class="red">編集</router-link>
                        <a href="#" @click.prevent="delite(element.id)" class="blue">削除</a>
                    </div>
                    <span class="check" :class="{
                        complete : element.state == useStore.taskState.COMPLETE,
                        bad : element.state == useStore.taskState.NOCOMPLETE,
                    }"></span>
                </section>
            </template>
        </draggable>
    </div>

    <div class="logoutbox">
        <button class="blue center" @click="logout">ログアウト</button>
    </div>

</template>

<script setup lang="ts">
import Header from "../components/Header.vue"
import { ref,onMounted } from 'vue'
import draggable from "vuedraggable"
import { supabase } from '../supabase'
import {taskStore} from "../stores/task"
import { useAuthStore } from "../stores/auth"
import { useNorifyStore } from "../stores/notify"
import { useRouter } from 'vue-router'

const useStore = taskStore() //TODO処理用
const auth = useAuthStore() //user処理用
const notify = useNorifyStore()//通知用
const router = useRouter()

let addTitle = ref("")
let addContent = ref("")

const addTask = async () :Promise<void> => {
    if(await useStore.taskAdd(addTitle.value,addContent.value)){
        addTitle.value = ""
        addContent.value = ""
    }
}

const delite = (id :number) :void =>{
    useStore.delete(id)
}

const logout = async () :Promise<void> => {
  if (await auth.logout()) {
    notify.success('ログアウトしました')
    router.push('/login')
  }
}

onMounted(() =>{ //全件取得
    useStore.fetchTasks()
    setTimeout(() => {
        console.log(useStore.taskArrays);
    }, 1000);
    
})

const updateOrder = async () => { //ドラッグで並び替え
  await Promise.all(
    useStore.taskArrays.map((task, index) =>
      supabase.from("todos").update({ position: index }).eq("id", task.id)
    )
  )
}

</script>
