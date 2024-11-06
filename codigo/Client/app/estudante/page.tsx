'use client'
import Axios from "axios";
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import style from './student.module.css'


interface VantagemResgatada {
    vantagem_aluno: string;
    vantagem_cupom: String;
    vantagem_data: Date;
    vantagem_desc: string,
    vantagem_id: number;
    vantagem_nome: String,
    vavantagem_nomeempresa: String;
    vantagem_valor: Number;
}

interface vantagem {
    vantagem_nome: string;
    vantagem_id: number;
    vantagem_valor: number;
    vantagem_foto: any;
    vantagem_descricao: number;
    empresa_nome: string
}

interface aluno {
    cpf: string,
    nome: string,
    email: string,
    rg: string,
    moedas: number,
}

export default function PainelEstudante() {
    const [vantagemSelecionada, setVantagemSelecionada] = useState<typeof vantagens[0] | null>(null)
    const [vantagensResgatadas, setVantagensResgatadas] = useState<VantagemResgatada[]>([])
    const [vantagens, setVantagens] = useState<vantagem[]>([])
    const [idAlunoLogado, setIdAlunoLogado] = useState("90123456789") //quandp o login for realizado, esta variavel deve armazenar o id do aluno 
    const [alunoLogado, setAlunoLogado] = useState<aluno>()

    const handleSelectVantagem = (vantagem: typeof vantagens[0]) => {
        console.log(vantagem)
        setVantagemSelecionada(vantagem)
    }

    async function handleResgatarVantagem() {
        if (vantagemSelecionada && (alunoLogado?.moedas ?? 0) >= vantagemSelecionada.vantagem_valor) {
            try {
                console.log(alunoLogado?.cpf)
                const response = await Axios.post("http://localhost:3001/resgate/", {
                    aluno: alunoLogado?.cpf,
                    vantagem: vantagemSelecionada.vantagem_id,
                    data: new Date().toLocaleString(),
                    valor: vantagemSelecionada.vantagem_valor,
                    cupom: String(gerarCodigo()),
                });
            } catch (error) {
                alert("Erro ao registrar resgate")

            }

            try {
                const insertCoins = await Axios.put(`http://localhost:3001/alunos/reduce/${alunoLogado?.cpf}`, {
                    value: vantagemSelecionada.vantagem_valor,
                });
            } catch (error) {
                alert("Erro ao descontar moedas da conta")
            }


            fetchStudentInfo()

            alert(`Vantagem "${vantagemSelecionada.vantagem_nome}" resgatada com sucesso!`)
            setVantagemSelecionada(null)
        } else {
            alert('Moedas insuficientes para resgatar esta vantagem.')
        }
    }


    async function fetchVantagens() {
        try {
            const vantagens = await Axios.get("http://localhost:3001/vantagem/all")
            setVantagens(vantagens.data)
        } catch (error) {
            alert("Impossivel buscar as vantagens")
        }
    }


    async function fetchVantagensResgatadas() {
        if (alunoLogado?.cpf) {
            try {
                const vantagensObtidas = await Axios.get(`http://localhost:3001/resgate/get/${alunoLogado?.cpf}`)
                setVantagensResgatadas(vantagensObtidas.data)
            } catch (error) {
                alert("Erro ao recuperar vantagens obtidas")
            }
        }
    }


    async function fetchStudentInfo() {
        try {
            const aluno = await Axios.get(`http://localhost:3001/alunos/get/${idAlunoLogado}`)
            setAlunoLogado(aluno.data)
        } catch (error) {
            alert("Impossivel buscar informações do estudante")
        }
    }


    function gerarCodigo() {
        return Math.floor(Math.random() * (1000000000 - 0 + 1) + 0);
    }

    useEffect(() => {
        fetchVantagensResgatadas()
    }, [alunoLogado]);

    useEffect(() => {
        fetchVantagens()
        fetchStudentInfo()
    }, []);
    return (
        <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
            <Card className="w-full h-full">
                <CardHeader className="border-b-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Olá, {alunoLogado?.nome}</CardTitle>
                        <div className="text-xl font-mono">
                            Moedas: <span className="text-xl font-bold">{alunoLogado?.moedas}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <div>
                            <h2 className="text-xl font-medium mb-2">Vantagens Disponíveis</h2>
                            <ScrollArea className="h-[calc(100vh-200px)] border rounded-md">
                                {vantagens.map(vantagem => (
                                    <div
                                        key={vantagem.vantagem_id}
                                        className={`p-2 cursor-pointer transition-colors ${vantagemSelecionada?.vantagem_id === vantagem.vantagem_id
                                            ? 'bg-primary/10 dark:bg-primary/20'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        onClick={() => handleSelectVantagem(vantagem)}
                                    >
                                        <div className={style.nomeVantagem}>
                                            <div className="font-medium">{vantagem.vantagem_nome}</div>
                                            <div className="font-small">{vantagem.empresa_nome}</div>
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{vantagem.vantagem_valor} moedas</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-medium mb-2">Detalhes da Vantagem</h2>
                                {vantagemSelecionada ? (
                                    <div className="space-y-2 p-4 border rounded-md">
                                        <h4 className="font-medium">{vantagemSelecionada.vantagem_nome}</h4>
                                        <span className="font-small">{vantagemSelecionada.empresa_nome}</span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{vantagemSelecionada.vantagem_descricao}</p>
                                        <p className="text-sm">Valor: <span className="font-semibold">{vantagemSelecionada.vantagem_valor} moedas</span></p>
                                        <Button className="w-full" onClick={handleResgatarVantagem}>
                                            Resgatar Vantagem
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Selecione uma vantagem para ver os detalhes.</p>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-medium mb-2">Vantagens Resgatadas</h2>
                                <ScrollArea className="h-[500px] border rounded-md">
                                    {vantagensResgatadas.length > 0 ? (
                                        vantagensResgatadas.map((vantagem, index) => (
                                            <div key={index} className="p-2 border-b last:border-b-0">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{vantagem.vantagem_nome}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{vantagem.vantagem_valor.toString()} moedas</span>
                                                </div>
                                                <div>
                                                    <span className="font-small">Cupom: {vantagem.vantagem_cupom}</span>
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    Resgatado em: {vantagem.vantagem_data.toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="p-2 text-sm text-gray-500 dark:text-gray-400">Você ainda não resgatou nenhuma vantagem.</p>
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