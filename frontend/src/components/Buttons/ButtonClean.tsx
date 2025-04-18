"use client"
import { Button } from '@mui/material'
import React from 'react'

type Props = {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode
}

export default function ButtonClean({ onClick, children }: Props) {
    return (
        <Button disableTouchRipple
            sx={{
                color: "inherit", backgroundColor: "transparent", boxShadow: "none", padding: ".2rem", minWidth: 0, width: 'auto', height: 'auto',
                transformOrigin: 'center',
                '&:hover': {
                    transform: "scale(1.2)"
                }
            }}
            onClick={onClick}>
            {children}
        </Button>
    )
}