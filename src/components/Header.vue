<template>
<h1><i :class='props.icon'></i> {{props.title}}</h1>
</template>

<script setup lang="ts">
let props = defineProps({
    'title' : String,
    'icon' : String,
})
</script>

