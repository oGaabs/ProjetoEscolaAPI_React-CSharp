import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillPencilFill, BsFillTrash2Fill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
import "./Curso.css";

import Main from "../template/Main";

export default function Curso(){
    const initialState = {
        curso: { id: 0, codCurso: 0, nomeCurso: '', periodo: ''},
        lista: []
    }

    const title = "Cadastro de Cursos";
    const API_URL = "http://localhost:5147/api/curso";
    const [curso, setCurso] = useState(initialState.curso)
    const [lista, setLista] = useState(initialState.lista)

    const getDataFromApi = async () => {
        await axios(API_URL)
            .then((resp) => {
                setLista(resp.data);
            })
            .catch((err) => {
                const errors = (err = err.response?.data?.errors
                    ? Object.values(err.response.data.errors)
                    : err);
                console.error(err);

                errors.forEach((err) => {
                    sendErrorPopUp(
                        `Falha ao conectar ao banco de dados: \n ${err}`
                    );
                });
            });
    }

    useEffect(() => {
        getDataFromApi()
    }, [lista])
    
    const limpar = () => {
        setCurso({ curso: initialState.curso })
    }


    const salvarCurso = () => {
        const metodo = curso.id ? "put" : "post";
        const url = curso.id ? `${API_URL}/${curso.id}` : API_URL;

        curso.codCurso = Number(curso.codCurso);

        axios[metodo](url, curso)
            .then((resp) => {
                const lista = getListaAtualizada(resp.data);

                setCurso({ curso: initialState.curso, lista })
                sendSuccessPopUp(`Método ${metodo} efetuado com sucesso!`);
            })
            .catch((err) => {
                const errors = (err = err.response?.data?.errors
                    ? Object.values(err.response.data.errors)
                    : err);
                console.error(err);

                errors.forEach((error) => {
                    sendErrorPopUp(
                        `Erro ao efetuar: ${metodo}:\n ${error}`
                    );
                });
            });
    }

    const getListaAtualizada = (curso, add = true) => {
        const listaNova = lista.filter((a) => a.id !== curso.id);
        if (add) listaNova.unshift(curso);
        return listaNova ;
    }

    const atualizaCampo = event => {
        const { name, value } = event.target

        setCurso({
            ...curso,
            [name]: value
        })
    }

    const atualizarCurso = (curso) => {
        setCurso(curso)
    }

    const removerCurso = (curso) => {
        const url = API_URL + "/" + curso.id;
        if (!window.confirm("Confirma remoção do curso: " + curso.nomeCurso)) return;

        axios['delete'](url, curso)
            .then((resp) => {
                const lista = getListaAtualizada(curso, false)
                setCurso({ curso: initialState.curso, lista })
                sendSuccessPopUp("Curso removido com sucesso!")
            })
            .catch((err) => {
                const errors = (err = err.response?.data?.errors
                    ? Object.values(err.response.data.errors)
                    : err);
                console.dir(err);

                errors.forEach((error) => {
                    sendErrorPopUp(`Erro ao deletar: \n ${error}`);
                });
            });
    }

    const sendSuccessPopUp = (text) => {
        toast.success(text, {
            theme: "dark",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const sendErrorPopUp = (text) => {
        toast.error(text, {
            theme: "dark",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const renderForm = () => {
        return (
            <div className="inclui-container">
                <label> Codigo: </label>
                <input
                    type="text"
                    id="codCurso"
                    placeholder="Codigo do curso"
                    className="form-input"
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
                    placeholder="0"
                    className="form-input"
                    name="periodo"
                    value={curso.periodo}
                    onChange={(e) => atualizaCampo(e)}
                />
                <br/>
                <button
                    className="btn btnSalvar"
                    onClick={(e) => salvarCurso(e)}
                >
                    Salvar
                </button>
                <button
                    className="btn btnCancelar"
                    onClick={(e) => limpar(e)}
                >
                    Cancelar
                </button>
            </div>
        );
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
                        {console.log(lista)}
                        {
                            lista.map((curso) => (
                                    <tr key={curso.id}>
                                        <td>{curso.codCurso}</td>
                                        <td>{curso.nomeCurso}</td>
                                        <td>{curso.periodo}</td>
                                        <td className="td-buttons">
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => atualizarCurso(curso)}
                                            >
                                                <BsFillPencilFill /> Alterar
                                            </button>
            
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => removerCurso(curso)}
                                            >
                                                <BsFillTrash2Fill /> Excluir
                                            </button>
                                        </td>
                                    </tr>
                                
                                ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <Main title={title}>
            {renderForm()}
            {renderTable()}
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
            />
        </Main>
    );
}
