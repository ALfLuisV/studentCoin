'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for students
const students = [
    { id: '1', name: 'Alice Silva' },
    { id: '2', name: 'Bob Santos' },
    { id: '3', name: 'Carol Oliveira' },
]

interface SendHistory {
    student: string;
    amount: number;
    description: string;
    date: string;
}

export default function TeacherDashboard() {
    const [teacherName] = useState('Maria Souza')
    const [coins, setCoins] = useState(1000)
    const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)
    const [sendValue, setSendValue] = useState('')
    const [description, setDescription] = useState('')
    const [sendHistory, setSendHistory] = useState<SendHistory[]>([])

    const handleSelectStudent = (student: typeof students[0]) => {
        setSelectedStudent(student)
    }

    const handleSendCoins = () => {
        const amount = parseInt(sendValue, 10)
        if (isNaN(amount) || amount <= 0 || amount > coins) {
            alert('Por favor, insira um valor válido de moedas para enviar.')
            return
        }
        if (!selectedStudent) {
            alert('Por favor, selecione um aluno.')
            return
        }
        if (!description.trim()) {
            alert('Por favor, adicione uma descrição.')
            return
        }

        // Deduzindo as moedas e adicionando ao histórico
        setCoins(prevCoins => prevCoins - amount)
        const newSendHistory: SendHistory = {
            student: selectedStudent.name,
            amount,
            description,
            date: new Date().toLocaleString(),
        }
        setSendHistory(prev => [newSendHistory, ...prev])

        // Resetando o formulário
        setSelectedStudent(null)
        setSendValue('')
        setDescription('')
        alert(`Moedas enviadas para ${selectedStudent.name} com sucesso!`)
    }

    return (
        <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
            <Card className="w-full h-full">
                <CardHeader className="border-b-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Bem-vindo(a), {teacherName}</CardTitle>
                        <div className="text-xl font-mono">
                            Moedas: <span className="text-xl font-bold">{coins}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <div>
                            <h2 className="text-xl font-medium mb-2">Alunos Disponíveis</h2>
                            <ScrollArea className="h-[calc(100vh-200px)] border rounded-md">
                                {students.map(student => (
                                    <div
                                        key={student.id}
                                        className={`p-2 cursor-pointer transition-colors ${selectedStudent?.id === student.id
                                            ? 'bg-primary/10 dark:bg-primary/20'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        onClick={() => handleSelectStudent(student)}
                                    >
                                        <div className="font-medium">{student.name}</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-medium mb-2">Enviar Moedas</h2>
                                {selectedStudent ? (
                                    <div className="space-y-2 p-4 border rounded-md">
                                        <p className="font-medium">Aluno: {selectedStudent.name}</p>
                                        <input
                                            type="number"
                                            placeholder="Quantidade de moedas"
                                            className="w-full border rounded-md p-2"
                                            value={sendValue}
                                            onChange={(e) => setSendValue(e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Motivo do envio de moedas"
                                            className="w-full border rounded-md p-2"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <Button className="w-full" onClick={handleSendCoins}>
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
                                    {sendHistory.length > 0 ? (
                                        sendHistory.map((item, index) => (
                                            <div key={index} className="p-2 border-b last:border-b-0">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{item.student}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.amount} moedas</span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Descrição: {item.description}</p>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    Enviado em: {item.date}
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
