<template>
    <div class="parent">
        <section class="input_box">            
            <Header title="404 Not Found" icon="fa-solid fa-book-open" />
            <p>このページは存在しません</p>
        </section>
        <router-link to="/" class="blue">home</router-link>
    </div>
    
</template>

<script setup lang="ts">
import Header from "../components/Header.vue"

</script>