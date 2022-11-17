import React, { useState, useEffect } from 'react'
import '../CrudCurso/CrudCurso.css'
import Main from '../template/Main'

import UserService from '../../services/UserService'

import { BsFillPencilFill, BsFillTrash2Fill } from 'react-icons/bs'
/*
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const toastConfig = {
    theme: "dark",
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}*/

const sendSuccessPopUp = (_text) => {
    //toast.success(text, toastConfig);
}

const sendMultipleErrorPopUp = (_err) => {
    /*
    let errors;
    try {
        errors = (err = err.response?.data?.errors
            ? Object.values(err.response.data.errors)
            : err);
    } catch (err) {
        errors = [err]
    }

    errors.forEach((err) => {
        sendErrorPopUp(
            `Falha ao conectar ao banco de dados: \n ${err}`
        );
    });*/
}

const API_URL = 'http://localhost:5147/api/curso'

export default function CrudCurso() {
    const initialState = {
        curso: { id: 0, codCurso: 0, nomeCurso: '', periodo: '' },
        lista: [],
        mens: []
    }

    const title = 'Cadastro de Cursos'
    const [curso, setCurso] = useState(initialState.curso)
    const [lista, setLista] = useState(initialState.lista)
    const [mens, setMens] = useState(initialState.mens)

    useEffect(() => {
        UserService.getProfessorBoardCursos().then(
            (response) => {
                console.log('useEffect getProfessorBoard: ' + response.data)
                setLista(response.data)
                setMens(null)
            },
            (error) => {
                const _mens =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString()
                setMens(_mens)
                console.log('_mens: ' + _mens)
            }
        )
    }, [curso])

    const limparCurso = () => setCurso(initialState.curso)

    const salvarCurso = () => {
        const metodo = curso.id ? 'put' : 'post'
        const url = curso.id ? `${API_URL}/${curso.id}` : API_URL

        curso.codCurso = Number(curso.codCurso)

        UserService.salvarAluno(metodo, url, curso)
            .then((resp) => {
                const lista = getListaAtualizada(resp.data)

                setCurso(initialState.curso)
                setLista(lista)
                sendSuccessPopUp(`Método ${metodo} efetuado com sucesso!`)
            })
            .catch((err) => {
                console.error(err)

                sendMultipleErrorPopUp(err)
            })
    }

    const getListaAtualizada = (curso, add = true) => {
        const listaNova = lista.filter((a) => a.id !== curso.id)
        if (add) listaNova.unshift(curso)
        return listaNova
    }

    const atualizaCampo = (event) => {
        const { name, value } = event.target

        setCurso({
            ...curso,
            [name]: value,
        })
    }

    const atualizarCurso = (curso) => setCurso(curso)

    const removerCurso = (curso) => {
        if (!window.confirm('Confirma remoção do curso: ' + curso.nomeCurso))
            return

        UserService.deletarCurso(curso.id)
            .then((_resp) => {
                const lista = getListaAtualizada(curso, false)
                setCurso(initialState.curso)
                setLista(lista)
                sendSuccessPopUp('Curso removido com sucesso!')
            })
            .catch((err) => {
                console.dir(err)

                sendMultipleErrorPopUp(err)
            })
    }

    const renderForm = () => {
        return (
            <div className="inclui-container">
                <label> Código: </label>
                <input
                    type="text"
                    id="codCurso"
                    placeholder="Código do curso"
                    className="form-input small"
                    name="codCurso"
                    value={curso.codCurso}
                    onChange={(e) => atualizaCampo(e)}
                />
                <label> Nome: </label>
                <input
                    type="text"
                    id="nomeCurso"
                    placeholder="Nome do curso"
                    className="form-input"
                    name="nomeCurso"
                    value={curso.nomeCurso}
                    onChange={(e) => atualizaCampo(e)}
                />
                <label> Periodo: </label>
                <input
                    type="text"
                    id="periodo"
                    placeholder="V"
                    className="form-input small"
                    name="periodo"
                    value={curso.periodo}
                    onChange={(e) => atualizaCampo(e)}
                />
                <br />
                <button
                    className="btn btnSalvar"
                    onClick={(e) => salvarCurso(e)}
                >
                    Salvar
                </button>
                <button
                    className="btn btnCancelar"
                    onClick={(e) => limparCurso(e)}
                >
                    Cancelar
                </button>
            </div>
        )
    }

    const renderTable = () => {
        return (
            <div className="listagem">
                <table className="listaAlunos styled-table" id="tblListaAlunos">
                    <thead>
                        <tr className="cabecTabela title">
                            <th className="tabTituloCodigo">Codigo</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloPeriodo">Periodo</th>
                            <th className="tabTituloAcoes title">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(lista)
                            ? lista.map((curso) => (
                                <tr key={curso.id}>
                                    <td>{curso.codCurso}</td>
                                    <td>{curso.nomeCurso}</td>
                                    <td>{curso.periodo}</td>
                                    <td className="td-buttons">
                                        <button
                                            className="btn btn-edit"
                                            onClick={() =>
                                                atualizarCurso(curso)
                                            }
                                        >
                                            <BsFillPencilFill /> Alterar
                                        </button>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                removerCurso(curso)
                                            }
                                        >
                                            <BsFillTrash2Fill /> Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                            : null}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <Main title={title}>
            {
                (mens != null) ? 'Problema com conexão ou autorização (contactar administrador).' :
                    <>
                        {renderForm()}
                        {renderTable()}
                    </>
            }
            {/*
            <ToastContainer
                limit={5}
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />*/}
        </Main>
    )
}