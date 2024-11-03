<template>
  <div class="review-form review-form--empty">
    <button class="_link" type="button">Зарегистрируйтесь</button> 
    или
    <button class="_link" type="button">войдите</button>,
    чтобы оставить отзыв
  </div>
  <form v-if="!!user" class="review-form" @submit.prevent="onSubmit"></form>
</template>

<script setup lang="ts">
const { user } = storeToRefs(useUserStore())

function onSubmit(){}
</script>

<style lang="scss" scoped>
  
</style>