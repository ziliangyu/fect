import { defineComponent, watchEffect, ref } from 'vue'
import { useTheme } from '../../packages/utils'
import './widgets.less'
const Widgets = defineComponent({
  setup() {
    const isDark = ref(false)
    const themeIcon = ref('moon')
    const setTheme = (theme) => localStorage.setItem('theme', theme)

    /**
     *while watchEffect exduce can't not found null includes
     */

    watchEffect(() => {
      const _theme = localStorage.getItem('theme')
      if (_theme) {
        isDark.value = _theme.includes('dark')
      }
      const { setLightTheme, setDarkTheme } = useTheme
      // eslint-disable-next-line no-unused-expressions
      isDark.value ? setDarkTheme() : setLightTheme()
    })

    const changeThemeHandler = () => {
      const next = localStorage.getItem('theme')
      if (next === 'light' || next === null) {
        isDark.value = true
        setTheme('dark')
        themeIcon.value = 'sun'
      } else {
        isDark.value = false
        setTheme('light')
        themeIcon.value = 'moon'
      }
    }
    return () => (
      <>
        <div className="f_doc-widgets">
          <fectLink
            href="https://github.com/Fect-org/Yuki"
            class={'f_doc-widgets_icons'}
          >
            <fect-icon icon="github" size="18" />
          </fectLink>
          <span className={'f_doc-widgets_icons'} onClick={changeThemeHandler}>
            <fect-icon icon={themeIcon} size="18" />
          </span>
        </div>
      </>
    )
  },
})

export default Widgets
