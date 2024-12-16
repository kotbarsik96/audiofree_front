<template>
  <div class="grefund-step _card">
    <div class="_card__inner grefund-step__inner">
      <div class="grefund-step__head">
        <div class="grefund-step__num"></div>
        <ChevronRightIcon class="grefund-step__arrow" />
      </div>
      <div class="grefund-step__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChevronRightIcon from '~/assets/images/icons/chevron-right.svg'
</script>

<style lang="scss" scoped>
.grefund-step {
  &__inner {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    padding: 0;
    height: 100%;
  }

  &__head {
    border-bottom: 1px solid var(--stroke);
    padding: 0.875rem 1.125rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__num {
    border-radius: 50%;
    width: 3.25rem;
    height: 3.25rem;
    background: var(--white);
    box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.09);
    color: var(--primary);
    font-weight: 900;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    @include fontSize(20);

    &::before {
      content: counters(refundSteps, '', decimal-leading-zero);
      counter-increment: refundSteps;
    }
  }

  &__arrow {
    color: var(--primary);
    width: 0.75rem;
    height: 1.125rem;
  }
  &:last-child &__arrow {
    transform: rotate(90deg);
  }

  &__body {
    padding: 1.5rem 1.125rem;
    @include fontSize(16);
  }

  @include adaptive(phone-big) {
    &::before {
      display: none;
    }

    &__arrow {
      transform: rotate(90deg);
    }
  }
}
</style>
