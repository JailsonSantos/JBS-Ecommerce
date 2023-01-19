/* eslint-disable @next/next/no-img-element */

import { useContext } from "react";
import { ProductsContext } from "../contexts/ProductsContext";

import { parseCookies, destroyCookie, setCookie } from 'nookies'

interface IProduct {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    picture: string;
  }
}

export default function Product({ product }: IProduct) {

  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext)

  function addProduct() {

    setSelectedProducts((prev: any) => [...prev, product._id])

    setCookie(null, 'productIdOnCookies', JSON.stringify([...selectedProducts, product._id]))

  }

  return (
    <div className="w-64">
      <div className="bg-blue-100 p-5 rounded-xl">
        <img src={product.picture} alt={product.name} />
      </div>
      <div className="mt-2">
        <h3 className="font-bold text-lg">{product.name}</h3>
      </div>
      <p className="text-sm mt-1 leading-4 text-gray-500">
        {product.description}
      </p>
      <div className="flex mt-1">
        <div className="text-2xl font-bold grow">R$ {product.price}</div>
        <button onClick={addProduct} className="bg-emerald-400 text-white py-1 px-3 rounded-2xl">+</button>
      </div>
    </div>
  )
}