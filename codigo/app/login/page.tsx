'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [mostrarSenha, setMostrarSenha] = useState(false)

    const validarCampo = (nome: string, valor: string) => {
        let erro = ''
        switch (nome) {
            case 'email':
                if (!valor) {
                    erro = 'Email é obrigatório.'
                } else if (!/\S+@\S+\.\S+/.test(valor)) {
                    erro = 'Formato de email inválido.'
                }
                break
            case 'senha':
                if (!valor) erro = 'Senha é obrigatória.'
                break
            default:
                break
        }
        setErrors(prevErrors => ({ ...prevErrors, [nome]: erro }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
        validarCampo(name, value)
    }

    const togglePasswordVisibility = () => {
        setMostrarSenha(!mostrarSenha)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formIsValid = Object.values(errors).every(error => error === '') &&
            Object.values(formData).every(value => value !== '')
        if (formIsValid) {
            console.log('Tentativa de login:', formData)
            // Adicione sua lógica de login aqui
        } else {
            console.log('Há erros no formulário.')
        }
    }

    return (
        <div className="containerr">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Digite suas credenciais para acessar o Sistema de Mérito</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Label htmlFor="senha">Senha</Label>
                            <div className="relative">
                                <Input
                                    id="senha"
                                    name="senha"
                                    type={mostrarSenha ? "text" : "password"}
                                    required
                                    placeholder="Digite sua senha"
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {mostrarSenha ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.senha && <p className="text-red-500 text-sm">{errors.senha}</p>}
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" onClick={handleSubmit}>
                        Entrar
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}