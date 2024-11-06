'use client'

import { useState, useEffect } from 'react'
import Axios from "axios";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// // Dados fictícios para alunos
// const alunos = [
//     { id: '1', nome: 'Alice Silva' },
//     { id: '2', nome: 'Bob Santos' },
//     { id: '3', nome: 'Carol Oliveira' },
// ]

interface HistoricoEnvio {
    aluno_nome: string;
    valor: number;
    descricao: string;
    data: string;
    professor_nome: string;
}

interface Professor {
    id: number;
    nome: string;
    cpf: string;
    departamento: string;
    instituicao: number;
    moedas: number;
}


interface Student {
    id: string;
    nome: string;
}

export default function PainelProfessor() {
    const [professor, setProfessor] = useState<Professor>({ id: 0, nome: '', cpf: '', departamento: '', instituicao: 0, moedas: 0 })
    const [idProfessorLogado, setIdProfessorLogado] = useState(1) //quandp o login for realizado, esta variavel deve armazenar o id do professor 
    const [alunos, setAlunos] = useState<{ id: string, nome: string }[]>([])
    const [moedas, setMoedas] = useState(0)
    const [alunoSelecionado, setAlunoSelecionado] = useState<typeof alunos[0] | null>(null)
    const [valorEnvio, setValorEnvio] = useState(0)
    const [descricao, setDescricao] = useState('')
    const [historicoEnvio, setHistoricoEnvio] = useState<HistoricoEnvio[]>([])

    const handleSelectAluno = (aluno: typeof alunos[0]) => {
        setAlunoSelecionado(aluno)
    }

    async function handleEnviarMoedas() {
        const quantidade = valorEnvio
        if (isNaN(quantidade) || quantidade <= 0 || quantidade > moedas) {
            alert('Por favor, insira um valor válido de moedas para enviar.')
            return
        }
        if (!alunoSelecionado) {
            alert('Por favor, selecione um aluno.')
            return
        }
        if (!descricao.trim()) {
            alert('Por favor, adicione uma descrição.')
            return
        }

        if (valorEnvio > professor?.moedas) {
            alert('Moedas insuficientes!!')
            return
        }


        // Deduzindo as moedas e adicionando ao histórico
        setMoedas(prevMoedas => prevMoedas - quantidade)
        // const novoHistoricoEnvio: HistoricoEnvio = {
        //     aluno_nome: alunoSelecionado.nome,
        //     valor: valorEnvio,
        //     descricao,
        //     data: new Date().toLocaleString(),
        //     professor_nome: professor.nome
        // }
        // setHistoricoEnvio(prev => [novoHistoricoEnvio, ...prev])

        try {
            try {
                //requisição para registrar a transação
                const response = await Axios.post("http://localhost:3001/transacao/", {
                    prof: professor?.id,
                    aluno: alunoSelecionado.id,
                    valor: valorEnvio,
                    date: new Date().toLocaleString(),
                    desc: descricao,
                });
            } catch (e) {
                console.log("Erro ao salvar transação")
            }
            try {
                //requisição para enviar as moedas pro saldo do aluno
                const insertCoins = await Axios.put(`http://localhost:3001/alunos/insert/${alunoSelecionado.id}`, {
                    value: valorEnvio,
                });
            } catch (e) {
                console.log("Erro ao inserir moedas no saldo do aluno")
            }
            try {
                //requisição para descontar as moedas do saldo do professor
                const reduceCoins = await Axios.put(`http://localhost:3001/professor/send/${professor?.id}`, {
                    value: valorEnvio,
                });
            } catch (e) {
                console.log("Erro ao descontar moedas da transação")
            }

            fetchTransactions()
            fetchProfessorInfo()

            console.log(alunoSelecionado)
            console.log(valorEnvio)
            console.log(descricao)
            // // Resetando o formulário
            setAlunoSelecionado(null)
            setValorEnvio(0)
            setDescricao('')
            alert(`Moedas enviadas para ${alunoSelecionado.nome} com sucesso!`)
        } catch (e) {
            alert("Erro ao enviar moedas")
        }
    }

    async function fetchProfessorInfo() {
        try{
            const response = await Axios.get(`http://localhost:3001/professor/get/${idProfessorLogado}`)
            setProfessor(response.data)
        }catch(e){
            console.log("Erro ao carregar informações do professor")
        }
    }

    async function fetchStudents() {
        try {
            const response = await Axios.get("http://localhost:3001/alunos/all");
            createStudentArray(response.data)
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchTransactions() {
        if (professor.id != 0) {
            try {
                const response = await Axios.get(`http://localhost:3001/transacao/professores/${professor.id}`);
                console.log(response.data)
                setHistoricoEnvio(tratarArrayDeTransacao(response.data).sort(ordenarPorData))
            } catch (e) {
                alert("Impossivel buscar transações no momento")
            }
        }
    }

    function tratarArrayDeTransacao(array: any[]) {
     array.map((element) => {
            const data = new Date(element.data);
            
            element.data = data.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
        console.log(element)
        });
        return array;
    }


    function createStudentArray(array: { CPF: string; nome: string }[]): Student[] {
        let studentArray: Student[] = [];
        for (const e of array) {
            let line: Student = { id: e.CPF, nome: e.nome };
            studentArray.push(line);
        }
        setAlunos(studentArray);
        return studentArray;
    }



    function ordenarPorData(a: { data: string; }, b: { data: string; }) {
        return a.data.localeCompare(b.data);
    }




    useEffect(() => {
        console.log(professor)
        fetchTransactions()
        setMoedas(professor.moedas)
    }, [professor]);


    useEffect(() => {
        fetchStudents()
        fetchProfessorInfo()
    }, []);
    return (
        <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
            <Card className="w-full h-full">
                <CardHeader className="border-b-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Bem-vindo(a), {professor?.nome}</CardTitle>
                        <div className="text-xl font-mono">
                            Moedas: <span className="text-xl font-bold">{moedas}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <div>
                            <h2 className="text-xl font-medium mb-2">Alunos Disponíveis</h2>
                            <ScrollArea className="h-[calc(100vh-200px)] border rounded-md">
                                {alunos.map(aluno => (
                                    <div
                                        key={aluno.id}
                                        className={`p-2 cursor-pointer transition-colors ${alunoSelecionado?.id === aluno.id
                                            ? 'bg-primary/10 dark:bg-primary/20'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        onClick={() => handleSelectAluno(aluno)}
                                    >
                                        <div className="font-medium">{aluno.nome}</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-medium mb-2">Enviar Moedas</h2>
                                {alunoSelecionado ? (
                                    <div className="space-y-2 p-4 border rounded-md">
                                        <p className="font-medium">Aluno: {alunoSelecionado.nome}</p>
                                        <input
                                            type="number"
                                            placeholder="Quantidade de moedas"
                                            className="w-full border rounded-md p-2"
                                            value={valorEnvio}
                                            onChange={(e) => {
                                                setValorEnvio(parseInt(e.target.value, 10))
                                            }}
                                        />
                                        <textarea
                                            placeholder="Motivo do envio de moedas"
                                            className="w-full border rounded-md p-2"
                                            value={descricao}
                                            onChange={(e) => setDescricao(e.target.value)}
                                        />
                                        <Button className="w-full" onClick={handleEnviarMoedas}>
                                            Enviar Moedas
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Selecione um aluno para enviar moedas.</p>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-medium mb-2">Histórico de Envios</h2>
                                <ScrollArea className="h-[430px] border rounded-md">
                                    {historicoEnvio.length > 0 ? (
                                        historicoEnvio.map((item, index) => (
                                            <div key={index} className="p-2 border-b last:border-b-0">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{item.aluno_nome}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.valor} moedas</span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Descrição: {item.descricao}</p>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    Enviado em: {item.data}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="p-2 text-sm text-gray-500 dark:text-gray-400">Nenhum envio realizado.</p>
                                    )}
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
