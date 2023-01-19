import { useState } from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import Product from "../components/Product";
import { initMongoose } from "../lib/mongoose";
import { findAllProducts } from "./api/products";

interface IProduct {
  products: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    picture: string;
  }[]
}

export default function Home({ products }: IProduct) {

  const [phrase, setPhrase] = useState('');

  // Transforma em um array de string, com apenas as categorias
  const categoriesNames = [...new Set(products?.map((product) => product.category))]

  if (phrase) {
    products = products.filter((product) => product.name.toLowerCase().includes(phrase))
  }

  return (
    <Layout>
      <input
        type="text"
        value={phrase}
        placeholder="Faça busca por produtos..."
        onChange={e => setPhrase(e.target.value)}
        className="bg-gray-100 w-full py-2 px-4 rounded"
      />

      <div>
        {categoriesNames?.map(categoryName => (
          <div key={categoryName}>

            {products.find(product => product.category === categoryName) && (
              <>
                <h2 className="text-2xl py-5 capitalize">{categoryName}</h2>
                <div className="flex -mx-5 overflow-x-scroll snap-x scroll-bar-hidden">

                  {products.filter((product) => product.category === categoryName).map(product => (
                    <div key={product._id} className="px-5 snap-start">
                      <Product product={product} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

    </Layout>
  )
}

export async function getServerSideProps() {
  await initMongoose();

  const products = await findAllProducts();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products))
    }
  }
}