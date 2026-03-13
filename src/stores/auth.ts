import { defineStore } from "pinia";
import { supabase } from '../supabase'
import type { AuthState } from "../types/todo"
import type { User } from "../types/todo"

export const useAuthStore = defineStore('authStore',{

    state : () :AuthState =>({
        user : null, //ユーザー情報
        error : '', //バリデーション
     }),

    actions :{

        async register(email:string,password:string) :Promise<boolean>{ //ユーザー登録
            try{
                //通信してチェック前に簡易チェック
                if(!email || !password){
                    this.error = "メールアドレスとパスワードを入力してください"
                    return false
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(email)) {
                    this.error =  "メールアドレスの形式が正しくありません"
                    return false
                }

                if(password.length < 6){ //spabaseデフォルトが6文字以上
                    this.error = "パスワードは6文字以上で入力してください"
                    return false
                }

                
                const { data , error } = await supabase.auth.signUp( //supabaseにauthユーザー登録
                    { email,password }
                )
                
                if (error) {
                    switch (error?.status) {
                        case 422:
                            this.error = "このメールアドレスは既に登録されています"
                            break
                        case 429:
                            this.error = "リクエストが多すぎます。しばらく待ってください"
                            break
                        case 500:
                            this.error = "サーバーエラーです。時間を置いて再度お試しください"
                            break
                        default:
                            this.error = "登録に失敗しました"
                    }
                    return false
                }

                this.user = data.user as User
                return true
            }catch(e){
                this.error = "エラーが発生しましたもう一度登録してください"
                return false
            }

        },

        async login(email:string,password:string) :Promise<boolean>{
            try{
                //通信してチェック前に簡易チェック
                if(!email || !password){
                    this.error = "メールアドレスとパスワードを入力してください"
                    return false
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(email)) {
                    this.error =  "メールアドレスの形式が正しくありません"
                    return false
                }

                if(password.length < 6){ //spabaseデフォルトが6文字以上
                    this.error = "パスワードは6文字以上で入力してください"
                    return false
                }

                const { data , error } = await supabase.auth.signInWithPassword(
                    { email,password }
                )

                if(error){
                    switch(error.status){
                        case 401:
                            this.error = "メールアドレスかパスワードが違います"
                            break
                        case 429:
                            this.error = "リクエストが多すぎます。しばらく待ってください"
                            break
                        case 500:
                            this.error = "サーバーエラーです。時間を置いてから再度お試しください"
                            break
                        default:
                            this.error = "ログインに失敗しました"
                    }
                    return false
                }

                this.user = data.user as User
                this.error = ''
                return true
            }catch(e){
                this.error = "エラーが発生しましたもう一度ログインしてください"
                return false
            }
            
        },
        async logout() :Promise<boolean>{
            try{
                await supabase.auth.signOut()
                this.user = null
                return true //if(auth.logout())を実行するためにtrueを返す
            }catch(e){
                this.error = "エラーが発生しましたもう一度ログアウトをお願いします"
                return false
            }
        },

        async fetchUser() :Promise<void>{ //supabaseからユーザー情報取得
            try{
                const { data } = await supabase.auth.getUser()
                this.user = data.user as User
            }catch(e){
                this.user = null
                this.error = "エラーが発生しましたユーザー取得できませんでした"
                console.error(e)
            }
        }

        

    },

})

