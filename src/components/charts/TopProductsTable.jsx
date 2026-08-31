import  { useEffect , useState}from 'react'
import axios from 'axios'
import {Spinner} from '../common/Spinner'
import {EmptyState} from '../common/EmptyState'
///////////////////////////////////////////////////
export default function TopProductsTable() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
//
useEffect(() => {
 const fetchTopProducts = async () =>{
   try{
    setLoading(true);
    const response = await axios.get('https://e-commerce-api-3wara.vercel.app/orders/admin/dashboard')
    //
   const allProducts = response.data.dashboard.topProducts || [];
    //
    setProducts(filteredProducts); 
    setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTopProducts();
},[]);

if (loading) return <Spinner />;
 if (error) return <EmptyState message={error} />;

  return (
    <div className="overflow-x-auto bg-[#FFF7ED] dark:bg-[#1F2937] shadow-md rounded-lg p-6 border border-[#FFEDD5] dark:border-gray-800 transition-colors">
      <h3 className="text-lg font-bold mb-4 text-[#1F2937] dark:text-[#FFF7ED]">Top Product</h3>
      <table className="min-w-full divide-y divide-[#FFEDD5] dark:divide-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-3 text-right text-xs text-center font-medium text-[#9CA3AF] uppercase">product Name</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase">Sales</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#FFEDD5] dark:divide-gray-800">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-[#FFEDD5] dark:hover:bg-gray-800 transition-colors">
              <td className="py-3 px-4">
                  <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1F2937] dark:text-[#FFF7ED] font-medium">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F97316] font-bold">{product.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

