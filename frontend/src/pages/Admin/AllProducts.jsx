import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { useEffect } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (isError) {
    return <div className="text-white">Error loading products</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-blac">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-3">
          <div className="text-2xl font-bold text-white mb-4">
            All Products ({products.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gri-cols-4 gap-20">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
              >
                <Link to={`/admin/product/update/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-lg font-semibold text-white">
                        {product?.name}
                      </h5>
                      <p className="text-gray-400 text-xs">
                        {moment(product.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>
                    <p className="text-gray-300 mb-4">
                      {product?.description?.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300"
                      >
                        Update
                        <svg
                          className="w-4 h-4 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                      <p className="text-lg font-bold text-white">
                        $ {product?.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-1/4 p-3 mt-6 md:mt-0">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
