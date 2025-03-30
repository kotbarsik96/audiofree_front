<template>
  <form class="oform" @submit.prevent="onSubmit">
    <div class="columns">
      <div class="oform-col">
        <h2 class="col-title">Личные данные</h2>
        <div class="inputs">
          <InputWrapper>
            <TextInput placeholder="Имя" v-model="name" />
            <template v-if="nameError" #error>{{ nameError }}</template>
          </InputWrapper>
          <InputWrapper>
            <TextInput placeholder="Email" type="email" v-model="email" />
            <template v-if="emailError" #error>{{ emailError }}</template>
          </InputWrapper>
          <InputWrapper>
            <TextInput placeholder="Telegram" v-model="telegram" />
            <template v-if="telegramError" #error>{{ telegramError }}</template>
          </InputWrapper>
          <InputWrapper>
            <MaskInput
              placeholder="Телефон"
              :mask="phoneMask"
              v-model="phone"
              @unmaskedChange="onPhoneMaskChange"
            />
            <template v-if="phoneError" #error>{{ phoneError }}</template>
          </InputWrapper>
          <InputWrapper>
            <TextareaField
              placeolder="Комментарий к заказу"
              v-model="comment"
            />
            <template v-if="commentError" #error>{{ commentError }}</template>
          </InputWrapper>
        </div>
      </div>
      <div class="oform-col">
        <h2 class="col-title">Доставка</h2>
        <div class="inputs">
          <AFRadio
            v-for="item in availableDeliveryPlaces"
            :key="item"
            :label="deliveryPlacesMap[item]"
            :value="item"
            v-model="deliveryPlace"
            name="delivery_place"
          />
          <InputWrapper>
            <TextareaField v-model="address" />
            <template v-if="addressError" #error>{{ addressError }}</template>
          </InputWrapper>
        </div>
      </div>
      <div class="oform-col">
        <h2 class="col-title">Оплата</h2>
        <div class="oform-body">
          <div class="inputs">
            <AFRadio
              v-for="item in availablePaymentTypes"
              :key="item"
              :label="paymentTypesMap[item]"
              :value="item"
              v-model="paymentType"
              name="payment_type"
            />
          </div>
          <div v-if="summary" class="summary">
            <table>
              <tbody>
                <tr>
                  <td>Сумма заказа:</td>
                  <td>{{ summary.order_cost.toFixed(2) }} ₽</td>
                </tr>
                <tr>
                  <td>Сумма доставки:</td>
                  <td>{{ summary.delivery_cost.toFixed(2) }} ₽</td>
                </tr>
                <tr>
                  <td>Итого:</td>
                  <td>{{ summary.total_cost.toFixed(2) }} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <AFButton
      class="submit-btn --large"
      type="submit"
      label="Оформить заказ"
      :disabled="isLoading"
    />
  </form>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import MaskInput from '~/components/Blocks/FormElements/MaskInput.vue'
import TextareaField from '~/components/Blocks/FormElements/TextareaField.vue'
import phoneMask from '~/domain/mask-input/phoneMask'
import type { ICreationOrderData } from '~/domain/order/interfaces/ICreationOrderData'
import AFRadio from '~/components/Blocks/FormElements/AFRadio.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import {
  deliveryPlacesMap,
  type TDeliveryPlaces,
} from '~/domain/order/types/TDeliveryPlaces'
import {
  paymentTypesMap,
  type TPaymentTypes,
} from '~/domain/order/types/TPaymentTypes'

const emit = defineEmits<{
  (e: 'orderCreated'): void
}>()

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Корзина',
    link: { name: 'CartPage' },
  },
  {
    index: 3,
    label: 'Оформление заказа',
    link: { name: 'NewOrderPage' },
  },
])

const { user } = useUserStore()
const route = useRoute()
const router = useRouter()

const { addNotification } = useNotifications()

const { addConfirm } = useConfirmation()

const savedData = useCookie<Record<string, any>>('creating_order', {
  default: () => ({}),
})

const isOneclick = computed(() => route.query.oneclick === '1')

const { data: creationData } = await useAPI<{ data: ICreationOrderData }>(
  '/order/creation-data',
  {
    params: { is_oneclick: isOneclick },
    onResponseError({ response }) {
      if (response._data.message) {
        addNotification('info', response._data.message)
      }
      router.push({ name: 'CartPage' })
    },
  }
)

const { $afFetch } = useNuxtApp()

const summary = computed(() => creationData.value?.data.summary)

const name = ref(savedData.value.name || user?.name || '')
const email = ref(savedData.value.email || user?.email || '')
const telegram = ref(savedData.value.telegram || user?.telegram || '')
const phone = ref(savedData.value.phone || user?.phone_number || '')
const phoneUnmasked = ref('')
const comment = ref(savedData.value.comment || '')
const address = ref(savedData.value.address || '')

const nameError = ref()
const emailError = ref()
const telegramError = ref()
const phoneError = ref()
const commentError = ref()
const addressError = ref()

const isLoading = ref(false)

const validateAll = useAllValidation([
  useValidation(name, nameError, [mustPresentValidation()]),
  useValidation(email, emailError, [
    mustPresentWithout([telegram, phoneUnmasked]),
    emailValidation(),
  ]),
  useValidation(telegram, telegramError, [
    mustPresentWithout([email, phoneUnmasked]),
  ]),
  useValidation(phone, phoneError, [
    mustPresentWithout([email, telegram], {
      unmaskedValue: phoneUnmasked,
    }),
    phoneNumberValidation(phoneUnmasked),
  ]),
  useValidation(address, addressError, [minLengthValidation(3)]),
])

