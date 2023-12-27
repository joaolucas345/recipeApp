import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4' 
import { Server } from "socket.io"
import { searchIngridients } from "../utils/searchIngridient"
import express from 'express'
import cors from 'cors'
import fs from 'fs'

const typeDefs = fs.readFileSync(`${__dirname}/../graphql/schemas.graphql`).toString()
const {resolvers} = require('../graphql/resolvers')

console.log("started")

const app = express()

app.use(cors({
    origin: "*"
}))

app.use(express.json())

const io = new Server({ cors: {origin:"*"}})
io.listen(3002)

io.on("connection", (socket) => {
    // console.log("new user connected", socket.connected)
    socket.on("type", (args) => {
        const ingridients = searchIngridients(args)
        socket.emit("ingridients", ingridients)
    })

})
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });



const main = async () => {
    await server.start()
    app.use('/graphql', expressMiddleware(server))
    app.listen(3001, () => console.log("server running"))
      
}

main()
