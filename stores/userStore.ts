import { useNotifications } from '@/composables/useNotifications';
import type IUser from '~/domain/user/types/IUser';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { User } from '~/domain/user/User';

export const useUserStore = defineStore('user', () => {
  const userService = new User();
  const { addNotification } = useNotifications();

  const token = ref<string>("");
  const user = ref<IUser>();
  const isLoading = ref(false);
  const isAuth = computed(() => !!user.value);

  // watch(token, () => {
  //   lStorageSetItem(LStorageKeys.JWT, token.value)
  //   userService.setTokenHeader()
  //   getUser()
  // })

  async function getUser() {
    isLoading.value = true;

    const { user, error, status } = await userService.getUser();
    // console.log(user.value);
    // console.log(status.value);
    // console.error(error.value);

    isLoading.value = false;
  }
  // async function logout() {
  //   isLoading.value = true

  //   const response = await userService.logout()
  //   token.value = ""
  //   user.value = undefined
  //   if (response?.payload?.message)
  //     addNotification("info", response.payload.message)

  //   isLoading.value = false
  // }

  return {
    token,
    user,
    getUser,
    isAuth,
    // isLoading,
    // getUser,
    // logout,
  };
});
