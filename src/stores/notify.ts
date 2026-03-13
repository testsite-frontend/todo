import { defineStore } from "pinia"

export const useNorifyStore = defineStore("notify",{

    state : () =>({
        message : '',
    }),

    actions:{
        success(msg:string){
            this.message = msg

            setTimeout(() => {
                this.message = ''
            },3000)
        }    
    }
    
})