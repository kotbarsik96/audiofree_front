import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: import.meta.env.VITE_API_URL,
    onResponseError(data) {
      console.log('error from onResponseError - start');
      console.error(data);
      console.log('error from onResponseError - end');
    },
  });

  return {
    provide: {
      api,
    },
  };
});
