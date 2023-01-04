export const ANTIALISED_RESET_CSS = () => `-webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

export const NOVOUT_RESET_CSS = () => `* {
  padding: 0;
  margin: 0;
  outline: 0;
  ${ANTIALISED_RESET_CSS()}
}

#app {
  min-height: 100vh;
  width: 100%;
}

[contenteditable] {
  outline: none;
  -moz-user-select: text;
  -webkit-tap-highlight-color: transparent;
}  
`
