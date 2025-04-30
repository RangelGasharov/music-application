import { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextField, TextFieldVariants } from "@mui/material"
import { JSX } from "react"

export const datePickerSlots = {
    textField: (params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => (
        <TextField
            {...params}
            sx={{
                color: 'var(--text-color)',
                backgroundColor: "var(--cards-background-color)",
                '& .MuiOutlinedInput-input': {
                    color: 'var(--text-color)',
                },
                '& .MuiInputLabel-root': {
                    color: 'var(--text-color)',
                    '&.Mui-focused': {
                        color: 'var(--text-color) !important'
                    },
                },
                '& .MuiInputBase-input::placeholder': {
                    color: 'var(--text-color)',
                    opacity: 0.6,
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        boxShadow: "1px 2px 2px var(--text-shadow)",
                    },
                    '&:hover fieldset': {
                        borderColor: 'var(--text-color)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'var(--text-color)',
                        borderWidth: '2px',
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