export interface Todo { //DB用
  id: number,
  user_id: string, 
  title: string,
  content: string,
  state: string, 
  created_at: string
}
//「user_id」がSupabaseの auth.users.idが「b3f1c4f2-7c3e-4c0e-bb2a-8d7c7e9c6e6f」のようなstringが返り値

export interface TodoState{
  error : string,
  filter : string,
  taskState : {
    ALL : string,
    COMPLETE : string,
    NOCOMPLETE : string
  },
  taskArrays :Todo[]
}


export interface User { //supabaseauthユーザー
  id: string
  email: string
}

export interface AuthState {
  user: User | null
  error: string
}


//TailwindでUIをよくする
//ドラッグ機能（普通にTODOを作っても面白くないと感じたので実装）