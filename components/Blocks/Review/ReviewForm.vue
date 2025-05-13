<template>
  <div ref="element">
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
          <div v-if="ratingError" class="_error">
            {{ ratingError }}
          </div>
        </Transition>
      </div>
      <div class="review-form__inputs">
        <InputWrapper
          class="review-form__input"
          inputId="review-pros"
          :symbols="pros.length"
          label="Достоинства"
          :maxlength="maxSymbols"
        >
          <TextareaField
            v-model="pros"
            :maxlength="maxSymbols"
            id="review-pros"
          />
          <template v-if="prosError" #error>{{ prosError }}</template>
        </InputWrapper>
        <InputWrapper
          class="review-form__input"
          inputId="review-cons"
          :symbols="cons.length"
          label="Недостатки"
          :maxlength="maxSymbols"
        >
          <TextareaField
            v-model="cons"
            :maxlength="maxSymbols"
            id="review-cons"
          />
          <template v-if="consError" #error>{{ consError }}</template>
        </InputWrapper>
        <InputWrapper
          class="review-form__input"
          inputId="review-description"
          :symbols="description.length"
          label="Комментарий"
          :maxlength="maxSymbols"
        >
          <TextareaField
            v-model="description"
            :maxlength="maxSymbols"
            id="review-description"
          />
          <template v-if="descriptionError" #error>{{
            descriptionError
          }}</template>
        </InputWrapper>
      </div>
      <div class="review-form__buttons">
        <AFButton type="submit" :label="submitLabel" :disabled="isLoading" />
        <AFButton
          v-if="isEditingReview"
          styleType="secondary"
          label="Отменить"
          :disabled="isLoading"
          @click="cancelEdit"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextareaField from '~/components/Blocks/FormElements/TextareaField.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import AFRating from '~/components/Blocks/AFRating.vue'
import { type IReviewInjection } from '~/domain/reviews/types/IReviewInjection'
import { ReviewInjection } from '~/enums/injections'
import {
  useValidationForm,
  useValidationField,
} from '~/domain/validaiton/useValidation'
import { minLengthValidation } from '~/domain/validaiton/validators/minLengthValidation'
import { minNumberValidation } from '~/domain/validaiton/validators/minNumberValidation'

const emit = defineEmits<{
  (e: 'update:isWriting', v: boolean): void
}>()

const element = ref<HTMLElement>()

const { $afFetch } = useNuxtApp()

const { isAuth } = storeToRefs(useUserStore())
const { openSignupDialog, openLoginDialog } = useAuthStore()

const {
  currentUserReview,
  productSlug,
  isEditingReview,
  updateAllReviews,
  updateWritingReview,
} = injectStrict<IReviewInjection>(ReviewInjection)

const submitLabel = computed(() =>
  isEditingReview.value ? 'Сохранить' : 'Отправить'
)
const isLoading = ref(false)

const { addNotification } = useNotifications()
const { addConfirm } = useConfirmation()

const minSymbols = 20
const maxSymbols = 400

const form = useValidationForm(
  {
    pros: useValidationField(currentUserReview.value?.pros || '', [
      minLengthValidation(minSymbols),
    ]),
    cons: useValidationField(currentUserReview.value?.cons || '', [
      minLengthValidation(minSymbols),
    ]),
    description: useValidationField(
      currentUserReview.value?.description || '',
      [minLengthValidation(minSymbols)]
    ),
    rating: useValidationField(currentUserReview.value?.value || 0, [
      minNumberValidation(1),
    ]),
  },
  { scrollToWhenFailed: element }
)

const { pros, cons, description, rating } = form.getFieldRefs()

const {
  pros: prosError,
  cons: consError,
  description: descriptionError,
  rating: ratingError,
} = form.getErrorRefs()

async function onSubmit() {
  if (!form.validateAll()) return

  isLoading.value = true

  try {
    await $afFetch(`/product/rating`, {
      method: 'POST',
      body: {
        product_slug: productSlug.value,
        rating_value: rating.value,
        pros: pros.value,
        cons: cons.value,
        description: description.value,
      },
      async onResponse({ response }) {
        if (response.ok) {
          await updateAllReviews()
          updateWritingReview(false)
          addNotification('success', 'Ваш отзыв сохранен')
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

        if (errors.rating_value && element.value) element.value.scrollIntoView()
      },
    })
  } catch (err) {
    console.error(err)
  }

  isLoading.value = false
}
async function cancelEdit() {
  const confirmed = await addConfirm({
    title: 'Вы уверены, что хотите отменить редактирование отзыва?',
    detail: 'Введенные сейчас данные не будут сохранены',
  })

  if (confirmed) updateWritingReview(false)
}
</script>

<style lang="scss" scoped>
.review-form {
  padding: 15px 20px;

  &__title {
    font: var(--text-20);
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
      font: var(--text-16);
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

  &__buttons {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.625rem;
  }
}
</style>
