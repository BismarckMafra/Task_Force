
export function useDarkMode() {
  
    const [dark, setDark] = useState(() => {

    if (typeof window === 'undefined') return false
    const salvo = localStorage.getItem('darkMode')
    return salvo !== null
      ? salvo === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', dark)
    localStorage.setItem('darkMode', String(dark))
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}

