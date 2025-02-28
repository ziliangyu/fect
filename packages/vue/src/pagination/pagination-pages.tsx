import { defineComponent, computed, watchEffect } from 'vue'
import { useState } from '@fect-ui/vue-hooks'
import PaginationItem from './pagination-item'
import { make } from '../utils'
import PaginationEllipsis from './pagination-ellipsis'
import { usePaginationContext } from './pagination-context'

export default defineComponent({
  props: {
    current: {
      type: Number,
      required: true
    },
    count: {
      type: [Number],
      required: true
    },
    limit: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const [beforeEllipsis, setBeforeEllipsis] = useState<boolean>(false)

    const [afterEllipsis, setAfterEllipsis] = useState<boolean>(false)

    const { context } = usePaginationContext()
    const setParentPage = (page: number) => {
      if (props.current === page) return
      context?.setCurrentPage(page)
    }

    const visbilePage = computed(() => {
      const { limit } = props
      return (limit % 2 === 0 ? limit - 1 : limit) - 2
    })

    // dispaly limit value older then count value

    const overlaod = computed(() => (props.limit > props.count ? true : false))

    const setEllipsisState = () => {
      const { count, current } = props
      const cursor = (visbilePage.value + 1) / 2

      // only work in normal mode. When overload as false
      if (!overlaod.value) {
        setBeforeEllipsis(current > cursor + 1 ? true : false)
        setAfterEllipsis(current < count - cursor ? true : false)
      }
    }

    watchEffect(setEllipsisState)

    //  work in normal .
    const dispalyedPage = computed(() => {
      const { count, current, limit } = props
      const showBefore = beforeEllipsis.value
      const showAfter = afterEllipsis.value
      const cursor = (visbilePage.value + 1) / 2
      const offset = cursor - 1
      const showBeforeAndAfter = showBefore && showAfter
      const onlyShowBefore = showBefore && !showAfter
      const onlyShowAfter = showAfter && !showBefore

      const pageNum = showBeforeAndAfter ? current + offset : onlyShowBefore ? count - 1 : onlyShowAfter ? limit : count
      const control = showBeforeAndAfter || onlyShowBefore
      return make(pageNum).reduce((acc: number[], _, idx: number) => {
        idx += 1
        if (control && idx >= current) acc.push(idx)
        /**
         * It means if we don't show ellipsis and the currentPage is less then 2.
         * so we should render more values.
         */
        if (!control && idx >= 2) acc.push(idx)
        return acc
      }, []) as number[]
    })

    const renderItem = (value: number, active: number) => {
      return (
        <PaginationItem active={value === active} key={`pagination-item-${value}`} onClick={() => setParentPage(value)}>
          {value}
        </PaginationItem>
      )
    }

    const renderEllipsis = (value: number, key: string, isBefore = false) => {
      return (
        <PaginationEllipsis
          key={`pagination-ellipsis-${key}`}
          isBefore={isBefore}
          onClick={() => setParentPage(value)}
        />
      )
    }

    /**
     * when limit value older than count value use it
     */
    const renderlessLimit = () => {
      const { current } = props
      return make(props.count).map((_, index) => {
        const value = index + 1
        return renderItem(value, current)
      })
    }

    const renderNormal = () => {
      const { current, count } = props
      const beforeValue = current - 5 >= 1 ? current - 5 : 1
      const afterValue = current + 5 <= count ? current + 5 : count
      return (
        <>
          {renderItem(1, current)}
          {beforeEllipsis.value && renderEllipsis(beforeValue, 'before', true)}
          {dispalyedPage.value.map((page) => renderItem(page, current))}
          {afterEllipsis.value && renderEllipsis(afterValue, 'after')}
          {renderItem(count, current)}
        </>
      )
    }

    return () => <>{overlaod.value ? renderlessLimit() : renderNormal()}</>
  }
})
