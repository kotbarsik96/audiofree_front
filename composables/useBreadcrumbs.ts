import { useGlobalStore } from '#imports'
import type { RouteLocationRaw } from 'vue-router'

/** массив актуальных хлебных крошек */
const _breadCrumbs = ref<IBreadCrumb[]>([])
/** массив хлебных крошек на момент загрузки страницы (сохраняет хк с прошлой страницы) */
const _breadcrumbsPending = ref<IBreadCrumb[]>([])

export interface IBreadCrumb {
  label: string
  link: RouteLocationRaw
  index: number
}

/** если нужно сделать setBreadcrumbs в компоненте ПОСЛЕ await'а, то для нормального отображения при загрузке страницы, нужно: (пример смотреть в ProductPageBody)
 * 
 * 1. сделать setBreadcrumbs(breadCrumbs.value) ДО await'а 
 * 
 * 2. делать setBreadcrumbs с новыми хлебными крошками
 * */
export function useBreadcrumbs() {
  const { pageIsLoading } = storeToRefs(useGlobalStore())

  const breadCrumbs = computed(() =>
    pageIsLoading.value
      ? _breadcrumbsPending.value.sort(_sortFunction)
      : _breadCrumbs.value.sort(_sortFunction)
  )

  /** удалит хлебные крошки с индексом больше или равному breadCrumb.index
   */
  function _addBreadcrumb(breadCrumb: IBreadCrumb) {
    _breadCrumbs.value = _breadCrumbs.value.filter(
      (bc) => bc.index < breadCrumb.index
    )
    _breadCrumbs.value.push(breadCrumb)
  }
  /** применит _addBreadcrumb к массиву крошек */
  function setBreadcrumbs(breadCrumbs: IBreadCrumb[]) {
    // сохранить текущие хлебные крошки (будут отображаться пока не загрузится новая страница)
    setPendingBreadcrumbs(_breadCrumbs.value)
    // добавить новые
    breadCrumbs.forEach((bc) => _addBreadcrumb(bc))
  }
  function setPendingBreadcrumbs(breadCrumbs: IBreadCrumb[]) {
    _breadcrumbsPending.value = breadCrumbs
  }
  function _sortFunction(bc_1: IBreadCrumb, bc_2: IBreadCrumb) {
    return bc_1.index - bc_2.index
  }

  return {
    breadCrumbs,
    setBreadcrumbs,
    setPendingBreadcrumbs,
  }
}
