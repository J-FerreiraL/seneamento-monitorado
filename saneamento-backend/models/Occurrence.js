const mongoose = require('mongoose');

const occurrenceSchema = new mongoose.Schema({
  description: { type: String, required: true },
  location: { type: { type: String, enum: ['Point'], required: true }, coordinates: [Number] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'Pendente' },
});

occurrenceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Occurrence', occurrenceSchema);
