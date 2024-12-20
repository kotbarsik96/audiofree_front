<template>
  <div class="error">
    <NuxtLayout>
      <LayoutWrapper>
        <div v-show="error" class="error__container _container">
          <div class="error__code">{{ error?.statusCode }}</div>
          <div class="error__text">
            <p v-if="error?.statusCode === ServerStatuses.SERVER_ERROR">Что-то пошло не так</p>
            <p v-else-if="error?.statusCode === ServerStatuses.NOT_FOUND">Страница не найдена</p>
            <p>Вы можете перейти на главную страницу</p>
            <AFButton
              class="error__link"
              label="На главную"
              to="/"
              type="nuxt-link"
            />
          </div>
        </div>
      </LayoutWrapper>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import AFButton from '~/components/Blocks/AFButton.vue'
import { ServerStatuses } from '~/enums/ServerStatuses';

const props = defineProps<{
  error: NuxtError
}>()
</script>

<style lang="scss" scoped>
.error {
  &__container {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  &__code {
    font-weight: 800;
    color: var(--primary);
    @include fontSize(70);
  }

  &__text {
    @include fontSize(21);
    font-weight: 500;
    color: var(--text-color);
  }

  &__link {
    margin-top: 2rem;
  }
}
</style>
