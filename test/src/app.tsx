/* @jsx h */
/* @jsxFrag Fragment */
import { css } from '@linaria/core'
import { h, Fragment, JSX } from 'preact'

const Grid = ({ children }: { children?: JSX.HTMLAttributes<HTMLElement>['children'] }) => (
  <div id="grid" class={css`display: grid`}>{children}</div>
)

const BeforeFlex = () => (
  <div id="before-flex" class={css`::before { content: ''; display: flex; }`} />
)

export const App = () => (
  <>
    <Grid>Test</Grid>
    <BeforeFlex />
  </>
)
