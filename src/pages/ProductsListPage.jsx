import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductTable from "../components/products/ProductTable";
import { Plus } from "lucide-react";
import { Package2 } from "lucide-react";
import { Star } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Boxes } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { Search } from "lucide-react";
import { Tag } from "lucide-react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/product";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [subcategory, setsubCategory] = useState("");
  const [lodding, setLodding] = useState(true);
  
  console.log(category);
  useEffect(() => {
  //   const fetchData=async()=>{
  //     try{
  //        const filters = category === "all"
  //       ? {}
  //       : { category: category };
  //       console.log(filters)
  //     const res=await getProducts(filters)
  //     setProducts(res.data.products)
  //     console.log(res.data.products)
  //   }
  //   catch(error){
  //     console.log(error)
  //   }
  // }
  // fetchData()
  
    async function getData() {
      try {
        const data = await axios.get(
          "https://e-commerce-api-3wara.vercel.app/products",
        );
        setProducts(data.data.products);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLodding(false);
      }
    }

    getData();
  }, []);

  console.log(products);

  const inStock = products.filter((product) => product.stock > 0).length;
  const outStock = products.filter((product) => product.stock === 0).length;

  const featured = products.filter(
    (product) => product.featured === true,
  ).length;
  const total = products.length;

  const arr = [
    {
      icon: <Package2 className="text-[var(--text)]  "/>,
      num: total,
      text: "Total",
    },
    {
      icon: <Star  className="text-[var(--text)]"/>,
      num: featured,
      text: "Featured",
    },
    {
      icon: <TrendingUp className="text-[var(--text)]" />,
      num: inStock,
      text: "In Stock",
    },
    {
      icon: <Boxes  className="text-[var(--text)]"/>,
      num: outStock,
      text: "Out of Stock",
    },
  ];
  function handlefilter() {
    setShowFilter(!showFilter);
  }

  const filterProducts = products.filter((product) => {
    if (!product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (category !== "all") {
      if (product.category !== category) {
        return false;
      }
    }
    if (
      !product.subcategory.toLowerCase().includes(subcategory.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

    const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 6;
const totalPages = Math.ceil(filterProducts.length / productsPerPage);

const startIndex = (currentPage - 1) * productsPerPage;
const endIndex = startIndex + productsPerPage;

const currentProducts = filterProducts.slice(startIndex, endIndex);
  return (
    <div className="bg-gray-100 m-10 border rounded-2xl " style={{background:"var(--surface)" ,border:"1px solid var(--border-strong)"}}>
      <div className="flex flex-col m-10 ">
        {lodding ? (
        <Spinner/>
        ) : (
          <AddProductButton  />
        )}

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-10" >
          {arr.map((item, index) => {
            return (
              <div
                key={index}
                className="border flex flex-col gap-2 px-6 py-8 rounded-2xl"
                style={{background:"var(--surface)" ,border:"1px solid var(--border-strong)"}}
              >
                <div>{item.icon}</div>
                <div>
                  <p>{item.num}</p>
                  <p>{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border p-4 rounded-2xl" style={{background:"var(--surface)" ,border:"1px solid var(--border-strong)"}}>
          <div className="grid grid-cols-12 gap-4 py-4">
            <div className="col-span-12 sm:col-span-6 md:col-span-8 relative" >
              <Search
                size={25}
                className="absolute pl-2 top-1/2 left-1 opacity-30  -translate-y-1/2"
              />
              <input
            
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Products"
                className=" w-full py-4 rounded-lg pl-8 border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-4 col-span-12 sm:col-span-6 md:col-span-4" >
              <Button
                onClick={handlefilter}
                className="  cursor-pointer rounded-lg flex justify-center items-center gap-1 md:gap-2 sm:flex-1 "
              >
                <span>
                  <SlidersHorizontal size={15} className="text-sm" />
                </span>
                <span className="text-xlg">Filter</span>
              </Button>
              <Button className=" p-2 cursor-pointer flex-1 rounded-lg flex justify-center items-center gap-1 sm:flex-1">
                <span>
                  <Search size={15} />
                </span>
                <span>Search</span>
              </Button>
            </div>
          </div>

          <div className={`${showFilter ? "block" : "hidden"} mt-4`} >
            <hr style={{background:"var(--surface)" ,border:"1px solid var(--border-strong)"}}></hr>

            <div className="grid grid-cols-12 gap-4 py-4 w-full">
              <div className="flex flex-col col-span-12 sm:col-span-6 gap-2 w-full">
                <div className="flex gap-2 items-center">
                  <Boxes size={15} />
                  <p>Category</p>
                </div>

                <select
                  className="w-full border p-2 rounded-lg border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{background:"var(--surface)"}}
                >
                  <option value="all">All</option>
                  <option value="electronics">Electronics</option>
                  <option value="phones">Phones</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home</option>
                  <option value="beauty">Beauty</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              <div className="flex flex-col col-span-12 sm:col-span-6 gap-2"   >
                <div className="flex gap-2 items-center">
                  <Tag size={15} />
                  <p>Category</p>
                </div>

                <input
                  value={subcategory}
                  onChange={(e) => setsubCategory(e.target.value)}
                  placeholder="e.g SmartPhones"
                  className="w-full border p-2 rounded-lg border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none"
                />
              </div>
              {/* / */}
            </div>
          </div>
        </div>

        {/* 
         {lodding ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        // <div>ss</div>

        <ProductTable products={filterProducts} />
      )} */}
        {lodding ? (
        <Spinner/>
        ) : (currentProducts.length!==0?
          <ProductTable products={currentProducts} setProducts={setProducts} lodding={lodding} setLodding={setLodding}/>:<EmptyState/>
        )}
      </div>

          {currentProducts.length!==0?<Pagination setCurrentPage={setCurrentPage} totalPages={totalPages} currentPage={currentPage}/>:""}
    </div>
  );
}

function AddProductButton() {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between md:items-center p-4 border rounded-2xl mb-10 bg-gradient-to-r from-orange-100 to-white" style={{ border:"1px solid var(--border-strong)"}}>
      <div className="flex gap-4 items-center py-6" >
        <div className="border p-2 rounded-lg">
          <Package2 />
        </div>
        <div>
          <p className="[letter-spacing:2px]">Product Dashboard</p>
          <h1 className="text-3xl font-bold">Products</h1>
        </div>
      </div>

      <div>
        <Button className="w-full group flex gap-2 items-center justify-center border py-3 px-3 rounded-2xl shadow-[0_4px_12px_rgba(249,115,22,0.25)]" onClick={()=> {navigate("/dashboard/products/add")} }>
          <span className="inline-block transition-all duration-200 group-hover:rotate-90 text-lg leading-none">
            <Plus />
          </span>
          <span className="inline-block text-sm font-bold">Add Product</span>
        </Button>
      </div>

  
    </div>
  );
}
