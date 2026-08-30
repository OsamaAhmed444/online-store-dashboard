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

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [subcategory, setsubCategory] = useState("");
  const [lodding, setLodding] = useState(true);
  console.log(category);
  useEffect(() => {
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
      icon: <Package2 />,
      num: total,
      text: "Total",
    },
    {
      icon: <Star />,
      num: featured,
      text: "Featured",
    },
    {
      icon: <TrendingUp />,
      num: inStock,
      text: "In Stock",
    },
    {
      icon: <Boxes />,
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

  return (
    <div className="bg-gray-100 m-10 border border-amber-300">
      <div className="flex flex-col m-10">
        {lodding ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <AddProductButton />
        )}

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-10">
          {arr.map((item, index) => {
            return (
              <div
                key={index}
                className="border flex flex-col gap-2 px-6 py-8 rounded-2xl"
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

        <div className="border p-4 rounded-2xl">
          <div className="grid grid-cols-12 gap-4 ">
            <div className="col-span-12 sm:col-span-7 relative">
              <Search
                size={25}
                className="absolute pl-2 top-1/2 left-1 opacity-30  -translate-y-1/2"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Products"
                className="border w-full p-2 rounded-lg pl-8 "
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-4 col-span-12 sm:col-span-5 ">
              <button
                onClick={handlefilter}
                className="bg-blue-400 p-2 cursor-pointer rounded-lg flex justify-center items-center gap-1 md:gap-2 sm:flex-1 "
              >
                <span>
                  <SlidersHorizontal size={15} className="text-sm" />
                </span>
                <span className="text-xlg">Filter</span>
              </button>
              <button className="bg-blue-400 p-2 cursor-pointer flex-1 rounded-lg flex justify-center items-center gap-1 sm:flex-1">
                <span>
                  <Search size={15} />
                </span>
                <span>Search</span>
              </button>
            </div>
          </div>

          <div className={`${showFilter ? "block" : "hidden"} mt-4`}>
            <hr></hr>

            <div className="grid grid-cols-12 gap-4 py-4 w-full">
              <div className="flex flex-col col-span-12 sm:col-span-6 gap-2 w-full">
                <div className="flex gap-2 items-center">
                  <Boxes size={15} />
                  <p>Category</p>
                </div>

                <select
                  className="w-full border p-2 rounded-lg"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="electronics">Electronics</option>
                  <option value="Phones">Phones</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div className="flex flex-col col-span-12 sm:col-span-6 gap-2">
                <div className="flex gap-2 items-center">
                  <Tag size={15} />
                  <p>Category</p>
                </div>

                <input
                  value={subcategory}
                  onChange={(e) => setsubCategory(e)}
                  placeholder="e.g SmartPhones"
                  className="w-full border p-2 rounded-lg"
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
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <ProductTable products={filterProducts} setProducts={setProducts} />
        )}
      </div>
    </div>
  );
}

function AddProductButton() {
  return (
    <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between md:items-center p-4 border rounded-2xl mb-10 ">
      <div className="flex gap-4 items-center">
        <div className="border p-2 rounded-lg">
          <Package2 />
        </div>
        <div>
          <p className="[letter-spacing:2px]">Product Dashboard</p>
          <h1 className="text-3xl font-bold">Products</h1>
        </div>
      </div>

      <div>
        <button className="w-full group flex gap-2 items-center justify-center border rounded-sm py-1.5 px-3">
          <span className="inline-block transition-all duration-200 group-hover:rotate-90 text-lg leading-none">
            <Plus />
          </span>
          <span className="inline-block text-sm font-bold">Add Product</span>
        </button>
      </div>
    </div>
  );
}
