import axios from 'axios'
import auth from './AuthService'

const API_URL = 'http://localhost:5147/api/'
// Cadastro Aluno: role professor
// Cadastro Curso: role professor
// Carômetro: todos

const getPublicContent = () => {
    //return axios.get(API_URL + 'carometro')
}

const getPublicCarometro = {
    getCursos: () => {
        return axios.get(API_URL + 'carometro/curso')
    },
    getAlunos: () => {
        return axios.get(API_URL + 'carometro/aluno')
    },
}

const headerAuthorization = () => {
    return {
        headers: {
            Authorization: 'Bearer ' + auth.getCurrentUser().token
        }
    }
}

const getProfessorBoardAlunos = async () => {
    return await axios.get(API_URL + 'aluno', headerAuthorization())
}

const salvarAluno = async (method, url, aluno) => {
    return await axios[method](url, aluno, headerAuthorization())
}

const deletarAluno = async (id) => {
    return await axios.delete(API_URL + 'aluno/' + id, headerAuthorization())
}

const getProfessorBoardCursos = async () => {
    return await axios.get(API_URL + 'curso', headerAuthorization())
}

const salvarCurso = async (method, url, curso) => {
    return await axios[method](url, curso, headerAuthorization())
}

const deletarCurso = async (id) => {
    return await axios.delete(API_URL + 'curso/' + id, headerAuthorization())
}

const UserService = {
    getPublicContent,
    getPublicCarometro,
    getProfessorBoardAlunos: getProfessorBoardAlunos,
    getProfessorBoardCursos: getProfessorBoardCursos,
    salvarAluno: salvarAluno,
    deletarAluno: deletarAluno,
    salvarCurso: salvarCurso,
    deletarCurso: deletarCurso
}

export default UserService