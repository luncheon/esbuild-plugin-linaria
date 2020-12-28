import { css } from '@linaria/core'

declare global {}

document.body.className = css`
  display: grid;

  ::before {
    content: '';
    display: flex;
  }
`

