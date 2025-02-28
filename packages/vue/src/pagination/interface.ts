import type { ExtractPropTypes, ComputedRef } from 'vue'
import { props } from './props'

export interface PaginationContext {
  props: ExtractPropTypes<typeof props>
  setCurrentPage: (val: number) => void
  updateSidePage: (type: SideEvent) => void
  shouldDisabledPrevious: ComputedRef<boolean>
  shouldDisabledNext: ComputedRef<boolean>
}

export type SideEvent = 'prev' | 'next'
