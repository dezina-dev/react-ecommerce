import React from 'react';
import { Table, Button } from 'antd';
import '../css/ProductTable.css';

interface ProductTableProps {
  products: any[];
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEditProduct, onDeleteProduct }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => `Rs. ${text}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: any) => (
        <span>
          <Button type="link" onClick={() => onEditProduct(record._id)}>
            Edit
          </Button>
          <Button type="link" onClick={() => onDeleteProduct(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return <Table className="product-table" dataSource={products} columns={columns} />;
};

export default ProductTable;
