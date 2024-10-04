<template>
  <section class="_section--primary-color bestsellers-section">
    <div class="bestsellers-slider">
      <Swiper
        :class="{ 'swiper-container--one-slide': bestsellers.length <= 1 }"
        :modules="[Pagination, EffectFlip]"
        effect="flip"
        :pagination="{
          clickable: true,
          bulletClass: 'bestsellers-slider__bullet',
          bulletActiveClass: 'bestsellers-slider__bullet--active',
        }"
      >
        <SwiperSlide v-for="(product, index) in bestsellers" :key="product.id">
          <div class="container bestsellers-slider__slide-container">
            <div class="bestsellers-slider__slide-background-box">
              <div class="bestsellers-slider__slide-background-title">
                <div>ВАШ ВЫБОР</div>
                <div>
                  {{ product.name }}
                </div>
              </div>
            </div>
            <h3 class="bestsellers-slider__slide-title">
              {{ titles[index] }}
            </h3>
            <div class="bestsellers-slider__slide-image">
              <img :src="product.image.url" />
            </div>
            <div class="bestsellers-slider__button-container">
              <AFButton class="bestsellers-slider__button" label="Купить" to="/" styleType="secondary" />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, EffectFlip } from 'swiper/modules'
import { Product } from '~/domain/product/Product'

const productService = new Product()

const titles = ['BESTSELLER', 'MUST HAVE', 'GREAT CHOISE']

const { data } = await productService.getBestsellers(titles.length)

const bestsellers = computed(() => data.value?.data || [])
</script>

<style lang="scss" scoped>
@import '~/scss/plugins/swiper-effect-flip';
@import '~/scss/plugins/swiper-pagination';

.bestsellers-section {
  padding-top: 90px;
  padding-bottom: 55px;
  min-height: 735px;

  @media (max-width: 1129px) {
    min-height: calc(100vw / 1.76);
  }

  @media (max-width: 949px) {
    padding-top: 35px;
    padding-bottom: 35px;
  }
}

.bestsellers-slider {
  :deep(.swiper-pagination) {
    display: flex;
    justify-content: center;
    padding-top: 21px;
  }

  :deep(.swiper-slide) {
    cursor: grab;
  }

  &__bullet {
    cursor: pointer;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background-color: #784e96;
    border: 3px solid #784e96;
    display: inline-block;
    margin-right: 7px;

    &--active {
      background-color: transparent;
    }
  }

  &__slide-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    position: relative;
    min-height: 560px;
  }

  &__slide-background-box {
    position: absolute;
    z-index: 5;
    width: 590px;
    height: 560px;
    border: 20px solid rgba(147, 126, 204, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  &__slide-background-title {
    text-align: center;
    color: rgba(101, 88, 137, 0.1);
    margin-top: 20px;
    font-weight: 700;

    div:first-child {
      @include fontSize(24);
      line-height: 0px;
    }

    div:last-child {
      @include fontSize(64);
      line-height: 75px;
    }
  }

  &__slide-title {
    position: absolute;
    z-index: 10;
    text-align: center;
    @include fontSize(192);
    font-weight: 700;
    line-height: 225px;
    color: #fff;
  }

  &__slide-image {
    position: relative;
    z-index: 15;

    img,
    picture {
      width: 500px;
      height: 350px;
      object-fit: contain;
    }
  }

  &__button-container {
    position: relative;
    z-index: 15;
    flex: 0 0 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;

    .button {
      @include fontSize(16);
      line-height: 18px;
      padding: 15px 50px;
      min-width: 255px;
      border-color: #fff;
      color: #fff;
      transition-property: border-color, color, background-color;

      &:hover {
        border-color: var(--theme_color_darker);
      }
    }
  }

  &__button {
    color: inherit;
  }

  @media (max-width: 1159px) {
    &__slide-container {
      min-height: calc(48vw - 20px);
    }

    &__slide-background-box {
      width: calc(51vw - 20px);
      height: calc(48vw - 20px);
    }

    &__slide-title {
      font-size: calc(
        65px + (192 - 84) * (100vw - 320px) / (var(--container_width) - 320)
      );
      line-height: 1;
    }

    &__slide-image {
      picture,
      img {
        width: calc(43vw - 20px);
        height: calc(30vw - 20px);
      }
    }
  }

  @media (max-width: 767px) {
    &__slide-background-box {
      width: 280px;
      height: 260px;
    }

    &__slide-image {
      picture,
      img {
        width: 350px;
        height: 244px;
      }
    }
  }

  @media (max-width: 559px) {
    &__slide-title {
      font-size: calc(
        52px + (192 - 84) * (100vw - 320px) / (var(--container_width) - 320)
      );
      line-height: 1;
    }
  }

  @media (max-width: 379px) {
    &__slide-image {
      picture,
      img {
        width: 280px;
        height: 195px;
      }
    }
  }
}
</style>
