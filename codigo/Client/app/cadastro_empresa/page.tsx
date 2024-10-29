'use client'

import { useState, useEffect } from 'react'
import Axios from "axios";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, X } from 'lucide-react'

interface Vantagem {
    nome: string;
    descricao: string;
    custo: number;
    foto: File | null;
}

export default function CadastroEmpresa() {
    const [formData, setFormData] = useState({
        nomeEmpresa: '',
        email: '',
        cnpj: '',
        senha: '',
    })
    const [vantagens, setVantagens] = useState<Vantagem[]>([])
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const validateField = (name: string, value: string) => {
        let error = ''
        switch (name) {
            case 'nomeEmpresa':
                if (!value) error = 'Nome da empresa é obrigatório.'
                break
            case 'email':
                if (!value) error = 'Email é obrigatório.'
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email inválido.'
                break
            case 'cnpj':
                if (!value) {
                    error = 'CNPJ é obrigatório.'
                } else if (!/^\d{14}$/.test(value)) {
                    error = 'CNPJ deve conter 14 dígitos numéricos.'
                }
                break
            case 'senha':
                if (!value) error = 'Senha é obrigatória.'
                else if (value.length < 8) error = 'A senha deve ter pelo menos 8 caracteres.'
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

    const handleAddVantagem = () => {
        setVantagens([...vantagens, { nome: '', descricao: '', custo: 0, foto: null }])
    }

    const handleVantagemChange = (index: number, field: keyof Vantagem, value: string | number | File | null) => {
        const newVantagens = [...vantagens]
        newVantagens[index] = { ...newVantagens[index], [field]: value }
        setVantagens(newVantagens)
    }

    const handleRemoveVantagem = (index: number) => {
        setVantagens(vantagens.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()
        const formIsValid = Object.values(errors).every(error => error === '') &&
            Object.values(formData).every(value => value !== '')
        if (formIsValid) {
            console.log('Formulário enviado:', { ...formData, vantagens })
            try{
                const response = await Axios.post("http://localhost:3001/empresas/", {
                    nome: formData.nomeEmpresa,
                    CNPJ: formData.cnpj,
                    email: formData.email,
                    senha: formData.senha,
                });
    
                // Obtém o id do endereço retornado pela API
                const idEmpresa = response.data.id;
            if(vantagens.length != 0){
                const requsition = await Axios.post("http://localhost:3001/vantagem/",{
                    id: idEmpresa,
                    ArrayVantagens: vantagens
                });
            }

            alert("Cadastro realizado com sucesso!!!!!!!!!")
            } catch(e){
                alert("Algo deu errado :(")
                console.log(e)
            }
            
        } else {
            console.log('Existem erros no formulário.')
        }
    }

    return (
        <div className='containerr'>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className='text-center'>
                    <CardTitle className='text-3xl font-bold'>Cadastro de Empresa</CardTitle>
                    <CardDescription>Cadastre sua empresa e adicione vantagens</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                                <Input
                                    id="nomeEmpresa"
                                    name="nomeEmpresa"
                                    required
                                    placeholder="Digite o nome da sua empresa"
                                    onChange={handleInputChange}
                                />
                                {errors.nomeEmpresa && <p className="text-red-500 text-sm">{errors.nomeEmpresa}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="Digite o email da empresa"
                                    onChange={handleInputChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                                id="cnpj"
                                name="cnpj"
                                required
                                placeholder="Digite o CNPJ"
                                onChange={handleInputChange}
                            />
                            {errors.cnpj && <p className="text-red-500 text-sm">{errors.cnpj}</p>}
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

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Vantagens</Label>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddVantagem}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Vantagem
                                </Button>
                            </div>
                            {vantagens.map((vantagem, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Label>Vantagem {index + 1}</Label>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveVantagem(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Nome da vantagem"
                                            value={vantagem.nome}
                                            onChange={(e) => handleVantagemChange(index, 'nome', e.target.value)}
                                        />
                                        <Textarea
                                            placeholder="Descrição da vantagem"
                                            value={vantagem.descricao}
                                            onChange={(e) => handleVantagemChange(index, 'descricao', e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Custo (em moedas)"
                                            value={vantagem.custo}
                                            onChange={(e) => handleVantagemChange(index, 'custo', Number(e.target.value))}
                                        />
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleVantagemChange(index, 'foto', e.target.files?.[0] || null)}
                                        />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" onClick={handleSubmit}>Registrar Empresa</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
