'use client'
import { useState, useEffect } from 'react'
import Axios from "axios";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados fictícios para instituições de ensino pré-registradas
const instituicoesEducacionais = [
    { id: 1, name: "Universidade de Exemplo" },
    { id: 2, name: "Faculdade de Mérito" },
    { id: 3, name: "Instituto de Excelência" },
]

export default function CadastroEstudante() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        rg: '',
        senha: '',
        endereco: '',
        instituicao: '',
        curso: ''
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const validateField = (name: string, value: string) => {
        let error = ''
        switch (name) {
            case 'nome':
                if (!value) error = 'Nome é obrigatório.'
                break
            case 'email':
                if (!value) {
                    error = 'Email é obrigatório.'
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Email inválido.'
                }
                break
            case 'cpf':
                if (!value) {
                    error = 'CPF é obrigatório.'
                } else if (!/^\d{11}$/.test(value)) {
                    error = 'CPF deve conter 11 dígitos numéricos.'
                }
                break
            case 'rg':
                if (!value) error = 'RG é obrigatório.'
                break
            case 'senha':
                if (!value) error = 'Senha é obrigatória.'
                break
            case 'endereco':
                if (!value) error = 'Endereço é obrigatório.'
                break
            case 'instituicao':
                if (!value) error = 'Selecione uma instituição.'
                break
            case 'curso':
                if (!value) error = 'Curso é obrigatório.'
                break
            default:
                break
        }
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
        validateField(name, value)
    }

    const handleInstitutionChange = (value: string) => {
        setFormData(prevData => ({ ...prevData, instituicao: value }))
        validateField('instituicao', value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formIsValid = Object.values(errors).every(error => error === '') &&
            Object.values(formData).every(value => value !== '')
        if (formIsValid) {
            console.log('Formulário enviado:', formData)
            // Adicione sua lógica de envio aqui
        } else {
            console.log('Existem erros no formulário.')
        }
    }


    async function fetchStudents() {
        try {
          const response = await Axios.get("http://localhost:3001/alunos/all");
          console.log(response.data)
        } catch (e) {
          console.log(e);
        }
      }



    useEffect(() => {
        fetchStudents()
      }, []);
    return (
        <div className='containerr'>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className='text-center'>
                    <CardTitle className='text-3xl font-bold'>Cadastro de Estudante</CardTitle>
                    <CardDescription>Cadastre-se abaixo</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    required
                                    placeholder="Digite seu nome completo"
                                    onChange={handleInputChange}
                                />
                                {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Digite seu email"
                                    onChange={handleInputChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    name="cpf"
                                    required
                                    placeholder="Digite seu CPF"
                                    onChange={handleInputChange}
                                />
                                {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rg">RG</Label>
                                <Input
                                    id="rg"
                                    name="rg"
                                    required
                                    placeholder="Digite seu RG"
                                    onChange={handleInputChange}
                                />
                                {errors.rg && <p className="text-red-500 text-sm">{errors.rg}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="senha">Senha</Label>
                                <Input
                                    id="senha"
                                    name="senha"
                                    type="password"
                                    required
                                    placeholder="Digite sua senha"
                                    onChange={handleInputChange}
                                />
                                {errors.senha && <p className="text-red-500 text-sm">{errors.senha}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input
                                    id="endereco"
                                    name="endereco"
                                    required
                                    placeholder="Digite seu endereço"
                                    onChange={handleInputChange}
                                />
                                {errors.endereco && <p className="text-red-500 text-sm">{errors.endereco}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instituicao">Instituição Educacional</Label>
                            <Select onValueChange={handleInstitutionChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma instituição" />
                                </SelectTrigger>
                                <SelectContent>
                                    {instituicoesEducacionais.map((instituicao) => (
                                        <SelectItem key={instituicao.id} value={instituicao.name}>
                                            {instituicao.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.instituicao && <p className="text-red-500 text-sm">{errors.instituicao}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="curso">Curso</Label>
                            <Input
                                id="curso"
                                name="curso"
                                required
                                placeholder="Digite o curso"
                                onChange={handleInputChange}
                            />
                            {errors.curso && <p className="text-red-500 text-sm">{errors.curso}</p>}
                        </div>
                        <CardFooter>
                            <Button type="submit" className="w-full">Registrar</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
