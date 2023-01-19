import Footer from "./Footer";
import { ReactNode, useContext, useEffect, useState } from "react";
import { IProductContext, ProductsContext } from "../contexts/ProductsContext";
import { destroyCookie } from "nookies";

type ChildrenProps = {
  children: ReactNode;
};

export default function Layout({ children }: ChildrenProps) {

  const [success, setSuccess] = useState(false);
  const { setSelectedProducts } = useContext(ProductsContext);

  useEffect(() => {
    if (window.location.href.includes('success')) {

      setSelectedProducts({ _id: '' });

      setSuccess(true);

      destroyCookie(null, 'productIdOnCookies')
    }
  }, [setSelectedProducts]);

  return (
    <div>
      <div className="p-5">
        {success && (
          <div className="mb-5 bg-green-400 text-white text-lg p-5 rounded-xl text-center">
            Obrigado pelo seu pedido!
          </div>
        )}
        {children}
      </div>
      <Footer />
    </div>
  )
}