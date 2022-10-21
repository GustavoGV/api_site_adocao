import mongoose from 'mongoose'
import schema from './schema.js'
import express from 'express' // enviar dados
import http from 'http'
import {Server} from 'socket.io' //websocket (conexão http que persiste)

const app = express()
const server = http.createServer(app)

const sockets = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let Usuario = schema.usuarios

let usersOnline = []


mongoose.connect('mongodb://localhost/aluno_teste') //conexão com o banco de dados

mongoose.connection
    .once('open', () => console.log('Conexao com MongoDB (banco de dados) foi estabelecida com sucesso'))
    .on('error', (error) => {
        console.warn('Falha ao se conectar com o banco de dados. Motivo: ', error)
    })

app.use(express.static('public'))//torna pública a pasta 'public2' para quem tiver acesso ao "port" exposto pelo server

sockets.on('connection', async (socket) => {
    console.log('new user connected ' + socket.id)
    socket.on('disconnect', async () => {
        console.log(` <=> Cooperativa OFF. socket.id: ${socket.id}`)
        
    })

    socket.on('cadastro', async ({nome, sobrenome, cpf, celular, rua, bairro, numero_residencia, raca}) => {

        let faltaInfo = 0
        let infosFaltando = []
        let index = -1
        let items = ['nome', 'sobrenome', 'cpf', 'celular', 'rua', 'bairro', 'numero_residencia', 'raca']
        let params = [nome, sobrenome, cpf, celular, rua, bairro, numero_residencia, raca]
        params.forEach((param) => {
            index = index + 1
            if (param) {
                if (param.length) {

                }
                else {
                    faltaInfo = 1
                    infosFaltando.push(items[index])
                }

            }
            else{
                faltaInfo = 1
                infosFaltando.push(items[index])
            }
        })
        if (faltaInfo) {
            let msg = infosFaltando.toString() + ' estão faltando no cadastro'
            socket.emit('respostaCadastro', msg)
        }
        else{
        let newCadastro = new Usuario({
            nome: nome,
            sobrenome: sobrenome,
            cpf: cpf,
            celular: celular,
            rua: rua,
            bairro: bairro,
            numero_residencia: numero_residencia,
            raca: raca
          })
          
          await newCadastro.save()
          console.log('salvou')
          socket.emit('respostaCadastro', 'Cadastro realizado com sucesso')
        }

    })
    

})

server.listen(3000, () => {
    console.log(`--> Server escutando porta: 3000`)
})