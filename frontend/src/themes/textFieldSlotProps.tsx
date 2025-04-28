export const textFieldSlotProps = {
    input: {
        sx: { color: 'var(--text-color)', backgroundColor: "var(--cards-background-color)" },
    },
    inputLabel: {
        sx: {
            color: 'var(--text-color)',
            '&.Mui-focused': {
                color: 'var(--text-color)',
            },
        },
    },
    root: {
        sx: {
            '& .MuiOutlinedInput-root': {
                color: 'var(--text-color)',
                '& fieldset': {
                    borderColor: 'var(--text-color)',
                },
                '&:hover fieldset': {
                    borderColor: 'var(--text-color)',
                },
                '&.Mui-focused fieldset': {
                    borderColor: 'var(--text-color)',
                },
            },
        },
    }
}