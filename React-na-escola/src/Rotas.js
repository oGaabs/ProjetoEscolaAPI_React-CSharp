import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Main from './components/template/Main'
import CrudAluno from './components/CrudAluno/CrudAluno'
import CrudCurso from './components/CrudCurso/CrudCurso'
import CrudCarometro from './components/CrudCarometro/CrudCarometro'

import NotFound from './components/NotFound/NotFound'

import AuthService from './services/AuthService'
import Login from './components/Login/Login'
import Logout from './components/Logout/Logout'

export default function Rotas() {
    const [currentUser, setCurrentUser] = useState(undefined)
    useEffect(() => {
        const user = AuthService.getCurrentUser()
        if (user) {
            setCurrentUser(user)
        }
    }, [])

    return (
        <Routes>

            <Route exact path='/'
                element={
                    <Main title="Bem Vindo!">
                        <div>Cadastro de alunos, cursos e carômetro</div>
                    </Main>
                }
            />

            {currentUser ? (
                <Route exact path='/alunos' element={<CrudAluno />} />
            ) : (
                <Route exact path='/alunos'
                    element={
                        <Main title="Cadastro de Alunos">
                            <div>Não autorizado!</div>
                        </Main>
                    }
                />
            )}
            {currentUser ? (
                <Route exact path="/cursos" element={<CrudCurso />} />
            ) : (
                <Route exact path='/cursos'
                    element={
                        <Main title="Cursos">
                            <div>Não autorizado!</div>
                        </Main>
                    }
                />
            )}

            <Route exact path="/carometro" element={<CrudCarometro />} />

            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />

            <Route /*Not found page*/ path='*' element={<NotFound />} />
        </Routes>
    )
}