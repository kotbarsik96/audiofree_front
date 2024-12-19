import type { RouteLocationRaw } from 'vue-router'

const _breadCrumbs = ref<IBreadCrumb[]>([])

export interface IBreadCrumb {
  label: string
  link: RouteLocationRaw
  index: number
}

export function useBreadcrumbs() {
  const breadCrumbs = computed(() =>
    _breadCrumbs.value.sort((bc_1, bc_2) => {
      return bc_1.index - bc_2.index
    })
  )

  /** удалит хлебные крошки с индексом больше или равному breadCrumb.index
   */
  function addBreadcrumb(breadCrumb: IBreadCrumb) {
    _breadCrumbs.value = _breadCrumbs.value.filter(
      (bc) => bc.index < breadCrumb.index
    )
    _breadCrumbs.value.push(breadCrumb)
  }
  /** применит addBreadcrumb к массиву крошек */
  function setBreadcrumbs(breadCrumbs: IBreadCrumb[]) {
    breadCrumbs.forEach((bc) => addBreadcrumb(bc))
  }

  return {
    breadCrumbs,
    addBreadcrumb,
    setBreadcrumbs,
  }
}
