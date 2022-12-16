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

// ROTAS DA TABELA 'noticias'

app.get('/noticias', async (req, res) =>
{
    try{
        const { rows } = await pool.query(`SELECT * FROM noticias`)
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/noticias', async (req, res) => {
    const titulo = req.body.titulo
    const data = req.body.data
    const img = req.body.img
    const desc_curta = req.body.desc_curta
    const desc_longa = req.body.desc_longa

    try{
        const { newUbs } = await pool.query('INSERT INTO noticias (titulo, data, img, desc_curta, desc_longa) VALUES ($1, $2, $3, $4, $5)', [titulo, data, img, desc_curta, desc_longa])
        return res.status(201).send("cadastrado com sucesso")
    } catch(erro) {
        res.status(500).send(erro);
    }
})

app.patch('/noticias/:id', async (req, res) => {

    const id = req.params.id

    const titulo = req.body.titulo
    const data = req.body.data
    const img = req.body.img
    const desc_curta = req.body.desc_curta
    const desc_longa = req.body.desc_longa


    try{
        const consulta = await pool.query(`SELECT * FROM noticias WHERE id = ($1)`, [id])
        if (!consulta.rows[0]){
            return res.status(400).send('ID não cadastrado no banco de dados')
        }

        const updateUser = await pool.query(`UPDATE noticias SET
            titulo = ($1),
            data = ($2),
            img = ($3),
            desc_curta = ($4),
            desc_longa = ($5)
            WHERE id = ($6) RETURNING *`, [titulo, data, img, desc_curta, desc_longa, id])
        return res.status(200).send(updateUser.rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }

})

app.delete('/noticias/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const delUser = await pool.query('DELETE FROM noticias WHERE id = ($1) RETURNING *',[id])
        return res.status(200).send({
            message: 'Usuário deletado com Sucesso',
            delUser: delUser.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.get('/users', async (req, res) =>
{
    try{
        const { rows } = await pool.query(`SELECT * FROM usuario`)
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/users', async (req, res) => {
    const nome = req.body.nome
    const senha = await bcrypt.hash(req.body.senha, 10)//o 10 garante uma cripito diferente para senha iguais
    const email = req.body.email
    const profissao = req.body.profissao
    const adm = req.body.adm

    try{
        const { newUbs } = await pool.query('INSERT INTO usuario (nome, senha, email, profissao, adm) VALUES ($1, $2, $3, $4, $5)', [nome, senha, email, profissao, adm])
        return res.status(201).send("cadastrado com sucesso")
    } catch(erro) {
        res.status(500).send(erro);
    }
})

app.patch('/users/:id', async (req, res) => {

    const id = req.params.id

    const nome = req.body.nome
    const senha = await bcrypt.hash(req.body.senha, 10)//o 10 garante uma cripito diferente para senha iguais
    const email = req.body.email
    const profissao = req.body.profissao
    const adm = req.body.adm


    try{
        const consulta = await pool.query(`SELECT * FROM usuario WHERE id = ($1)`, [id])
        if (!consulta.rows[0]){
            return res.status(400).send('ID não cadastrado no banco de dados')
        }

        const updateUser = await pool.query(`UPDATE usuario SET
            nome = ($1),
            senha = ($2),
            email = ($3),
            profissao = ($4),
            adm = ($5)
            WHERE id = ($6) RETURNING *`, [nome, senha, email, profissao, adm, id])
        return res.status(200).send(updateUser.rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }

})

app.delete('/users/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const delUser = await pool.query('DELETE FROM usuario WHERE id = ($1) RETURNING *',[id])
        return res.status(200).send({
            message: 'Usuário deletado com Sucesso',
            delUser: delUser.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})


app.get('/paciente', async (req, res) =>
{
    try{
        const { rows } = await pool.query(`SELECT * FROM paciente`)
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/paciente', async (req, res) => {

    const nome = req.body.nome
    const data_nasc = req.body.data_nasc
    const naturalidade = req.body.naturalidade
    const profissao = req.body.profissao
    const nome_mae = req.body.nome_mae
    const forma = req.body.forma
    const cartao_sus = req.body.cartao_sus
    const endereco = req.body.endereco 
    const municipio = req.body.municipio
    const ponto_ref = req.body.ponto_ref
    const telefone = req.body.telefone
    const n_sinan = req.body.n_sinan
    const unidade_tratamento = req.body.unidade_tratamento
    const unidade_cad = req.body.unidade_cad
    const img_trat = req.body.img_trat

    try{
        const { newUbs } = await pool.query('INSERT INTO paciente (nome, data_nasc, naturalidade, profissao, nome_mae, forma, cartao_sus, endereco, municipio, ponto_ref, telefone, n_sinan, unidade_tratamento, unidade_cad, img_trat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', 
        [nome, data_nasc, naturalidade, profissao, nome_mae, forma, cartao_sus, endereco, municipio, ponto_ref, telefone, n_sinan, unidade_tratamento, unidade_cad, img_trat])
        return res.status(201).send("cadastrado com sucesso")
    } catch(erro) {
        res.status(500).send(erro);
    }
})

app.patch('/paciente/:id', async (req, res) => {

    const id = req.params.id

    const nome = req.body.nome
    const data_nasc = req.body.data_nasc
    const naturalidade = req.body.naturalidade
    const profissao = req.body.profissao
    const nome_mae = req.body.nome_mae
    const forma = req.body.forma
    const cartao_sus = req.body.cartao_sus
    const endereco = req.body.endereco 
    const municipio = req.body.municipio
    const ponto_ref = req.body.ponto_ref
    const telefone = req.body.telefone
    const n_sinan = req.body.n_sinan
    const unidade_tratamento = req.body.unidade_tratamento
    const unidade_cad = req.body.unidade_cad
    const img_trat = req.body.img_trat


    try{
        const consulta = await pool.query(`SELECT * FROM paciente WHERE id = ($1)`, [id])
        if (!consulta.rows[0]){
            return res.status(400).send('ID não cadastrado no banco de dados')
        }

        const updateUser = await pool.query(`UPDATE paciente SET
            nome = ($1), 
            data_nasc = ($2), 
            naturalidade = ($3), 
            profissao = ($4), 
            nome_mae = ($5), 
            forma = ($6), 
            cartao_sus = ($7), 
            endereco = ($8), 
            municipio = ($9), 
            ponto_ref = ($10), 
            telefone = ($11), 
            n_sinan = ($12), 
            unidade_tratamento = ($13), 
            unidade_cad = ($14), 
            img_trat = ($15)
            WHERE id = ($16) RETURNING *`, 
            [nome, data_nasc, naturalidade, profissao, nome_mae, forma, cartao_sus, endereco, municipio, ponto_ref, telefone, n_sinan, unidade_tratamento, unidade_cad, img_trat, id])
        return res.status(200).send(updateUser.rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }

})

app.delete('/paciente/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const delUser = await pool.query('DELETE FROM paciente WHERE id = ($1) RETURNING *',[id])
        return res.status(200).send({
            message: 'Usuário deletado com Sucesso',
            delUser: delUser.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`))