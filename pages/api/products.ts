
import Product from "../../models/Product";
import { initMongoose } from "../../lib/mongoose";
import { NextApiRequest, NextApiResponse } from 'next';

export async function findAllProducts() {
  return Product.find().exec()
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  const { method } = req;

  await initMongoose();

  const { ids } = req.query;

  if (method === 'GET' && ids !== undefined) {

    const isArray = ids.split(',');

    try {
      const listProductsIds = await Product.find({ '_id': { $in: isArray } }).exec();

      res.status(200).json(listProductsIds);

    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    try {
      const listProducts = await Product.find();
      res.status(200).json(listProducts);

    } catch (error) {
      res.status(500).json(error);
    }
  }
}
