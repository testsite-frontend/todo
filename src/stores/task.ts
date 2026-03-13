import { defineStore } from "pinia";
import { supabase } from '../supabase'
import { useAuthStore } from './auth'
import type { Todo } from "../types/todo"
import type { TodoState } from "../types/todo"

export const taskStore = defineStore('taskStore',{

    state : () :TodoState =>({
        error : "", //バリデーション
        filter : "all",
        taskState : {
            ALL : 'all',
            COMPLETE: 'complete',
            NOCOMPLETE: 'nocomplete'
        },
        taskArrays : [], //タスク管理用の配列
    }),

    actions :{
        async fetchTasks(): Promise<void> { //supabaseからユーザー情報を元に全件取得
            try{
                const auth = useAuthStore()
                if(!auth.user) return
                
                const { data, error } = await supabase
                .from("todos").select("*").eq("user_id",auth.user.id).order("position",{ascending:true})
                if(error){
                    this.error = "データの取得失敗"
                    return 
                }
                
                this.taskArrays = data as Todo[] //supabaseがanyのような型で帰るのでTodo の配列であると告知                
            }catch(e){
                this.error = "エラーが発生しましたタスク取得できませんでした"
                console.error(e)
            }

        },
        async taskAdd(title:string,content:string) :Promise<boolean> { //タスク追加
            try{
                if(!(title && content)){
                    this.error = "・タイトルと内容を入力してください"
                    return false
                }
                
                const auth = useAuthStore()
                if (!auth.user) {
                    this.error = "ユーザーが存在しません"
                    return false
                }

                const position = this.taskArrays.length

                const { data,error } = await supabase.from("todos").insert([{
                    title,
                    content,
                    state:null,
                    user_id:auth.user.id,
                    position
                }]).select()

                if(error){
                    this.error = "タスクの追加に失敗しました"
                    return false
                }
                
                this.taskArrays.unshift(data[0] as Todo)
                this.error = "" 
                return true // if(useStore.taskAdd(addTitle.value,addContent.value)で中身を空にするためにtrueを返すように
            }catch(e){
                this.error = "エラーが発生しましたタスク追加できませんでした"
                return false
                
            }

        },
        async taskEdit(id:number,edittitle:string,editcontent:string,editState:string) :Promise<boolean>{
            try{
                //タスク編集
                if(!(edittitle && editcontent)){
                    this.error = "・タイトルと内容を入力してください"
                    return false
                }

                const { error } = await supabase.from("todos").update({
                    title:edittitle,
                    content:editcontent,
                    state:editState,
                    updated_at: new Date()
                }).eq("id",id)

                if(error){
                    this.error = "更新に失敗しました"
                    return false
                }

                await this.fetchTasks(); //DBから再取得してstateを更新

                this.error = ""
                return true
            }catch(e){
                this.error = "エラーが発生しましたタスク更新できませんでした"
                return false
            }
            
            

        },
        async delete(id:number) :Promise<boolean>{ //削除機能
            try{
                const { error } = await supabase.from("todos").delete().eq("id",id)
                if(error){
                    this.error = "削除に失敗しました"
                    return false
                }
                this.taskArrays = this.taskArrays.filter(t => t.id !== id)
                return true
            }catch(e){
                this.error = "エラーが発生しましたタスク削除できませんでした"
                return false
                
            }
        },

    },
    
    getters: {
        filteredTasks: (state) => { //ラジオ押下でソート発火
            
            if (state.filter === state.taskState.COMPLETE) {
                return state.taskArrays.filter(t => t.state === state.taskState.COMPLETE)
            }
            if (state.filter === state.taskState.NOCOMPLETE) {
                return state.taskArrays.filter(t => t.state === state.taskState.NOCOMPLETE)
            }
            
            return state.taskArrays
        },
        taskCount : (state) => { //タスク数をカウント
          if(state.filter === state.taskState.COMPLETE){
            return state.taskArrays.filter(t => t.state === state.taskState.COMPLETE).length
          }
          if(state.filter === state.taskState.NOCOMPLETE){
            return state.taskArrays.filter(t => t.state === state.taskState.NOCOMPLETE).length
          }
          return state.taskArrays.length
        }
    }


})


