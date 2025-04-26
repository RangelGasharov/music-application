import { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextField, TextFieldVariants } from "@mui/material"
import { JSX } from "react"

export const datePickerSlots = {
    textField: (params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => (
        <TextField
            {...params}
            sx={{
                color: 'var(--text-color)',
                '& .MuiOutlinedInput-input': {
                    color: 'var(--text-color)',
                },
                '& .MuiInputLabel-root': {
                    color: 'var(--text-color)',
                    '&.Mui-focused': {  // Explicit focused state for label
                        color: 'var(--text-color) !important',
                    },
                },
                '& .MuiInputBase-input::placeholder': {
                    color: 'var(--text-color)',
                    opacity: 0.6,
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'var(--text-color)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'var(--text-color)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'var(--text-color)',
                        borderWidth: '1px',
                    },
                    '&.Mui-error:not(.Mui-focused) fieldset': {
                        borderColor: 'var(--text-color) !important',
                    },
                },
            }}
        />
    ),
};

export const datePickerSlotProps = {
    openPickerButton: {
        sx: {
            color: 'var(--text-color)',
            '&:hover': {
                color: 'var(--text-color)',
                backgroundColor: 'transparent',
            },
        },
    },
}