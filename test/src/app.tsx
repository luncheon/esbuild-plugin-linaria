import { css } from '@linaria/core'

document.body.className = css`
  display: grid;

  ::before {
    content: '';
    display: flex;
  }
`

