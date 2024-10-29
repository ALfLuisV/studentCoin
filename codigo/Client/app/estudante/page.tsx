'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Dados fictícios para vantagens
const vantagens = [
    { id: '1', name: 'Desconto no RU', description: 'Desconto de 50% no Restaurante Universitário', value: 100 },
    { id: '2', name: 'Desconto na mensalidade', description: '10% de desconto na próxima mensalidade', value: 500 },
    { id: '3', name: 'Material escolar', description: 'Kit de material escolar gratuito', value: 200 },
    { id: '4', name: 'Curso extra', description: 'Curso extracurricular gratuito', value: 300 },
]

interface VantagemResgatada {
    id: string;
    name: string;
    value: number;
    redeemedAt: Date;
}

export default function PainelEstudante() {
    const [nomeEstudante] = useState('João Silva')
    const [moedas, setMoedas] = useState(1000)
    const [vantagemSelecionada, setVantagemSelecionada] = useState<typeof vantagens[0] | null>(null)
    const [vantagensResgatadas, setVantagensResgatadas] = useState<VantagemResgatada[]>([])

    const handleSelectVantagem = (vantagem: typeof vantagens[0]) => {
        setVantagemSelecionada(vantagem)
    }

    const handleResgatarVantagem = () => {
        if (vantagemSelecionada && moedas >= vantagemSelecionada.value) {
            setMoedas(prevMoedas => prevMoedas - vantagemSelecionada.value)
            const novaVantagemResgatada: VantagemResgatada = {
                id: vantagemSelecionada.id,
                name: vantagemSelecionada.name,
                value: vantagemSelecionada.value,
                redeemedAt: new Date()
            }
            setVantagensResgatadas(prev => [...prev, novaVantagemResgatada])
            alert(`Vantagem "${vantagemSelecionada.name}" resgatada com sucesso!`)
            setVantagemSelecionada(null)
        } else {
            alert('Moedas insuficientes para resgatar esta vantagem.')
        }
    }

    return (
        <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
            <Card className="w-full h-full">
                <CardHeader className="border-b-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Olá, {nomeEstudante}</CardTitle>
                        <div className="text-xl font-mono">
                            Moedas: <span className="text-xl font-bold">{moedas}</span>
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
                                        key={vantagem.id}
                                        className={`p-2 cursor-pointer transition-colors ${vantagemSelecionada?.id === vantagem.id
                                            ? 'bg-primary/10 dark:bg-primary/20'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        onClick={() => handleSelectVantagem(vantagem)}
                                    >
                                        <div className="font-medium">{vantagem.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{vantagem.value} moedas</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-medium mb-2">Detalhes da Vantagem</h2>
                                {vantagemSelecionada ? (
                                    <div className="space-y-2 p-4 border rounded-md">
                                        <h4 className="font-medium">{vantagemSelecionada.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{vantagemSelecionada.description}</p>
                                        <p className="text-sm">Valor: <span className="font-semibold">{vantagemSelecionada.value} moedas</span></p>
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
                                                    <span className="font-medium">{vantagem.name}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{vantagem.value} moedas</span>
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    Resgatado em: {vantagem.redeemedAt.toLocaleDateString()}
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