const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json()); // Habilita leitura de JSON no CORPO DA REQUISIÇÃO.
app.use(cors()); // Permite que o FRONTEND  acesse esta API.


// EXERCÍCIO 1
// MIDDLEWARE PARA ACESSAR TODAS AS ROTAS
app.use((req, res, next) => {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  console.log(`[${dataAtual}] Método: ${req.method} | URL: ${req.url}`);
  next();
})



// EXERCÍCIO 2
const validarEmail = (req, res, next) => {
  const { email } = req.body;

  // Verifica se o email existe e contem o caractere "@"
  if (!email || !email.includes('@')) {
    console.log("⚠️ Bloqueio: Tentativa de cadastro com e-mail invalido!")
    return res.status(400).json({ mensagem: "Email inválido! O campo deve conter '@' ."})
  }
  next();
}


// Configurar a CONEXÃO com o BD nesse caso é o MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Usuário PADRÃO DO MYSQL
  password: '1234', // SENHA DO MYSQL
  database: 'teste_tcc', // NOME DO BANCO QUE NÓS CRIAMOS
  port: '3310',
});

db.connect((err) => {
  if(err) {
    console.error("Erro ao conectar ao MySQL: ", err);
    return;
  }
  console.log("Conectado ao MySQL com sucesso!")
})

// --- ROTA DE CADASTRO ---
app.post('/cadastrar', validarEmail, (req, res) => {
  const { nome, email, senha } = req.body;

  const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

  db.query(sql, [nome, email, senha], (err, result) => {
    if(err) return res.status(500).json({ erro: err.message });
    res.status(201).json( { mensagem: 'Usuário cadastrado com sucesso!'});
  })
})

// -- ROTA DE LOGIN -- 
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?"

  db.query(sql, [email, senha], (err, result) => {
    if (err) return res.status(500).json({ erro: err.message });

    console.log(result);
    if(result.length > 0) {
      res.status(200).json({ mensagem: 'Login efetuado com sucesso!', usuario: result[0] })
    } else {
      res.status(401).json( { mensagem: "Email ou senha incorretos!"});
    }
  });
});

// ROTA DE EXIBIR TODOS USUÁRIOS
app.get('/usuarios',( req, res) => {
  const sql = 'SELECT * FROM usuarios';
  db.query(sql, (err, result) => {
    if(err) return res.status(500).json(err);
    res.status(200).json(result);
  })
})

app.listen(3000, () => {
  console.log(`Deu certo!`)
})

console.log('aprendendo Git')