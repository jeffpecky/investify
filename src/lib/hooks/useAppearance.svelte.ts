import { onMount } from 'svelte';
import { browser } from '$app/environment';

export type Appearance = 'light' | 'dark' | 'system';

function getMediaQuery() {
    if (!browser) return null;
    return window.matchMedia('(prefers-color-scheme: dark)');
}

function getSavedAppearance(): Appearance | null {
    if (!browser) return null;
    try {
        return localStorage.getItem('appearance') as Appearance | null;
    } catch {
        return null;
    }
}

function applyAppearance(appearance: Appearance) {
    if (!browser) return;

    if (appearance === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
    } else {
        document.documentElement.classList.toggle('dark', appearance === 'dark');
    }
}

const handleSystemThemeChange = () => {
    if (!browser) return;
    const current = getSavedAppearance();
    applyAppearance(current || 'light');
};

export function initializeTheme() {
    if (!browser) return;

    const saved = getSavedAppearance();
    applyAppearance(saved || 'light');

    const mediaQuery = getMediaQuery();
    mediaQuery?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    let appearance = $state<Appearance>(getSavedAppearance() || 'light');

    onMount(() => {
        initializeTheme();

        const current = getSavedAppearance();
        if (current) {
            appearance = current;
        }

        return () => {
            const mediaQuery = getMediaQuery();
            mediaQuery?.removeEventListener('change', handleSystemThemeChange);
        };
    });

    function updateAppearance(value: Appearance) {
        appearance = value;
        if (browser) {
            try {
                localStorage.setItem('appearance', value);
            } catch {
                // localStorage may be unavailable
            }
        }
        applyAppearance(value);
    }

    return {
        get appearance() {
            return appearance;
        },
        updateAppearance,
    };
}
