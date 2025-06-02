<template>
  <div class="_container">
    <GlobalPreloader v-if="isLoading" />
    <div v-else-if="isVerified" class="verified">
      Вы успешно подтвердили адрес электронной почты
      <div class="verified__buttons">
        <AFButton
          type="nuxt-link"
          :to="{ name: 'ProfilePage' }"
          label="В профиль"
        />
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
import GlobalPreloader from '~/components/Blocks/GlobalPreloader.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import { Auth } from '~/domain/auth/Auth'
import type IUser from '~/domain/user/types/IUser'
import { ServerStatuses } from '~/enums/ServerStatuses'

const router = useRouter()
const route = useRoute()

const { addNotification } = useNotifications()

const user = useSanctumUser<IUser>()
const { $afFetch } = useNuxtApp()

if (!user.value?.confirmations.verify_email) {
  router.push({ name: 'HomePage' })
}

if (!route.query.code) {
  router.push({ name: 'HomePage' })
}

const { refreshIdentity } = useSanctumAuth()

const isVerified = ref(false)
const isLoading = ref(true)

onMounted(() => {
  $afFetch('/profile/verification/confirm', {
    method: 'POST',
    body: {
      entity: 'email',
      code: route.query.code,
    },
    credentials: 'include',
    async onResponse({ response }) {
      if (response.ok) {
        isLoading.value = false
        isVerified.value = true
        await refreshIdentity()
      }
    },
    onResponseError({ response }) {
      isLoading.value = false
      router.replace({ name: 'HomePage' })

      let text = 'Не удалось подтвердить адрес email'
      if (response.status === ServerStatuses.SERVER_ERROR)
        text += ' (ошибка сервера)'
      else text += ' (' + response._data.message + ')'
      addNotification('error', text)
    },
  })
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
