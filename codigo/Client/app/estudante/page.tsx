'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for advantages
const advantages = [
    { id: '1', name: 'Desconto no RU', description: 'Desconto de 50% no Restaurante Universitário', value: 100 },
    { id: '2', name: 'Desconto na mensalidade', description: '10% de desconto na próxima mensalidade', value: 500 },
    { id: '3', name: 'Material escolar', description: 'Kit de material escolar gratuito', value: 200 },
    { id: '4', name: 'Curso extra', description: 'Curso extracurricular gratuito', value: 300 },
]

interface RedeemedBenefit {
    id: string;
    name: string;
    value: number;
    redeemedAt: Date;
}

export default function StudentDashboard() {
    const [studentName] = useState('João Silva')
    const [coins, setCoins] = useState(1000)
    const [selectedAdvantage, setSelectedAdvantage] = useState<typeof advantages[0] | null>(null)
    const [redeemedBenefits, setRedeemedBenefits] = useState<RedeemedBenefit[]>([])

    const handleSelectAdvantage = (advantage: typeof advantages[0]) => {
        setSelectedAdvantage(advantage)
    }

    const handleRedeemAdvantage = () => {
        if (selectedAdvantage && coins >= selectedAdvantage.value) {
            setCoins(prevCoins => prevCoins - selectedAdvantage.value)
            const newRedeemedBenefit: RedeemedBenefit = {
                id: selectedAdvantage.id,
                name: selectedAdvantage.name,
                value: selectedAdvantage.value,
                redeemedAt: new Date()
            }
            setRedeemedBenefits(prev => [...prev, newRedeemedBenefit])
            alert(`Vantagem "${selectedAdvantage.name}" resgatada com sucesso!`)
            setSelectedAdvantage(null)
        } else {
            alert('Moedas insuficientes para resgatar esta vantagem.')
        }
    }

    return (
        <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
            <Card className="w-full h-full">
                <CardHeader className="border-b-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Olá, {studentName}</CardTitle>
                        <div className="text-xl font-mono">
                            Moedas: <span className="text-xl font-bold">{coins}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <div>
                            <h2 className="text-xl font-medium mb-2">Vantagens Disponíveis</h2>
                            <ScrollArea className="h-[calc(100vh-200px)] border rounded-md">
                                {advantages.map(advantage => (
                                    <div
                                        key={advantage.id}
                                        className={`p-2 cursor-pointer transition-colors ${selectedAdvantage?.id === advantage.id
                                            ? 'bg-primary/10 dark:bg-primary/20'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        onClick={() => handleSelectAdvantage(advantage)}
                                    >
                                        <div className="font-medium">{advantage.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{advantage.value} moedas</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-medium mb-2">Detalhes da Vantagem</h2>
                                {selectedAdvantage ? (
                                    <div className="space-y-2 p-4 border rounded-md">
                                        <h4 className="font-medium">{selectedAdvantage.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAdvantage.description}</p>
                                        <p className="text-sm">Valor: <span className="font-semibold">{selectedAdvantage.value} moedas</span></p>
                                        <Button className="w-full" onClick={handleRedeemAdvantage}>
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
                                    {redeemedBenefits.length > 0 ? (
                                        redeemedBenefits.map((benefit, index) => (
                                            <div key={index} className="p-2 border-b last:border-b-0">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{benefit.name}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{benefit.value} moedas</span>
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    Resgatado em: {benefit.redeemedAt.toLocaleDateString()}
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