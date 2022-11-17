import React, { useEffect, useState } from 'react'
import './Menu.css'
import { Link } from 'react-router-dom'

import AuthService from '../../services/AuthService'

export default function Menu(_props) {
    const [currentUser, setCurrentUser] = useState(undefined)

    useEffect(() => {
        const user = AuthService.getCurrentUser()
        if (user) {
            setCurrentUser(user)
        }
    }, [])

    return (
        <nav className='menu'>
            <Link to="/alunos">
                Alunos
            </Link>
            <Link to="/cursos">
                Cursos
            </Link>
            <Link to="/carometro">
                Carômetro
            </Link>
            {currentUser ? (
                <Link to="/logout">
                    Logout
                </Link>
            ) : (
                <Link to="/login">
                    Login
                </Link>
            )}
        </nav>
    )
}