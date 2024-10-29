'use client'
import { useState, useEffect } from 'react'
import Axios from "axios";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function CadastroEstudante() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        rg: '',
        senha: '',
        rua: '',
        cidade: '',
        estado: '',
        pais: '',
        instituicao: '',
        curso: ''
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [instituicoes, setInstituicoes] = useState<{ id: string, nome: string }[]>([])
    const [cursos, setCursos] = useState<{ id: string, nome: string, instituicao: number }[]>([])
    const [schoolCursos, setSchoolCursos] = useState<{ id: string, nome: string, instituicao: number }[]>([])


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
            case 'rua':
                if (!value) error = 'Endereço é obrigatório.'
                break
            case 'cidade':
                if (!value) error = 'Endereço é obrigatório.'
                break
            case 'estado':
                if (!value) error = 'Endereço é obrigatório.'
                break
            case 'pais':
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

    const handleInstitutionChange = (key: string) => {
        console.log(key)
        setFormData(prevData => ({ ...prevData, instituicao: key }))
        const filteredCursos = cursos.filter((e) => e.instituicao === Number(key));
        console.log(filteredCursos)
        setSchoolCursos(filteredCursos)
        validateField('instituicao', key)
    }

    const handleCourseChange = (key: string) => {
        setFormData(prevData => ({ ...prevData, curso: key }))
        validateField('curso', key)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formIsValid = Object.values(errors).every(error => error === '') &&
            Object.values(formData).every(value => value !== '')
        if (formIsValid) {
            console.log('Formulário enviado:', formData)

            const response = await Axios.post("http://localhost:3001/endereco/", {
                rua: formData.rua,
                cidade: formData.cidade,
                estado: formData.estado,
                pais: formData.pais,
            });

            // Obtém o id do endereço retornado pela API
            const idEndereco = response.data.id;
            console.log("id endereço:", idEndereco);

            await Axios.post("http://localhost:3001/alunos/", {
                CPF: formData.cpf,
                nome: formData.nome,
                email: formData.email,
                RG: formData.rg,
                endereco: Number(idEndereco),
                instituicao: Number(formData.instituicao),
                curso: Number(formData.curso),
                moedas: 0,
            })
                .then(() => {
                    alert("aluno registrado com sucesso")
                    console.log("id do endereço", idEndereco)
                })
                .catch((error) => {
                    console.error("Erro ao registrar o aluno", error);
                    alert("Erro ao registrar o cadastro");
                });






        } else {
            console.log('Existem erros no formulário.')
        }
    }


    async function fetchSchools() {
        try {
            const response = await Axios.get("http://localhost:3001/instituicao/all");
            setInstituicoes(response.data)
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchCourses() {
        try {
            const response = await Axios.get("http://localhost:3001/cursos/all");
            setCursos(response.data)
        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => {
        fetchSchools()
        fetchCourses()
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
                            <div className="space-y-1">
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
                            <div className="space-y-1">
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
                            <div className="space-y-1">
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
                            <div className="space-y-1">
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
                            <div className="space-y-1">
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
                            <div className="space-y-1">
                                <Label htmlFor="rua">Rua</Label>
                                <Input
                                    id="rua"
                                    name="rua"
                                    required
                                    placeholder="Digite sua rua"
                                    onChange={handleInputChange}
                                />
                                {errors.rua && <p className="text-red-500 text-sm">{errors.rua}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <Label htmlFor="cidade">Cidade</Label>
                                <Input
                                    id="cidade"
                                    name="cidade"
                                    required
                                    placeholder="Digite sua cidade"
                                    onChange={handleInputChange}
                                />
                                {errors.cidade && <p className="text-red-500 text-sm">{errors.cidade}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="estado">Estado</Label>
                                <Input
                                    id="estado"
                                    name="estado"
                                    required
                                    placeholder="Digite seu estado"
                                    onChange={handleInputChange}
                                />
                                {errors.estado && <p className="text-red-500 text-sm">{errors.estado}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="pais">País</Label>
                                <Input
                                    id="pais"
                                    name="pais"
                                    required
                                    placeholder="Digite seu pais"
                                    onChange={handleInputChange}
                                />
                                {errors.pais && <p className="text-red-500 text-sm">{errors.pais}</p>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="instituicao">Instituição Educacional</Label>
                            <Select onValueChange={handleInstitutionChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma instituição" />
                                </SelectTrigger>
                                <SelectContent>
                                    {instituicoes.map((e) => (
                                        <SelectItem key={e.id} value={String(e.id)}>
                                            {e.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.instituicao && <p className="text-red-500 text-sm">{errors.instituicao}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="curso">Curso</Label>
                            <Select onValueChange={handleCourseChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {schoolCursos.map((e) => (
                                        <SelectItem key={e.id} value={String(e.id)}>
                                            {e.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
