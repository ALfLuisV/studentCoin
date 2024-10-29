'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for students
const students = [
    { id: '1', name: 'Alice Silva' },
    { id: '2', name: 'Bob Santos' },
    { id: '3', name: 'Carol Oliveira' },
    { id: '4', name: 'David Lima' },
    { id: '5', name: 'Eva Pereira' },
]

export default function TeacherDashboard() {
    const [teacherName] = useState('Maria Souza')
    const [coins, setCoins] = useState(1000)
    const [selectedStudent, setSelectedStudent] = useState('')
    const [sendValue, setSendValue] = useState('')
    const [description, setDescription] = useState('')
    const [history, setHistory] = useState([])

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

        // Here you would typically send this data to your backend
        console.log('Enviando moedas:', { student: selectedStudent, amount, description })

        // Update the coin balance
        setCoins(prevCoins => prevCoins - amount)

        // Add to history
        const studentName = students.find(s => s.id === selectedStudent)?.name
        setHistory(prevHistory => [
            { student: studentName, amount, description, date: new Date().toLocaleString() },
            ...prevHistory
        ])

        // Reset the form
        setSelectedStudent('')
        setSendValue('')
        setDescription('')

        alert('Moedas enviadas com sucesso!')
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
                            <h2 className="text-xl font-semibold mb-4">Lista de Alunos</h2>
                            <ScrollArea className="h-[calc(100vh-240px)]">
                                {students.map(student => (
                                    <Button
                                        key={student.id}
                                        variant={selectedStudent === student.id ? "default" : "outline"}
                                        className="w-full justify-start mb-2"
                                        onClick={() => setSelectedStudent(student.id)}
                                    >
                                        {student.name}
                                    </Button>
                                ))}
                            </ScrollArea>
                        </div>
                        <div className="flex-1 px-4 border-l border-r">
                            <h2 className="text-xl font-semibold mb-4">Enviar Moedas</h2>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sendValue">Valor do Envio</Label>
                                    <Input
                                        id="sendValue"
                                        type="number"
                                        placeholder="Quantidade de moedas"
                                        value={sendValue}
                                        onChange={(e) => setSendValue(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Motivo do envio de moedas"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <Button type="button" className="w-full" onClick={handleSendCoins}>
                                    Enviar Moedas
                                </Button>
                            </form>
                        </div>
                        <div className="flex-1 pl-4">
                            <h2 className="text-xl font-semibold mb-4">Histórico de Envios</h2>
                            <ScrollArea className="h-[calc(100vh-240px)]">
                                {history.map((item, index) => (
                                    <Card key={index} className="mb-4 p-4">
                                        <p className="font-semibold">{item.student}</p>
                                        <p>Moedas: {item.amount}</p>
                                        <p>Descrição: {item.description}</p>
                                        <p className="text-sm text-gray-500">{item.date}</p>
                                    </Card>
                                ))}
                            </ScrollArea>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}