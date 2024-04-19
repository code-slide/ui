import path from 'path';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, './src/')
        }
    },

    define: {
        __REACT_DEVTOOLS_GLOBAL_HOOK__: { isDisabled: true }
    },

    test: {
        globals: true,

        browser: {
            name: 'firefox', // browser name is required,

            slowHijackESM: false
        },

        coverage: {
            provider: 'istanbul',
        },
    },
});