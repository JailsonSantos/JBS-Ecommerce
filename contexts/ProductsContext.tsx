import nookies, { parseCookies } from 'nookies';
import { createContext, ReactNode, useEffect, useState } from "react";

export interface IProductContext {
  _id: string;
}

interface ProductsContextType {
  selectedProducts: IProductContext[]
  setSelectedProducts: (products: IProductContext) => void
}

type ProductProviderProps = {
  children: ReactNode;
};


export const ProductsContext = createContext<ProductsContextType>({} as ProductsContextType)

export function ProductsContextProvider({ children }: ProductProviderProps) {

  const { productIdOnCookies } = parseCookies()


  //console.log("product ID COOKIES: ", productIdOnCookies)

  const [selectedProducts, setSelectedProducts] = useState<IProductContext[]>([])

  useEffect(() => {
    if (productIdOnCookies) {
      setSelectedProducts([{ _id: productIdOnCookies }])
    }
  }, [])



  return (
    <ProductsContext.Provider value={{
      selectedProducts, setSelectedProducts
    }
    }>
      {children}
    </ProductsContext.Provider>

  )
}