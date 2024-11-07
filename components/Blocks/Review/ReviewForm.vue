<template>
  <div>
    <div v-if="!isAuth" class="review-form review-form--empty _section-box">
      <button class="_link" type="button" @click="openLoginDialog">
        Войдите
      </button>
      или
      <button class="_link" type="button" @click="openSignupDialog">
        зарегистрируйтесь</button
      >, чтобы оставить отзыв
    </div>
    <form v-else class="review-form _section-box" @submit.prevent="onSubmit">
      <h3 class="review-form__title">Оставить отзыв о товаре:</h3>
      <div class="review-form__rating-wrapper">
        <div class="review-form__rating-title">Оценка:</div>
        <AFRating
          class="review-form__rating"
          v-model:value="rating"
          interactive
        />
        <Transition name="drop-down">
          <div v-if="ratingError" class="_error">{{ ratingError }}</div>
        </Transition>
      </div>
      <div class="review-form__inputs">
        <InputWrapper
          class="review-form__input"
          :symbols="pros.length"
          label="Достоинства"
          :maxlength="maxSymbols"
        >
          <TextareaField v-model="pros" :maxlength="maxSymbols" />
          <template v-if="prosError" #error>{{ prosError }}</template>
        </InputWrapper>
        <InputWrapper
          class="review-form__input"
          :symbols="cons.length"
          label="Недостатки"
          :maxlength="maxSymbols"
        >
          <TextareaField v-model="cons" :maxlength="maxSymbols" />
          <template v-if="consError" #error>{{ consError }}</template>
        </InputWrapper>
        <InputWrapper
          class="review-form__input"
          :symbols="description.length"
          label="Комментарий"
          :maxlength="maxSymbols"
        >
          <TextareaField v-model="description" :maxlength="maxSymbols" />
          <template v-if="descriptionError" #error>{{
            descriptionError
          }}</template>
        </InputWrapper>
      </div>
      <AFButton type="submit" label="Отправить" />
    </form>
  </div>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextareaField from '~/components/Blocks/FormElements/TextareaField.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import AFRating from '~/components/Blocks/AFRating.vue'

const emit = defineEmits<{
  (e: 'review'): void
}>()

const route = useRoute()

const { $afFetch } = useNuxtApp()

const { isAuth } = storeToRefs(useUserStore())
const { openSignupDialog, openLoginDialog } = useAuthStore()

const productId = computed(() => route.params.product)

const minSymbols = 20
const maxSymbols = 400
const pros = ref('')
const cons = ref('')
const description = ref('')
const rating = ref(0)

const prosError = ref('')
const consError = ref('')
const descriptionError = ref('')
const ratingError = ref('')
const validation = useAllValidation([
  useValidation(pros, prosError, [minLengthValidation(minSymbols)]),
  useValidation(cons, consError, [minLengthValidation(minSymbols)]),
  useValidation(description, descriptionError, [
    minLengthValidation(minSymbols),
  ]),
  useValidation<number>(rating, ratingError, [minNumberValidation(1)]),
])

async function onSubmit() {
  if (!validation.validate()) return

  try {
    await $afFetch(`/product/rating`, {
      method: 'POST',
      body: {
        product_id: productId.value,
        rating_value: rating.value,
        pros: pros.value,
        cons: cons.value,
        description: description.value,
      },
      onResponse({ response }) {
        if (response.ok) {
          emit('review')
        }
      },
      onResponseError({ response }) {
        let errors = response._data.errors
        if (errors) {
          if (errors.description) descriptionError.value = errors.description[0]
          if (errors.pros) prosError.value = errors.pros[0]
          if (errors.cons) consError.value = errors.cons[0]
          if (errors.rating_value) ratingError.value = errors.rating_value[0]
        }
      },
    })
  } catch (err) {}
}
</script>

<style lang="scss" scoped>
.review-form {
  padding: 15px 20px;

  &__title {
    @include fontSize(21);
    font-weight: 700;
    margin-bottom: 1rem;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__input {
    :deep(.input-wrapper__label) {
      @include fontSize(16);
    }
  }

  &__rating-wrapper {
    margin-bottom: 1rem;

    ._error {
      margin-top: 0.25rem;
    }
  }

  &__rating-title {
    font-weight: 500;
  }

  &__rating {
    margin-top: 0.25rem;

    :deep(.rating__icon) {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}
</style>
