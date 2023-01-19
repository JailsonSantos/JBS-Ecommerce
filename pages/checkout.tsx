import { api } from "../lib/axios";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { ProductsContext } from "../contexts/ProductsContext";
import { Fragment, useContext, useEffect, useState } from "react";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  picture: string;
}

export default function CheckoutPage() {

  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [productsInfos, setProductsInfos] = useState<IProduct[]>([]);


  async function handleSearchProductForId() {
    const uniqIds = [...new Set(selectedProducts)];
    try {
      if (uniqIds.length > 0) {
        const response = await api.get('/products?ids=' + uniqIds.join(','));
        setProductsInfos(response.data)
      }

    } catch (error: any) {
      throw new Error(error.message)

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearchProductForId();
  }, [selectedProducts])

  function moreOfThisProduct(id: string) {
    setSelectedProducts(prev => [...prev, id])
  }

  function lessOfThisProduct(id: string) {

    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {

      setSelectedProducts(prev => {
        return prev.filter((value, index) => index !== pos)
      })
    }
  }

  let total = 0;
  let subtotal = 0;
  const deliveryPrice = 50;

  if (selectedProducts.length) {
    for (let id of selectedProducts) {

      const price = productsInfos?.find(product => product._id === id.toString())?.price;

      if (price) {
        subtotal += price;
      }
    }
  }

  if (subtotal) {
    total = subtotal + deliveryPrice;
  }

  return (
    <Layout>

      {loading ? <Loading />

        :

        <Fragment>
          {!productsInfos.length && (
            <div className="mb-5 bg-red-400 text-white text-lg p-5 rounded-xl text-center">
              Não há produtos em seu carrinho!
            </div>
          )}

          {
            productsInfos && productsInfos.map((productInfo) => {

              const amount = selectedProducts.filter(id => id.toString() === productInfo._id).length;

              if (amount === 0) return;

              return (
                <div key={productInfo._id} className="flex mb-5">
                  <div className="bg-gray-100 p-3 rounded-xl shrink-0">
                    <img className="w-24" src={productInfo.picture} alt={productInfo.name} />
                  </div>
                  <div className="pl-4">
                    <h3 className="font-bold text-lg">
                      {productInfo.name}
                    </h3>
                    <p className="text-sm leading-4 text-gray-500">
                      {productInfo.description}
                    </p>
                    <div className="flex">
                      <div className="grow">R$ {productInfo.price}</div>
                      <div>
                        <button onClick={() => lessOfThisProduct(productInfo._id)} className="border border-emerald-500 px-2 rounded-lg text-emerald-500"> - </button>
                        <span className="px-2">
                          {
                            selectedProducts?.filter(id => id.toString() === productInfo._id).length
                          }
                        </span>
                        <button onClick={() => moreOfThisProduct(productInfo._id)} className=" bg-emerald-500 px-2 rounded-lg text-white"> + </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }

          <form action="/api/checkout_sessions" method="POST">
            <div className="mt-4">
              <input
                required
                type="text"
                placeholder="Seu Nome"
                className="bg-gray-100 w-full rounded-xl px-4 py-2 mb-2"
                name="name" value={name} onChange={e => setName(e.target.value)}
              />
              <input
                required
                type="text"
                placeholder="Nome da rua, numero"
                className="bg-gray-100 w-full rounded-xl px-4 py-2 mb-2"
                name="address" value={address} onChange={e => setAddress(e.target.value)}
              />
              <input
                required
                type="text"
                placeholder="Cidade e CEP"
                className="bg-gray-100 w-full rounded-xl px-4 py-2 mb-2"
                name="city" value={city} onChange={e => setCity(e.target.value)}
              />
              <input
                required
                type="mail"
                placeholder="Endereço de E-mail"
                className="bg-gray-100 w-full rounded-xl px-4 py-2 mb-2"
                name="email" value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <div className="flex my-3">
                <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
                <h3 className="font-bold">R$ {subtotal}</h3>
              </div>
              <div className="flex my-3">
                <h3 className="grow font-bold text-gray-400">Delivery:</h3>
                <h3 className="font-bold">R$ {deliveryPrice}</h3>
              </div>
              <div className="flex my-3 border-t pt-3 border-dashed border-emerald-500">
                <h3 className="grow font-bold text-gray-400">Total:</h3>
                <h3 className="font-bold">R$ {total}</h3>
              </div>
            </div>
            <input type="hidden" name="products" value={selectedProducts.join(',')} />
            {
              total < 1 ?
                <button
                  disabled
                  type="submit"
                  className="bg-gray-300 px-5 py-2 rounded-xl font-bold text-gray-400 w-full my-4 shadow-gray-400 shadow-lg cursor-not-allowed"
                >
                  Pagar R$ {total}
                </button>
                :
                <button
                  type="submit"
                  className="bg-emerald-500 px-5 py-2 rounded-xl font-bold text-white w-full my-4 shadow-emerald-300 shadow-lg"
                >
                  Pagar R$ {total}
                </button>

            }
          </form>
        </Fragment>
      }
    </Layout>
  )
}