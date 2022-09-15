import React, { Component } from "react";
import axios from "axios";
import { BsFillPencilFill, BsFillTrash2Fill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
import "./CrudAluno.css";

import Main from "../template/Main";

const title = "Cadastro de Alunos";

const API_URL = "https://localhost:7229/api/aluno";
const initialState = {
    aluno: { id: 0, ra: "", nome: "", codCurso: 0 },
    lista: [],
};

export default class CrudAluno extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
    }

    componentDidMount() {
        axios(API_URL)
            .then((resp) => {
                this.setState({ lista: resp.data });
            })
            .catch((err) => {
                const errors = (err = err.response?.data?.errors
                    ? Object.values(err.response.data.errors)
                    : err);
                console.dir(err);

                errors.forEach((err) => {
                    this.sendErrorPopUp(
                        `Falha ao conectar ao banco de dados: \n ${err}`
                    );
                });
            });
    }

    limpar() {
        this.setState({ aluno: initialState.aluno });
    }

    salvar() {
        const aluno = this.state.aluno;
        aluno.codCurso = Number(aluno.codCurso);
        const metodo = aluno.id ? "put" : "post";
        const url = aluno.id ? `${API_URL}/${aluno.id}` : API_URL;

        axios[metodo](url, aluno)
            .then((resp) => {
                const lista = this.getListaAtualizada(resp.data);

                this.setState({ aluno: initialState.aluno, lista });
                this.sendSuccessPopUp(`Método ${metodo} efetuado com sucesso!`);
            })
            .catch((err) => {
                const errors = (err = err.response?.data?.errors
                    ? Object.values(err.response.data.errors)
                    : err);
                console.dir(err);

                errors.forEach((error) => {
                    this.sendErrorPopUp(
                        `Erro ao efetuar: ${metodo}:\n ${error}`
                    );
                });
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

    carregar(aluno) {
        this.setState({ aluno });
    }

    remover(aluno) {
        const url = API_URL + "/" + aluno.id;
        if (!window.confirm("Confirma remoção do aluno: " + aluno.ra)) return;

        axios["delete"](url, aluno)
            .then((resp) => {
                const lista = this.getListaAtualizada(aluno, false);
                this.setState({ aluno: initialState.aluno, lista });
                this.sendSuccessPopUp("Aluno removido com sucesso!");
            })
            .catch((err) => {
                const errors = (err = err.response?.data?.errors
                    ? Object.values(err.response.data.errors)
                    : err);
                console.dir(err);

                errors.forEach((error) => {
                    this.sendErrorPopUp(`Erro ao deletar: \n ${error}`);
                });
            });
    }

    sendSuccessPopUp(text) {
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

    sendErrorPopUp(text) {
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

    renderForm() {
        return (
            <div className="inclui-container">
                <label> RA: </label>
                <input
                    type="text"
                    id="ra"
                    placeholder="RA do aluno"
                    className="form-input"
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
                <label> Código do Curso: </label>
                <input
                    type="number"
                    id="codCurso"
                    placeholder="0"
                    className="form-input"
                    name="codCurso"
                    value={this.state.aluno.codCurso}
                    onChange={(e) => this.atualizaCampo(e)}
                />
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
                        {this.state.lista.map((aluno) => (
                            <tr key={aluno.id}>
                                <td>{aluno.ra}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.codCurso}</td>
                                <td>
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
                        ))}
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
}

