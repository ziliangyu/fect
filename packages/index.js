import Button from './Button'
import Spacer from './Spacer'
import Avatar from './Avatar'
import AvatarGroup from './Avatar/avatar.group'
import Card from './Card'
import Dot from './Dot'
import Switch from './Switch'
import Link from './Link'

import { camelize } from './utils/format/string'
const components = [
  Button,
  Spacer,
  Avatar,
  AvatarGroup,
  Card,
  Dot,
  Link,
  Switch,
]
const install = (vue) => {
  if (install.installed) return
  components.map((component) => {
    vue.component(camelize(`-${component.name}`), component)
  })
}

export default { install }
