export const darkTheme = {
    styles: {
        spotlight: {
            borderRadius: '12px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.9)',
            border: '2px solid #4b5563',
        },
        buttonNext: {
            background: '#10b981',
            color: 'white',
        },
        buttonBack: {
            background: '#374151',
            color: 'white',
            border: 'none',
        },
    },
};

export const modernTheme = {
    styles: {
        spotlight: {
            borderRadius: '20px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        buttonNext: {
            background: 'rgba(59, 130, 246, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
        },
    },
};

export const minimalTheme = {
    styles: {
        spotlight: {
            borderRadius: '4px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
            border: '1px solid #000',
        },
        buttonNext: {
            background: '#000',
            color: '#fff',
            borderRadius: '4px',
        },
        buttonBack: {
            background: 'transparent',
            border: '1px solid #000',
            color: '#000',
            borderRadius: '4px',
        },
    },
};

export const colorfulTheme = {
    styles: {
        spotlight: {
            borderRadius: '16px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            border: '3px solid #f59e0b',
        },
        buttonNext: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            color: 'white',
            borderRadius: '12px',
            fontWeight: 'bold',
        },
    },
};

export default {
    darkTheme,
    modernTheme,
    minimalTheme,
    colorfulTheme
};