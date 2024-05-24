// favoriteList.model.js

import mongoose from 'mongoose';

const favoriteListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, { timestamps: true });

const FavoriteList = mongoose.model('FavoriteList', favoriteListSchema);

export default FavoriteList;
