"use client"
import React from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@mui/material'
import { Colors } from '@/themes/colors'
import federatedLogout from '@/utils/federatedLogout'

export default function LogoutButton() {
    return (
        <Button variant='contained' sx={{
            backgroundColor: Colors.button_red,
            '&:hover': {
                backgroundColor: Colors.button_red_hover
            }
        }} onClick={() => federatedLogout()}>Logout</Button>
    )
}