const availableDeliveryPlaces = computed(
  () => creationData.value?.data.variants.delivery_places ?? []
)
const availablePaymentTypes = computed(
  () => creationData.value?.data.variants.payment_types ?? []
)

const deliveryPlace = ref<TDeliveryPlaces>(
  savedData.value.deliveryPlace || availableDeliveryPlaces.value[0]
)
const paymentType = ref<TPaymentTypes>(
  savedData.value.paymentType || availablePaymentTypes.value[0]
)

const requestBody = computed(() => ({
  orderer_name: name.value,
  email: email.value,
  telegram: telegram.value,
  phone_number: phone.value,
  delivery_place: deliveryPlace.value,
  delivery_address: address.value,
  desired_payment_type: paymentType.value,
  is_oneclick: isOneclick.value,
}))

const { refresh: updateSave } = useDelayedCallback(500, () => {
  savedData.value = {
    name: name.value,
    email: email.value,
    telegram: telegram.value,
    phone: phone.value,
    comment: comment.value,
    address: address.value,
    deliveryPlace: deliveryPlace.value,
    paymentType: paymentType.value,
  }
})

watch(
  () => [
    name.value,
    email.value,
    telegram.value,
    phone.value,
    comment.value,
    address.value,
    deliveryPlace.value,
    paymentType.value,
  ],
  updateSave
)

function onPhoneMaskChange(unmaskedValue: string) {
  phoneUnmasked.value = unmaskedValue
}

async function onSubmit() {
  isLoading.value = true
  if (validateAll.validate()) {
    try {
      await orderAttempt()
    } catch (err) {
      console.error(err)
    }
  }
  isLoading.value = false
}

/** Попытка оформить заказ. Если товара не хватает - выведет диалог */
async function orderAttempt() {
  await $afFetch('/order/new-attempt', {
    method: 'POST',
    body: requestBody.value,
    onResponse({ response }) {
      if (isResponseOk(response.status)) {
        emit('orderCreated')
      }
    },
    async onResponseError({ response }) {
      if (response._data.reason === 'failed_quantity') {
        const yesButtonText = 'Продолжить'
        const noButtonText = 'Отмена'

        const proceed = await addConfirm({
          title: 'Внимание!',
          detail: `${response._data.message}. <br /> <br /> Нажмите "${yesButtonText}", чтобы оформить заказ, тогда недостающие товары будут вычтены.`,
          noButtonText,
          yesButtonText,
        })

        if (proceed) {
          await makeNewOrder()
        }
      } else {
        mapErrorsFromResponse(response, [
          ['name', nameError],
          ['email', emailError],
          ['telegram', telegramError],
          ['phone_number', phoneError],
          ['delivery_address', addressError],
        ])

        addNotification(
          'error',
          response._data.message || 'Не удалось оформить заказ'
        )
      }
    },
  })
}
/** Оформить заказ, удалив нехватающие товары.
 *
 * ! Вызывается только при нажатии "Продолжить в orderAttempt" */
async function makeNewOrder() {
  await $afFetch('/order/new', {
    method: 'POST',
    body: requestBody.value,
    onResponse({ response }) {
      if (isResponseOk(response.status)) {
        emit('orderCreated')
      }
    },
    onResponseError({ response }) {
      addNotification(
        'error',
        response._data.message || 'Не удалось оформить заказ'
      )
    },
  })
}
</script>

<style lang="scss" scoped>
.oform {
  padding: 3rem 0;
}
.columns {
  border-top: 1px solid var(--input-border-color);
  padding: 2rem 0;
  display: flex;
  counter-reset: order-form;
  margin-bottom: 2.25rem;
}
.oform-col {
  padding: 0 3.125rem;
  border-left: 1px solid var(--input-border-color);
  flex: 1 1 33%;
  display: flex;
  flex-direction: column;

  &:first-child {
    padding-left: 0;
    border-left: none;
  }
}
.col-title {
  margin-bottom: 2.75rem;
  counter-increment: order-form;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  @include fontSize(20);

  &::before {
    content: '0' counter(order-form);
    color: var(--primary);
    letter-spacing: 2px;
    @include fontSize(30);
  }
}
.inputs {
  display: flex;
  flex-direction: column;

  .input-wrapper {
    &:not(:last-child) {
      margin-bottom: 1.125rem;
    }
  }

  .radio,
  .checkbox {
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
}
.oform-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
.summary {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid var(--input-border-color);
  flex: 1 1 auto;
  margin-top: 3rem;
  padding-top: 1.25rem;

  table {
    width: 100%;
    font-weight: 600;
    color: var(--text-color);
    @include fontSize(18);

    td:first-child {
      padding-right: 1rem;
    }
    td:last-child {
      text-align: right;
    }
  }
}
.submit-btn,
.submit-btn[class] {
  display: block;
  margin-left: auto;
}

@include adaptive(tablet-big) {
  .oform {
    max-width: 500px;
    margin: 0 auto;
  }

  .columns {
    display: block;
    padding: 0;
    border-top: 0;
  }

  .oform-col {
    margin: 0 calc(var(--container-padding-x) * -1);
    padding: 3rem var(--container-padding-x);
    border-left: 0;
    border-top: 1px solid var(--input-border-color);
    flex: 1 1 auto;

    &:first-child {
      padding-left: var(--container-padding-x);
    }
  }

  .col-title {
    margin-bottom: 1.75rem;
  }

  .summary {
    margin-inline: calc(var(--container-padding-x) * -1);
    padding-inline: var(--container-padding-x);
  }
}
</style>
