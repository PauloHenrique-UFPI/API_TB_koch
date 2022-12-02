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

app.patch('/ubs/:ubs_id', async (req, res) => {

    const { ubs_id} = req.params

    const nome  = req.body.nome
    const cidade = req.body.cidade
    const comp = req.body.complemento
    const numero = req.body.numero


    try{
        const consulta = await pool.query(`SELECT * FROM ubs WHERE id_ubs = ($1)`, [ubs_id])
        if (!consulta.rows[0]){
            return res.status(400).send('ID não cadastrado no banco de dados')
        }

        const updateUser = await pool.query(`UPDATE ubs SET ubs_name = ($1), ubs_cidade = ($2), ubs_complemento = ($3), ubs_phonenumber = ($4) WHERE id_ubs = ($5) RETURNING *`, [ nome, cidade, comp, numero, ubs_id])
        return res.status(200).send(updateUser.rows)
    } catch(erro) {
        return res.status(400).send(erro)
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

    const hashePassoword = await bcrypt.hash(req.body.password, 10)
    const user_occupation  = req.body.user_occupation


    try{
        const consulta = await pool.query(`SELECT * FROM users WHERE fk_id_ubs = ($1) AND user_id = ($2)`, [ubs_id, user_id])
        if (!consulta.rows[0]){
            return res.status(400).send('A operação não pode ser concluida')
        }

        const updateUser = await pool.query(`UPDATE users SET user_password = ($1), user_occupation = ($2), fk_id_ubs = ($3) WHERE user_id = ($4) RETURNING *`, [ hashePassoword, user_occupation, ubs_id, user_id])
        return res.status(200).send(updateUser.rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }

})

app.delete('/user/:user_id', async (req, res) =>{
    const { user_id } = req.params
    try {
        const delUser = await pool.query('DELETE FROM users WHERE user_id = ($1) RETURNING *',[user_id])
        return res.status(200).send({
            message: 'Usuário deletado com Sucesso',
            delUser: delUser.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})


// ROTAS DA TABELA 'avisos'
app.get('/avisos', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM avisos')
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/avisos', async (req, res) => {

    const avisos_img =  req.body.avisos_img
    const avisos_text =  req.body.avisos_text
    const avisos_details =  req.body.avisos_details

    try{
        const newAvisos = await pool.query(`INSERT INTO avisos(avisos_img, avisos_text, avisos_details) VALUES ($1 , $2, $3) RETURNING *`, [avisos_img, avisos_text, avisos_details])
        return res.status(201).send(newAvisos.rows)
    } catch(erro) {
        res.status(500).send(erro);
    }
})

app.patch('/avisos/:avisos_id', async (req, res) => {

    const { avisos_id } = req.params

    const avisos_img = req.body.avisos_img
    const avisos_text  = req.body.avisos_text
    const avisos_details  = req.body.avisos_details


    try{
        const consulta = await pool.query(`SELECT * FROM avisos WHERE avisos_id = ($1)`, [avisos_id])
        if (!consulta.rows[0]){
            return res.status(400).send('A operação não pode ser concluida')
        }
        const updateAvisos = await pool.query(`UPDATE avisos SET avisos_img = ($1), avisos_text = ($2), avisos_details = ($3) WHERE avisos_id = ($4) RETURNING *`,[avisos_img, avisos_text, avisos_details, avisos_id])
        return res.status(200).send(updateAvisos.rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }

})

app.delete('/avisos/:avisos_id', async (req, res) =>{
    const { avisos_id } = req.params
    try {
        const delAvisos = await pool.query('DELETE FROM avisos WHERE avisos_id = ($1) RETURNING *',[avisos_id])
        return res.status(200).send({
            message: 'Aviso deletado com Sucesso',
            delAvisos: delAvisos.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})


app.get('/pacientes', async(req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM pacientes')
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.get('/pacientes/:fk_id_ubs', async (req, res) => {
    const { fk_id_ubs }  = req.params
    try {
        const todos_da_ubs = await pool.query('SELECT * FROM pacientes WHERE fk_id_ubs = ($1)', [fk_id_ubs])
        return res.status(200).send(todos_da_ubs.rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})


app.post('/pacientes/:fk_id_ubs', async (req, res) => {

    const paciente_name = req.body.paciente_name 
    const nascimento = req.body.nascimento
    const imgexam = req.body.imgexam
    const iniciais = req.body.iniciais
    
    const { fk_id_ubs } = req.params

    let tPacientes = ''
    try{
        tPacientes = await pool.query(`SELECT * FROM pacientes WHERE paciente_name = ($1)`, [paciente_name])

        if (!tPacientes.rows[0]){
            tPacientes = await pool.query(`INSERT INTO pacientes(paciente_name, nascimento, imgexam, iniciais, fk_id_ubs) VALUES ($1 , $2, $3, $4, $5) RETURNING *`, [ paciente_name, nascimento, imgexam, iniciais, fk_id_ubs ])
        }
        
        return res.status(201).send(tPacientes.rows)
    } catch(erro) {
        res.status(500).send(erro);
    }
})

app.patch('/pacientes/:fk_id_ubs/:paciente_id', async (req, res) => {

    const { fk_id_ubs, paciente_id} = req.params

    const paciente_name = req.body.paciente_name 
    const nascimento = req.body.nascimento
    const imgexam = req.body.imgexam
    const iniciais = req.body.iniciais


        const consulta = await pool.query(`SELECT * FROM pacientes WHERE fk_id_ubs = ($1) AND paciente_id = ($2)`, [fk_id_ubs, paciente_id])
        if (!consulta.rows[0]){
            return res.status(400).send('A operação não pode ser concluida')
        }

        const updatePaciente = await pool.query(`UPDATE pacientes SET paciente_name = ($1), nascimento = ($2), imgexam = ($3), iniciais = ($4), fk_id_ubs = ($5), paciente_id = ($6) RETURNING *`[ paciente_name, nascimento, imgexam, iniciais , fk_id_ubs, paciente_id ])
        return res.status(200).send(updatePaciente.rows)
})


app.delete('/pacientes/:paciente_id', async (req, res) =>{
    const { paciente_id } = req.params
    try {
        const delPaciente = await pool.query('DELETE FROM pacientes WHERE paciente_id = ($1) RETURNING *',[paciente_id])
        return res.status(200).send({
            message: 'Paciente deletado com Sucesso',
            delPaciente: delPaciente.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})





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