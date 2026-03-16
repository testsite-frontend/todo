# Vue3 Supabase TODO App
Vue3 + Pinia + Supabase + TypeScriptで作成したタスク管理アプリです。
ユーザー認証付きのTODO管理と、ドラッグ&ドロップによる並び替え機能を実装しています。

---------

## Demo
https://todo-lemon-psi-58.vercel.app/
※アカウント登録後に利用できます

---------

## Source Code
https://github.com/testsite-frontend/todo

---------

## Features
・ユーザー登録 / ログイン  
・TODO作成 / 編集 / 削除 (CRUD)  
・ドラッグ&ドロップによる並び替え  
・タスク状態管理（達成 / 未達成）  
・タスクフィルター（全て / 達成 / 未達成）  
・ログアウト機能  

---------

## Tech Stack
Frontend
- Vue3
- TypeScript
- Vue Router
- Pinia
- vuedraggable

Backend
- Supabase
- Supabase Auth
- Supabase Database

---------

## Architecture

Vue Components
↓
Pinia Store (task / auth / notify)
↓
Supabase

---------

## Folder Structure

## Folder Structure

```
src
├─ components
│  └─ Header.vue
├─ views
│  ├─ Home.vue
│  ├─ Edit.vue
│  ├─ Show.vue
│  ├─ Login.vue
│  └─ Register.vue
├─ stores
│  ├─ task.ts
│  ├─ auth.ts
│  └─ notify.ts
├─ router
│  └─ index.ts
├─ types
│  └─ todo.ts
├─ supabase.ts
└─ main.ts
```

---------

## Key Implementation

### 1. Router Guard
未ログインユーザーがアクセスできないように制御

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!auth.user) {
        await auth.fetchUser()
    }

    if (!auth.user && to.path !== '/login' && to.path !== '/register') {
        return '/login'
    }
})

### 2. Drag & Drop Sorting
タスクをドラッグで並び替え、  
positionカラムを更新して保存

const updateOrder = async () => {
    await Promise.all(
        useStore.taskArrays.map((task, index) =>
            supabase.from("todos").update({ position: index }).eq("id", task.id)
        )
    )
}

### 3. State Management
Piniaを使ってタスク管理

export const taskStore = defineStore('taskStore',{
    state: () => ({
       taskArrays: []
    })
})


## Database

Supabaseの「todos」テーブル

| Column     | Type      | Description |
|------------|-----------|-------------|
| id         | number    | タスクID |
| user_id    | uuid      | ユーザーID（Supabase AuthのID） |
| title      | text      | タスクタイトル |
| content    | text      | タスク内容 |
| state      | text      | タスク状態（complete / nocomplete） |
| position   | number    | ドラッグ並び替え用の順序 |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

---
