import { computed, ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'dujiao-next-theme'

const isTheme = (value: string | null): value is Theme => {
    return value === 'light' || value === 'dark'
}

const getStoredTheme = (): Theme | null => {
    if (typeof window === 'undefined') return null
    try {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
        return isTheme(stored) ? stored : null
    } catch {
        return null
    }
}

const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') return 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getStoredTheme() || getSystemTheme())
const isDark = computed(() => theme.value === 'dark')

const applyTheme = (newTheme: Theme) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (newTheme === 'dark') {
        root.classList.add('dark')
    } else {
        root.classList.remove('dark')
    }
    root.style.colorScheme = newTheme
}

const persistTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
        // Ignore storage failures and keep the in-memory theme.
    }
}

// Watch for changes and apply
watch(theme, (newVal) => {
    applyTheme(newVal)
    persistTheme(newVal)
}, { immediate: true })

export const useTheme = () => {
    const setTheme = (value: Theme) => {
        theme.value = value
    }

    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
    }

    return {
        theme,
        isDark,
        setTheme,
        toggleTheme
    }
}
