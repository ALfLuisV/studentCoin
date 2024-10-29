'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Dados fictícios para alunos
const alunos = [
    { id: '1', nome: 'Alice Silva' },
    { id: '2', nome: 'Bob Santos' },
    { id: '3', nome: 'Carol Oliveira' },
]

interface HistoricoEnvio {
    aluno: string;
    quantidade: number;
    descricao: string;
    data: string;
}

export default function PainelProfessor() {
    const [nomeProfessor] = useState('Maria Souza')
    const [moedas, setMoedas] = useState(1000)
    const [alunoSelecionado, setAlunoSelecionado] = useState<typeof alunos[0] | null>(null)
    const [valorEnvio, setValorEnvio] = useState('')
    const [descricao, setDescricao] = useState('')
    const [historicoEnvio, setHistoricoEnvio] = useState<HistoricoEnvio[]>([])

    const handleSelectAluno = (aluno: typeof alunos[0]) => {
        setAlunoSelecionado(aluno)
    }

    const handleEnviarMoedas = () => {
        const quantidade = parseInt(valorEnvio, 10)
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

        // Deduzindo as moedas e adicionando ao histórico
        setMoedas(prevMoedas => prevMoedas - quantidade)
        const novoHistoricoEnvio: HistoricoEnvio = {
            aluno: alunoSelecionado.nome,
            quantidade,
            descricao,
            data: new Date().toLocaleString(),
        }
        setHistoricoEnvio(prev => [novoHistoricoEnvio, ...prev])

        // Resetando o formulário
        setAlunoSelecionado(null)
        setValorEnvio('')
        setDescricao('')
        alert(`Moedas enviadas para ${alunoSelecionado.nome} com sucesso!`)
    }

    return (
        <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
            <Card className="w-full h-full">
                <CardHeader className="border-b-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Bem-vindo(a), {nomeProfessor}</CardTitle>
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
                                            onChange={(e) => setValorEnvio(e.target.value)}
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
                                                    <span className="font-medium">{item.aluno}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.quantidade} moedas</span>
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
