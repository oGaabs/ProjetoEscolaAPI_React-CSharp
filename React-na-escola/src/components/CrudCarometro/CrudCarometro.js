import React, { useState, useEffect } from "react"
import axios from "axios"
import Header from "../template/Header"
import "./CrudCarometro.css"

const API_URL_ALUNOS = "http://localhost:5147/api/aluno"
const API_URL_CURSOS = "http://localhost:5147/api/curso"

const avatarAleatorio = () => {
    // Gera um numero, converte para a base 36 e dps pega os 7 primeiros caracteres
    const codigo = Math.random().toString(36).substring(2, 9);
    const avatarUrl = `https://avatars.dicebear.com/api/big-smile/${codigo}.svg`

    return avatarUrl

}

export default function CrudCarometro() {
    const stateInicial = {
        curso: { id: 0, codCurso: "", nomeCurso: "", periodo: "" },
        listaAlunosCmt: [],
        listaDosCursos: [],
    }

    const titulo = "Carômetro dos Alunos";
    const [listaAlunosCmt, setAlunos] = useState(stateInicial.listaAlunosCmt);
    const [listaDosCursos, setCursos] = useState(stateInicial.listaDosCursos);
    const [curso, setCurso] = useState(stateInicial.curso);

    useEffect(() => {
        axios(API_URL_CURSOS)
            .then((resp) => setCursos(resp.data))
            .catch((err) => {
                console.log(err);
            });
    }, [curso]);

    const filtrarAlunosPorCurso = async (event) => {
        const codigoCurso = event.target.value;
        if (codigoCurso === "") {
            setAlunos(stateInicial.listaAlunosCmt);
            return
        }
        curso.codCurso = Number(codigoCurso)
        const listaDeAlunos = await getListaAlunosDoCurso(curso.codCurso)
        if(Array.isArray(listaDeAlunos)){
            setAlunos(listaDeAlunos)
            setCurso(curso)
        }
    }

    const getListaAlunosDoCurso = async (codCurso) => {
        return await axios(API_URL_ALUNOS)
        .then((resp) => {
            const listaDeAlunos = resp.data;
            return listaDeAlunos.filter(
                (aluno) => aluno.codCurso === codCurso
            )
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const renderSelect = () => {
        return (
            <div className="select-container">
                <label> Curso: </label>
                <select className="select-carometro" value={curso.codCurso}  onChange={e => { filtrarAlunosPorCurso(e)}} required>
                    <option key="" value="" disabled={true}>  -- Escolha um curso -- </option>
                    {listaDosCursos.map( (curso) =>
                            <option  key={curso.id} name="codCurso" value={curso.codCurso}>
                                { curso.codCurso } - { curso.nomeCurso } : { curso.periodo }
                            </option>
                    )}
                </select>
            </div>
        );
    };


    const renderCarometro = () =>(
        <div className="card-row">
            {listaAlunosCmt.length > 0 ?
            listaAlunosCmt.map((aluno) => (
                <div className="card draw-border" key={aluno.id} >
                    <img  className="card-img" src={avatarAleatorio()} alt={`Avatar: `+ aluno.nome}/>
                    <span className="card-title">{aluno.nome}</span>
                    <span className="card-description">RA: {aluno.ra} | Curso: {aluno.codCurso}</span>
                </div>
            )) : null}
        </div>
    )

    return (
        <div className="container carometro">
            <Header title={titulo} />
            {renderSelect()}
            <main>
                <div className="card-container">
                    {renderCarometro()}
                </div>
            </main>
        </div>
    );
}
