import { css } from '@linaria/core'
import { h, render, Fragment, JSX } from 'preact'

const Grid = ({ children }: JSX.HTMLAttributes) => (
  <div id="grid" class={css`display: grid`}>{children}</div>
)

const BeforeFlex = () => (
  <div id="before-flex" class={css`::before { content: ''; display: flex; }`} />
)

const App = () => (
  <>
    <Grid>Test</Grid>
    <BeforeFlex />
  </>
)

render(<App />, document.body.appendChild(document.createElement('main')))
