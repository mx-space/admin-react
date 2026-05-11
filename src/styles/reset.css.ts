import { globalStyle } from '@vanilla-extract/css'

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
})

globalStyle('html, body', {
  margin: 0,
  padding: 0,
})

globalStyle('html, body, #root', {
  height: '100%',
})

globalStyle('body', {
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'optimizeLegibility',
})

globalStyle('h1, h2, h3, h4, h5, h6, p, blockquote, figure, dl, dd', {
  margin: 0,
})

globalStyle('h1, h2, h3, h4, h5, h6', {
  fontWeight: 'inherit',
  fontSize: 'inherit',
})

globalStyle('ul, ol', {
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
})

globalStyle('img, svg, video, canvas, audio, iframe, embed, object', {
  display: 'block',
  maxWidth: '100%',
})

globalStyle('button, input, optgroup, select, textarea', {
  font: 'inherit',
  color: 'inherit',
  margin: 0,
})

globalStyle('button', {
  background: 'none',
  border: 0,
  padding: 0,
  cursor: 'pointer',
})

globalStyle('button:disabled', {
  cursor: 'not-allowed',
})

globalStyle('textarea', {
  resize: 'vertical',
})

globalStyle('table', {
  borderCollapse: 'collapse',
  borderSpacing: 0,
})

globalStyle('fieldset', {
  margin: 0,
  padding: 0,
  border: 0,
})

globalStyle('legend', {
  padding: 0,
})

globalStyle(':focus-visible', {
  outline: 'none',
})

globalStyle('[hidden]', {
  display: 'none !important',
})
