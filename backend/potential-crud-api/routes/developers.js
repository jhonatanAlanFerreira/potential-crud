const express = require('express');
const router = express.Router();
const db = require("../db");

/* GET Retorna os desenvolvedores de acordo com o termo passado via querystring e paginação */
router.get('/', async (req, res) => {
    const Developers = db.Mongoose.model('developers', db.DevelopersSchema, 'developers');
    const {
        nome,
        hobby,
        sexo,
        idade,
        datanascimento
    } = req.query;
    let {
        page,
        limit
    } = req.query;

    var devQuery = {
        nome: {
            $regex: nome || '',
            $options: 'i'
        },
        hobby: {
            $regex: hobby || '',
            $options: 'i'
        }
    };
    if (sexo) devQuery.sexo = sexo;
    if (idade) devQuery.idade = idade;
    if (datanascimento) devQuery.datanascimento = datanascimento;

    limit = limit ? +limit : 0;
    const skip = limit && page ? (page - 1) * limit : 0;

    try {
        const docs = await Developers.find(devQuery).skip(skip).limit(limit);
        const qtd = await Developers.find(devQuery).count();

        const data = {
            docs,
            qtd
        };

        res.json(data)
    } catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
});

/* GET Retorna os dados de um desenvolvedor. */
router.get('/:id', async (req, res) => {
    const Developers = db.Mongoose.model('developers', db.DevelopersSchema, 'developers');
    const {
        id
    } = req.params;

    try {
        const developer = await Developers.find({
            _id: Object(id)
        });

        res.send(developer);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

/* POST Adiciona um novo desenvolvedor. */
router.post('/', async (req, res) => {
    const Developers = db.Mongoose.model('developers', db.DevelopersSchema, 'developers');
    const developer = new Developers(req.body);

    try {
        await developer.save();
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
});

/* PUT Atualiza os dados de um desenvolvedor. */
router.put('/:id', async (req, res) => {
    const Developers = db.Mongoose.model('developers', db.DevelopersSchema, 'developers');
    const {
        id
    } = req.params;
    const developer = new Developers(req.body, {
        _id: 0
    });

    try {
        await Developers.updateOne({
            _id: Object(id)
        }, {
            $set: developer
        });

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

/* DELETE Apaga o registro de um desenvolvedor. */
router.delete('/:id', async (req, res) => {
    const Developers = db.Mongoose.model('developers', db.DevelopersSchema, 'developers');
    const {
        id
    } = req.params;

    try {
        await Developers.deleteOne({
            _id: Object(id)
        });

        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

module.exports = router;