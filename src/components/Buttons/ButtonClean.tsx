"use client"
import { Button } from '@mui/material'
import React from 'react'

type Props = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode
}

export default function ButtonClean({ onClick, children }: Props) {
    return (
        <Button
            sx={{ color: "inherit", padding: ".2rem", minWidth: 0, width: 'auto', height: 'auto', }}
            onClick={onClick}>
            {children}
        </Button>
    )
}