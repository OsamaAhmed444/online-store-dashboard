import React from 'react'

const products = [
  {
    id: 1,
    name: "Iphone 15 pro max",
    price: 50000,
    stock: 10,
    image: "https://i2.wp.com/images.macrumors.com/t/CiGE1QgZcRMY8FQ7reGRx2W5_EE=/2500x/article-new/2023/08/iPhone-15-Blue-Top-Feature.jpg"
  },
  {

    id: 2,
    name: "Samsung Galaxy S24",
    price: 40000,
    stock: 15,
    image: "https://media.techz.vn/media2019/upload2019/2023/12/24/galaxy-s24-ultra-sap-1703147623.jpg"
  },
  {
    id: 3,
    name: "MacBook Air",
    price: 60000,
    stock: 8,
    image: "https://cdnp0.stackassets.com/b31f8db72b6869ee50b146f623f6c72b8df0c6bf/store/d9c489af31f6402c7945d0da72f8feae469e2fef60bf989ef1b6b2b115f7/product_346244_product_shots3.jpg",
  },
  {
    id: 4,
    name: "AirPods Pro",
    price: 10000,
    stock: 20,
    image: "https://applegod.ru/upload/iblock/87d/0lzm76cqsah7hiamknyedq96o8xjwnp1.jpg",
  }
]

export default function ProductTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {
          products.map((product) => (
            <tr key={product.id}>
              <td>
                <img src={product.image}
                  alt={product.name}
                  width="80"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
            </tr>
          ))
        }

      </tbody>
    </table>
  )
}

