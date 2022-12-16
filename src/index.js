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


// Metodos para investigacao

app.get('/investigacao', async(req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM investigacao')
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/investigacao', async (req, res) => {

    const tipo_notificacao = req.body.tipo_notificacao 
    const doenca = req.body.doenca
    const data_mod = req.body.data_mod
    const uf = req.body.uf
    const codigo_IBGE = req.body.codigo_IBGE
    const ubs = req.body.ubs
    const codigo_ubs = req.body.codigo_ubs
    const data_diagnostico = req.body.data_diagnostico
    const nome_paciente = req.body.nome_paciente
    const data_nascimento = req.body.data_nascimento
    const idade_paciente = req.body.idade_paciente
    const sexo_paciente = req.body.sexo_paciente
    const gestante = req.body.gestante
    const raca_cor = req.body.raca_cor
    const escolaridade = req.body.escolaridade
    const num_car_sus = req.body.num_car_sus
    const nome_mae = req.body.nome_mae
    const uf_paciente = req.body.uf_paciente
    const residencia = req.body.residencia


        const newInvestigacao = await pool.query(`INSERT INTO investigacao(tipo_notificacao, doenca, data_mod, uf, codigo_IBGE, ubs, codigo_ubs, data_diagnostico, 
            nome_paciente, data_nascimento, idade_paciente, sexo_paciente, gestante, raca_cor, escolaridade, num_car_sus, nome_mae, uf_paciente, residencia) 
            VALUES ($1 , $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19 ) RETURNING *`, 
            [ tipo_notificacao, doenca, data_mod, uf, codigo_IBGE, ubs, codigo_ubs, data_diagnostico, nome_paciente, data_nascimento, idade_paciente, sexo_paciente, gestante, raca_cor, escolaridade, num_car_sus, nome_mae, uf_paciente, residencia ])
        return res.status(201).send(newInvestigacao.rows)

})

