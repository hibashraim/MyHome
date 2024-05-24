// favoriteList.controller.js

import FavoriteList from "../../../DB/model/FavoriteList .js";


// إضافة منتج إلى قائمة المفضلة
export const addToFavoriteList = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req.user; 

    const favoriteList = await FavoriteList.findOneAndUpdate(
      { userId },
      { $addToSet: { products: productId } }, // إضافة المنتج للقائمة إذا لم يكن موجودًا بالفعل
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, favoriteList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// حذف منتج من قائمة المفضلة
export const removeFromFavoriteList = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req.user; 
    const favoriteList = await FavoriteList.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } }, // حذف المنتج من القائمة
      { new: true }
    );

    res.status(200).json({ success: true, favoriteList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
