"use client"
import React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@mui/material'
import { Colors } from '@/themes/colors'

export default function LoginButton() {
    return (
        <Button variant='contained' sx={{
            backgroundColor: Colors.button_blue,
            '&:hover': {
                backgroundColor: Colors.button_blue_hover
            }
        }} onClick={() => signIn("keycloak")}>Log in</Button>
    )
}