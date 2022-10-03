import React, { Component } from "react";
import "./CrudAluno.css";
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
}

/*const sendErrorPopUp = (text) => {
    //toast.error(text, toastConfig);
}*/

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
}

const title = "Cadastro de Alunos";

const API_URL_ALUNO = "http://localhost:5147/api/aluno";
const API_URL_CURSO = "http://localhost:5147/api/curso"
const initialState = {
    aluno: { id: 0, ra: "", nome: "", codCurso: 0 },
    lista: [],
    listaCurso: []
};

export default class CrudAluno extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState};
    }

    componentDidMount() {
        axios(API_URL_ALUNO)
            .then((resp) => {
                this.setState({ lista: resp.data });
            })
            .catch((err) => {
                console.dir(err);

                sendMultipleErrorPopUp(err)
            });

        axios(API_URL_CURSO)
            .then((resp) => {
                this.setState({ listaCurso: resp.data });
            })
            .catch((err) => {
                console.dir(err);

                sendMultipleErrorPopUp(err)
            });
    }

    limpar() {
        this.setState({ aluno: initialState.aluno });
    }

    salvar() {
        const aluno = this.state.aluno
        const metodo = aluno.id ? "put" : "post"
        const url = aluno.id ? `${API_URL_ALUNO}/${aluno.id}` : API_URL_ALUNO

        axios[metodo](url, aluno)
            .then((resp) => {
                const lista = this.getListaAtualizada(resp.data);

                this.setState({ aluno: initialState.aluno, lista });
                sendSuccessPopUp(`Método ${metodo} efetuado com sucesso!`);
            })
            .catch((err) => {
                console.dir(err);

                sendMultipleErrorPopUp(err)
            });
    }

    getListaAtualizada(aluno, add = true) {
        const lista = this.state.lista.filter((a) => a.id !== aluno.id);
        if (add) lista.unshift(aluno);
        return lista;
    }

    atualizaCampo(event) {
        //clonar usuário a partir do state, para não alterar o state diretamente
        const aluno = { ...this.state.aluno };
        //usar o atributo NAME do input identificar o campo a ser atualizado
        aluno[event.target.name] = event.target.value;
        //atualizar o state
        this.setState({ aluno });
    }

    atualizaCurso(event) {
        const aluno = { ...this.state.aluno };
        aluno.codCurso = Number(event.target.value);
        this.setState({ aluno })
    }

    carregar(aluno) {
        this.setState({ aluno });
    }

    remover(aluno) {
        const url = API_URL_ALUNO + "/" + aluno.id;
        if (!window.confirm("Confirma remoção do aluno: " + aluno.ra)) return;

        axios["delete"](url, aluno)
            .then((resp) => {
                const lista = this.getListaAtualizada(aluno, false);
                this.setState({ aluno: initialState.aluno, lista });
                sendSuccessPopUp("Aluno removido com sucesso!");
            })
            .catch((err) => {
                console.dir(err);

                sendMultipleErrorPopUp(err)
            });
    }

    renderForm() {
        return (
            <div className="inclui-container">
                <label> RA: </label>
                <input
                    type="text"
                    id="ra"
                    placeholder="RA do aluno"
                    className="form-input ra"
                    name="ra"
                    value={this.state.aluno.ra}
                    onChange={(e) => this.atualizaCampo(e)}
                />
                <label> Nome: </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome do aluno"
                    className="form-input"
                    name="nome"
                    value={this.state.aluno.nome}
                    onChange={(e) => this.atualizaCampo(e)}
                />
                <label> Curso: </label>
                <select name="codCurso" onChange={e => { this.atualizaCurso(e)}}>
                    {this.state.listaCurso.map(
                        (curso) =>
                             <option
                                name="codCurso"
                                value={curso.codCurso}
                                >
                                { curso.nomeCurso }
                                -
                                { curso.periodo }
                            </option>

                    )}
                </select>
                <br/>
                <button
                    className="btn btnSalvar"
                    onClick={(e) => this.salvar(e)}
                >
                    Salvar
                </button>
                <button
                    className="btn btnCancelar"
                    onClick={(e) => this.limpar(e)}
                >
                    Cancelar
                </button>
            </div>
        );
    }

    renderTable() {
        return (
            <div className="listagem">
                <table className="listaAlunos styled-table" id="tblListaAlunos">
                    <thead>
                        <tr className="cabecTabela title">
                            <th className="tabTituloRa">Ra</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloCurso">Curso</th>
                            <th className="tabTituloAcoes title">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(this.state.lista) ? this.state.lista.map((aluno) => (
                            <tr key={aluno.id}>
                                <td>{aluno.ra}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.codCurso}</td>
                                <td className="td-buttons">
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => this.carregar(aluno)}
                                    >
                                        <BsFillPencilFill /> Alterar
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => this.remover(aluno)}
                                    >
                                        <BsFillTrash2Fill /> Excluir
                                    </button>
                                </td>
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <Main title={title}>
                {this.renderForm()}
                {this.renderTable()}
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
}

