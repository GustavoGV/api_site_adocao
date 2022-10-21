import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const usuario = new Schema({ //schema do banco de dados
    nome: String,
    cpf: String,
    celular: String,
    rua: String,
    bairro: String,
    numero_residencia: Number,
    obeservacao_residencia: String,
    animais_desejados: [String]
})

const Usuarios = mongoose.model('usuarios', usuario)

let estrutura  = {usuarios: Usuarios}

export default estrutura

