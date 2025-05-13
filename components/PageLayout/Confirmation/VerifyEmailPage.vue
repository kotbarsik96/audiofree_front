<template>
  <div v-show="isVerified" class="_container">
    <div class="verified">
      Вы успешно подтвердили адрес электронной почты
      <div class="verified__buttons">
        <AFButton type="nuxt-link" :to="{ name: 'ProfilePage' }" label="В профиль" />
        <AFButton
          type="nuxt-link"
          styleType="secondary"
          to="/"
          label="На главную"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'

const router = useRouter()
const route = useRoute()

const { user } = storeToRefs(useUserStore())
const { $afFetch } = useNuxtApp()

if (!user.value?.confirmations.verify_email) {
  router.push({ name: 'HomePage' })
}

if (!route.query.code) {
  router.push({ name: 'HomePage' })
}

const isVerified = ref(false)
await $afFetch('/profile/verify-email', {
  method: 'POST',
  body: {
    code: route.query.code,
  },
  onResponse({ response }) {
    if (response.ok) {
      isVerified.value = true
    }
  },
})
</script>

<style lang="scss" scoped>
.verified {
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  color: var(--primary);
  font: var(--text-20);
  font-weight: 700;

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }
}
</style>
