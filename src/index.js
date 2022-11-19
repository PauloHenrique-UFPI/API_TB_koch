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


app.get('/users', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users')
        return res.status(200).send(rows)
    } catch(erro) {
        return res.status(400).send(erro)
    }
})

app.post('/users', async (req, res) => {
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))