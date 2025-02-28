import { computed, watch, defineComponent, watchEffect } from 'vue'
import { useState } from '@fect-ui/vue-hooks'
import CheckIcon from './checkbox-icon'
import { createName, createBem } from '../utils'
import { useCheckboxContext } from '../checkbox-group/checkbox-context'
import { checkboxProps } from '../checkbox-group/props'
import { pickFormStateProps, useFormStateContext } from '../form/form-context'
import type { CheckboxEvent } from '../checkbox-group/interface'

import './index.less'

const name = createName('Checkbox')
const bem = createBem('fect-checkbox')

export default defineComponent({
  name,
  props: checkboxProps,
  emits: ['change', 'update:modelValue'],
  setup(props, { slots, emit }) {
    const [selfChecked, setSelfChecked] = useState<boolean>()
    const { context } = useCheckboxContext()

    const formState = useFormStateContext()

    const getCheckboxState = computed(() => {
      const { size, disabled } = pickFormStateProps(
        { size: props.size, disabled: props.disabled },
        context,
        formState?.behavior.value
      )
      return { size, disabled }
    })

    /**
     * when checkbox use in checkbox-group, we set
     * parent label val will trigger this evt.
     * so we don't need setSelfChecked at once.
     */
    const setCurrentState = () => {
      if (!context) {
        setSelfChecked(props.modelValue)
        return
      }
      const parent = context.parentValue.value
      const checked = parent.some((v) => v === props.label)
      setSelfChecked(checked)
    }

    watchEffect(setCurrentState)

    const handleChange = (e: Event) => {
      if (getCheckboxState.value.disabled) return
      const checkboxEvent: CheckboxEvent = {
        target: {},
        stopPropagation: e.stopPropagation,
        preventDefault: e.preventDefault,
        nativeEvent: e
      }

      if (context) {
        context.updateCheckboxGroupValue(props.label)
        context.updateCheckboxGroupEvent(checkboxEvent)
        return
      }
      setSelfChecked((pre) => !pre)
      emit('change', {
        ...checkboxEvent,
        target: { checked: selfChecked.value }
      })
    }

    watch(selfChecked, (cur) => {
      if (formState) formState.validate('change')
      emit('update:modelValue', cur)
    })

    return () => (
      <label class={bem(null, getCheckboxState.value)}>
        <CheckIcon class={`${getCheckboxState.value.disabled ? 'disabled' : ''}`} checked={selfChecked.value} />
        <input
          type="checkbox"
          disabled={getCheckboxState.value.disabled}
          checked={selfChecked.value}
          onChange={handleChange}
        ></input>
        <span class={bem('inner')}>{slots.default?.()}</span>
      </label>
    )
  }
})