app.delete('/investigacao/:id_investigacao', async (req, res) =>{
    const { id_investigacao } = req.params
    try {
        const delInvestigacao = await pool.query('DELETE FROM investigacao WHERE id_investigacao = ($1) RETURNING *',[ id_investigacao ])
        return res.status(200).send({
            message: 'Investigação deletado com Sucesso',
            delInvestigacao: delInvestigacao.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})


app.patch('/investigacao/:id_investigacao', async (req, res) => {

    const { id_investigacao } = req.params

    const tipo_notificacao = req.body.tipo_notificacao 
    const data_mod = req.body.data_mod
    const uf = req.body.uf
    const codigo_IBGE = req.body.codigo_IBGE
    const ubs = req.body.ubs
    const codigo_ubs = req.body.codigo_ubs
    const nome_paciente = req.body.nome_paciente
    const idade_paciente = req.body.idade_paciente
    const gestante = req.body.gestante
    const uf_paciente = req.body.uf_paciente
    const residencia = req.body.residencia


        const consulta = await pool.query(`SELECT * FROM investigacao WHERE id_investigacao = ($1)`, [ id_investigacao ])
        if (!consulta.rows[0]){
            return res.status(400).send('A operação não pode ser concluida')
        }

        const updateInvestigacao = await pool.query(`UPDATE investigacao  SET 
        tipo_notificacao = ($1), data_mod = ($2), uf = ($3), codigo_IBGE = ($4), ubs = ($5), codigo_ubs = ($6), nome_paciente = ($7), idade_paciente = ($8),
        gestante = ($9), uf_paciente = ($10), residencia = ($11) RETURNING *`, [ tipo_notificacao, data_mod, uf, codigo_IBGE, ubs, codigo_ubs, nome_paciente, idade_paciente, gestante, uf_paciente, residencia ])
        return res.status(200).send(updateInvestigacao.rows)
})


//Metodos para Exames
app.get('/exame', async(req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM exame')
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/exame/:id_paciente', async (req, res) => {

    const img_exame = req.body.img_exame 
    const obs = req.body.obs
    const data_exame = req.body.data_exame
    
    const {id_paciente} = req.params

    let tExame = ''
    try{
        tExame = await pool.query(`SELECT * FROM exame WHERE id_paciente = ($1)`, [id_paciente])

        if (!tExame.rows[0]){
            tExame = await pool.query(`INSERT INTO exame(img_exame,obs,data_exame, id_paciente) VALUES ($1 , $2, $3, $4) RETURNING *`, [ img_exame, obs, data_exame, id_paciente ])
        }
        
        return res.status(201).send(tExame.rows)
    } catch(erro) {
        res.status(500).send(erro);
    }
})

app.delete('/exame/:id_exame', async (req, res) =>{
    const { id_exame } = req.params
    try {
        const delExame = await pool.query('DELETE FROM exame WHERE id_exame = ($1) RETURNING *',[ id_exame ])
        return res.status(200).send({
            message: 'Exame deletado com Sucesso',
            delExame: delExame.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.patch('/exame/:id_exame', async (req, res) => {

    const {id_exame} = req.params

    const img_exame = req.body.img_exame 
    const obs = req.body.obs
    const data_exame = req.body.data_exame
    

    const consulta = await pool.query(`SELECT * FROM exame WHERE id_exame = ($1)`, [ id_exame ])
        if (!consulta.rows[0]){
            return res.status(400).send('A operação não pode ser concluida')
        }

        const updateExame = await pool.query(`UPDATE exame  SET 
        img_exame = ($1), obs = ($2), data_exame = ($3) RETURNING *`, [ img_exame, obs, data_exame ])
        return res.status(200).send(updateExame.rows)
})


//Metodos Prontuario
app.get('/prontuario', async(req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM prontuario')
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/prontuario', async (req, res) => {

    const tipo_entrada =  req.body.tipo_entrada
    const popu_especifica =  req.body.popu_especifica
    const beneficiario =  req.body.beneficiario
    const tipo_doenca = req.body.tipo_doenca
    const se_extrapulmonar = req.body.se_extrapulmonar
    const agravos = req.body.agravos
    const diagnostico = req.body.diagnostico
    const radiografia = req.body.radiografia
    const hiv = req.body.hiv
    const terapia = req.body.terapia
    const data_inicio_tratamento_atual = req.body.data_inicio_tratamento_atual
    const histopatologia = req.body.histopatologia
    const cultura = req.body.cultura
    const teste_sensibilidade = req.body.teste_sensibilidade
    const contatos_identificados = req.body.contatos_identificados

    try{
        const newProntuario = await pool.query(`INSERT INTO prontuario(
            tipo_entrada, popu_especifica, beneficiario, tipo_doenca, se_extrapulmonar, agravos, diagnostico, radiografia, hiv, terapia, data_inicio_tratamento_atual, histopatologia, cultura, teste_sensibilidade, contatos_identificados) 
            VALUES ($1 , $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`, 
            [ tipo_entrada, popu_especifica, beneficiario, tipo_doenca, se_extrapulmonar, agravos, diagnostico, radiografia, hiv, terapia, data_inicio_tratamento_atual, histopatologia, cultura, teste_sensibilidade, contatos_identificados])
        return res.status(201).send(newProntuario.rows)
    } catch(erro) {
        res.status(500).send(erro);
    }
})

app.delete('/prontuario/:id_prontuario', async (req, res) =>{
    const { id_prontuario } = req.params
    try {
        const delProntuario = await pool.query('DELETE FROM prontuario WHERE id_prontuario = ($1) RETURNING *',[ id_prontuario ])
        return res.status(200).send({
            message: 'Prontuario deletado com Sucesso',
            delProntuario: delProntuario.rows

        })
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.patch('/prontuario/:id_prontuario', async (req, res) => {

    const { id_prontuario } = req.params

    const beneficiario =  req.body.beneficiario
    const tipo_doenca = req.body.tipo_doenca
    const se_extrapulmonar = req.body.se_extrapulmonar
    const agravos = req.body.agravos
    const diagnostico = req.body.diagnostico
    const radiografia = req.body.radiografia
    const hiv = req.body.hiv
    const terapia = req.body.terapia
    const histopatologia = req.body.histopatologia
    const cultura = req.body.cultura
    const teste_sensibilidade = req.body.teste_sensibilidade
    const contatos_identificados = req.body.contatos_identificados


        const consulta = await pool.query(`SELECT * FROM prontuario WHERE id_prontuario = ($1)`, [ id_prontuario ])
        if (!consulta.rows[0]){
            return res.status(400).send('A operação não pode ser concluida')
        }

        const updateProntuario = await pool.query(`UPDATE prontuario  SET 
        beneficiario = ($1), tipo_doenca = ($2), se_extrapulmonar = ($3), agravos = ($4), diagnostico = ($5), radiografia = ($6), hiv = ($7), terapia = ($8),
        histopatologia = ($9), cultura = ($10), teste_sensibilidade = ($11), contatos_identificados = ($12) RETURNING *`, [  beneficiario, tipo_doenca, se_extrapulmonar, agravos, diagnostico, radiografia, hiv, terapia, histopatologia, cultura, teste_sensibilidade, contatos_identificados])
        return res.status(200).send(updateProntuario.rows)
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))