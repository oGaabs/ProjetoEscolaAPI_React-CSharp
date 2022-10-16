import React, { useState, useEffect } from "react"
import axios from "axios"
import Header from "../template/Header"
import "./CrudCarometro.css"

const API_URL_ALUNOS = "http://localhost:5147/api/aluno"
const API_URL_CURSOS = "http://localhost:5147/api/curso"

const getRandomLetter = () => {
    return Math.random().toString(36).substring(2, 9);
}

export default function CrudCarometro(props) {
    const initialState = {
        curso: { id: 0, codCurso: "", nomeCurso: "", periodo: "" },
        listaAlunos: [],
        listaCursos: [],
    }

    const title = "Carômetro dos Alunos";
    const [listaAlunos, setListaAlunos] = useState(initialState.listaAlunos);
    const [listaCursos, setListaCursos] = useState(initialState.listaCursos);
    const [curso, setCurso] = useState(initialState.curso);

    useEffect(() => {
        axios(API_URL_CURSOS)
            .then((resp) => setListaCursos(resp.data))
            .catch((err) => {
                console.log(err);

                //sendMultipleErrorPopUp(err);
            });
    }, []);

    const atualizarListaAlunos = async (event) => {
        const codCurso = event.target.value;
        if (event.target.value === "") {
            setListaAlunos(initialState.listaAlunos);
            setCurso(initialState.curso);
            return
        }
        curso.codCurso = Number(codCurso)
        const listaDeAlunos = await getListaAlunosDoCurso(curso.codCurso)
        if(!Array.isArray(listaDeAlunos)) return

        setListaAlunos(listaDeAlunos)
        setCurso(curso)
    }

    const getListaAlunosDoCurso = async (codCurso) => {
        return await axios(API_URL_ALUNOS)
        .then((resp) => {
            const listaDeAlunos = resp.data;
            return listaDeAlunos.filter(
                (aluno) => aluno.codCurso === codCurso
            );
        })
        .catch((err) => {
            console.log(err);

            //sendMultipleErrorPopUp(err);
        });
    }

    const renderSelect = () => {
        return (
            <div className="select-container">
                <label> Curso: </label>
                <select className="selectCarometro" value={curso.codCurso}  onChange={e => { atualizarListaAlunos(e)}} required>
                    <option disabled={true} key="" value="">  -- Escolha um curso -- </option>
                    {listaCursos.map( (curso) =>
                            <option  key={curso.id} name="codCurso" value={curso.codCurso}>
                                { curso.codCurso } - { curso.nomeCurso } : { curso.periodo }
                            </option>
                    )}
                </select>
            </div>
        );
    };


    const renderCards = () =>(
        <div className="card-row">
            {Array.isArray(listaAlunos) && listaAlunos.length > 0 ?
            listaAlunos.map((aluno) => (
                <div key={aluno.id} className="card draw-border">
                    <img  className="card__image" src={`https://avatars.dicebear.com/api/big-smile/${getRandomLetter()}.svg`} alt={`Avatar de `+ aluno.nome}/>
                    <span className="card-title">{aluno.nome}</span>
                    <span className="card-description">RA: {aluno.ra} | Curso: {aluno.codCurso}</span>
                </div>
            )) : null}
        </div>
    )

    return (
        <div className="container carometro">
            <Header title={title} />
            {renderSelect()}
            <main>
                <div className="card-container">
                    {renderCards()}
                </div>
            </main>
        </div>
    );
}
