import React, { useState, useEffect } from "react";
import "../CrudCurso/CrudCurso.css";
import Main from "../template/Main";
import axios from "axios";

import { BsFillPencilFill, BsFillTrash2Fill } from "react-icons/bs";
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

const sendSuccessPopUp = (text) => {
    //toast.success(text, toastConfig);
};

const sendMultipleErrorPopUp = (err) => {
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
};

const API_URL = "http://localhost:5147/api/curso";
const getDataFromApi = async () => {
    return await axios(API_URL)
        .then((resp) => resp.data)
        .catch((err) => err);
};

export default function CrudCurso() {
    const initialState = {
        curso: { id: 0, codCurso: 0, nomeCurso: "", periodo: "" },
        lista: [],
    };

    const title = "Cadastro de Cursos";
    const [curso, setCurso] = useState(initialState.curso);
    const [lista, setLista] = useState(initialState.lista);

    useEffect(() => {
        getDataFromApi()
            .then(setLista)
            .catch((err) => {
                console.log(err);

                sendMultipleErrorPopUp(err);
            });
    }, [curso]);

    const limparCurso = () => setCurso(initialState.curso);

    const salvarCurso = () => {
        const metodo = curso.id ? "put" : "post";
        const url = curso.id ? `${API_URL}/${curso.id}` : API_URL;

        curso.codCurso = Number(curso.codCurso);

        axios[metodo](url, curso)
            .then((resp) => {
                const lista = getListaAtualizada(resp.data);

                setCurso(initialState.curso);
                setLista(lista);
                sendSuccessPopUp(`Método ${metodo} efetuado com sucesso!`);
            })
            .catch((err) => {
                console.error(err);

                sendMultipleErrorPopUp(err);
            });
    };

    const getListaAtualizada = (curso, add = true) => {
        const listaNova = lista.filter((a) => a.id !== curso.id);
        if (add) listaNova.unshift(curso);
        return listaNova;
    };

    const atualizaCampo = (event) => {
        const { name, value } = event.target;

        setCurso({
            ...curso,
            [name]: value,
        });
    };

    const atualizarCurso = (curso) => setCurso(curso);

    const removerCurso = (curso) => {
        const url = API_URL + "/" + curso.id;
        if (!window.confirm("Confirma remoção do curso: " + curso.nomeCurso))
            return;

        axios["delete"](url, curso)
            .then((_resp) => {
                const lista = getListaAtualizada(curso, false);
                setCurso(initialState.curso);
                setLista(lista);
                sendSuccessPopUp("Curso removido com sucesso!");
            })
            .catch((err) => {
                console.dir(err);

                sendMultipleErrorPopUp(err);
            });
    };

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
        );
    };

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
        );
    };

    return (
        <Main title={title}>
            {renderForm()}
            {renderTable()}
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
    );
}
