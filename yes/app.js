const express = require("express");
const ejs = require("ejs");
const app = express();
const pdf = require("pdf-parse");
const fs = require("fs");
const fileUpload = require("express-fileupload");

// Configuração do middleware express-fileupload
app.use(fileUpload());

// Configuração do Express e EJS
app.set("view engine", "ejs");
app.use(express.static("public"));

// Rota inicial para carregar o formulário
app.get("/", (req, res) => {
    res.render("index", { pdfText: "", summary: "" });
});

// Rota para processar o envio do arquivo PDF
app.post("/upload", async (req, res) => {
    try {
        // Verifique se há um arquivo enviado com o nome "pdfFile"
        if (!req.files || !req.files.pdfFile) {
            return res.status(400).send("Nenhum arquivo foi enviado.");
        }

        const pdfFile = req.files.pdfFile;

        // Ler o arquivo PDF enviado
        const dataBuffer = pdfFile.data;
        const data = await pdf(dataBuffer);

        // Extrair o texto do PDF
        const pdfText = data.text;

        // Resumo simples (os primeiros 500 caracteres)
        const summary = pdfText.slice(0, 500);

        // Renderizar a página com o texto do PDF e o resumo
        res.render("index", { pdfText, summary });
    } catch (error) {
        console.error("Erro ao processar o arquivo PDF:", error);
        res.status(500).send("Erro ao processar o arquivo PDF.");
    }
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000.");
});