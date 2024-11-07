const express = require('express');
const Occurrence = require('../models/Occurrence');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Acesso negado' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido' });
  }
};

router.post('/', authenticate, async (req, res) => {
  try {
    const occurrence = new Occurrence({
      description: req.body.description,
      location: { type: 'Point', coordinates: req.body.coordinates },
      user: req.user.id,
    });
    await occurrence.save();
    res.status(201).json(occurrence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const occurrences = await Occurrence.find();
    res.json(occurrences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
