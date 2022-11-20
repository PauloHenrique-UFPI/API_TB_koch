const express = require('express')

const { Pool } = require('pg')

const bcrypt = require('bcrypt')
 
require('dotenv').config()

const PORT = 3333

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

const app = express()

app.use(express.json())

// ROTAS DA TABELA 'ubs'

app.get('/ubs', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM ubs')
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/ubs', async (req, res) => {

    const nome =  req.body.nome
    const cidade =  req.body.cidade
    const complemento =  req.body.complemento
    const numero =  req.body.numero

    try{
        const newUbs = await pool.query(`INSERT INTO ubs(ubs_name, ubs_cidade, ubs_complemento, ubs_phonenumber) VALUES ($1 , $2, $3, $4) RETURNING *`, [nome, cidade, complemento, numero])
        return res.status(201).send(newUbs.rows)
    } catch(erro) {
        res.status(500).send(erro);
    }
})

/*
NÃO SERIA O CERTO DELETAR UMA LINHA DA TABELA TÃO IMPORTANTE POR MEIO DA API A NÃO SER QUE SEJA
ALGUEM QUE SAIBA O QUE ESTÁ FAZENDO. 
ISSO IMPLICARIA EM ENVENTUAIS ERROS NO BANCO DE DADOS COMO users COM CHAVE ESTRANGEIRAS QUE APONTAM 
PARA O ABSOLUTO NADA.

app.delete('/ubs', async (req, res) => {
    const id = req.id
    let tUbs = ''
    try{
        tUbs = await pool.query(`SELECT * FROM users WHERE user_id = ($1)`, [id])
        
        if (!tUser.rows[0]){
            tUser = await pool.query(``, )
        }

        return res.status(201).send(tUser.rows)
    } catch(erro) {
        res.status(500).send(erro);
    }
})
*/

// ROTAS DA TABELA 'users'

app.get('/user', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users')
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.get('/user/:ubs_id', async (req, res) => {
    const { ubs_id }  = req.params
    try {
        const todos_da_ubs = await pool.query('SELECT * FROM users WHERE fk_id_ubs = ($1)', [ubs_id])
        return res.status(200).send(todos_da_ubs.rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/user/:ubs_id', async (req, res) => {
    const user_name = req.body.user_name 
    const hashePassoword = await bcrypt.hash(req.body.password, 10)//o 10 garante uma cripito diferente para senha iguais
    const user_occupation = req.body.user_occupation
    
    const { fk_id_ubs } = req.params

    let tUser = ''
    try{
        tUser = await pool.query(`SELECT * FROM users WHERE user_name = ($1)`, [user_name])
        
        if (!tUser.rows[0]){
            tUser = await pool.query(`INSERT INTO users(user_name, user_password, user_occupation, fk_id_ubs) VALUES ($1 , $2, $3, $4) RETURNING *`, [ user_name, hashePassoword, user_occupation, fk_id_ubs ])
        }

        return res.status(201).send(tUser.rows)
    } catch(erro) {
        res.status(500).send(erro);
    }
})


app.patch('/user/:ubs_id/:user_id', async (req, res) => {

    const { ubs_id, user_id} = req.params

    const user_name = req.body.user_name
    const hashePassoword = await bcrypt.hash(req.body.password, 10)
    const user_occupation  = req.body.user_occupation


    try{
        const consulta = await pool.query(`SELECT * FROM users WHERE fk_id_ubs = ($1) AND user_id = ($2)`, [ubs_id, user_id])
        if (!consulta.rows[0]){
            return res.status(400).send('A operação não pode ser concluida')
        }

        const updateUser = await pool.query(`UPDATE users SET user_name = ($1), user_password = ($2), user_occupation = ($3), fk_id_ubs = ($4) RETURNING *`[user_name, hashePassoword, user_occupation, ubs_id])
        return res.status(200).send(updateUser.rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }

})


// ROTAS DA TABELA 'pacientes'







// ROTAS DA TABELA 'avisos'







app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


/*

app.post('/ubs', async (req, res) => {
    const hashePassoword = await bcrypt.hash(req.body.password, 10)//o 10 garante uma cripito diferente para senha iguais
    const user_email =  req.body.email
    
    let tUser = ''
    try{
        tUser = await pool.query(`SELECT * FROM users WHERE user_email = ($1)`, [user_email])
        
        if (!tUser.rows[0]){
            tUser = await pool.query(`INSERT INTO users(user_email, user_password) VALUES ($1 , $2) RETURNING *`, [user_email, hashePassoword])
        }

        return res.status(201).send(tUser.rows)
    } catch(erro) {
        res.status(500).send(erro);
    }
})

*/