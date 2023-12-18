import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, message, Upload, FloatButton } from 'antd';
import ProductTable from '../pages/ProductTable';
import { getProducts, deleteProduct, addProduct, getProductbyId, updateProduct } from '../api/productApi';
// import { RcFile } from 'antd/es/upload';
import '../css/ProductManagement.css'

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [editProducts, setEditProducts] = useState<any>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();

    // Set initial values for edit form
    if (editProducts) {
      form.setFieldsValue({
        name: editProducts.name,
        description: editProducts.description,
        price: editProducts.price,
        image: [{ uid: '-1', name: 'image', status: 'done', url: editProducts.image }],
      });
    }
  }, [editProducts, form]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const onEditProduct = async (productId: string) => {
    setIsEditFormVisible(true)
    const response = await getProductbyId(productId);
    setEditProducts(response);
    setImageUrl(response?.image || null);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleChange = async (info: any) => {
    if (info.file.status === 'done') {
      try {

        setImageUrl(info.file.response?.imageUrl || null);
        message.success(`${info.file.name} file uploaded successfully`);
      } catch (error) {
        console.error('Error handling upload success:', error);
        message.error('Error handling upload success. Please try again.');
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleAddProduct = async (values: any) => {
    try {
      // Use the uploaded image URL if available
      if (imageUrl) {
        values.image = imageUrl;
      }

      await addProduct(values);
      fetchProducts();
      form.resetFields();
      setImageUrl(null);
      message.success('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('Error adding product. Please try again.');
    }
  };

  const handleUpdateProduct = async (values: any) => {
    try {
      let productId = editProducts._id
      if (imageUrl) {
        values.image = imageUrl;
      }
      else {
        values.image = values.image[0].url
      }

      let result = await updateProduct(productId, values);
      fetchProducts();
      form.resetFields();
      setEditProducts({})
      setImageUrl(null);
      setIsEditFormVisible(false)
      if (result.success) {
        message.success('Product updated successfully!');
      }
      else {
        message.error('Error: could not update product')
      }
    } catch (error) {
      console.error('Error editing product:', error);
      message.error('Error editing product. Please try again.');
    }
  };

  // const normFile = (e: any) => {
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };

  const showAddForm = () => {
    setEditProducts({})
    setIsEditFormVisible(false)
  }

  return (
    <>
      <FloatButton
        onClick={showAddForm}
        icon={<PlusOutlined />}
        className="float-button"
      />
      <div className="product-management">
        <h2>Product Management</h2>
        <div className="form-container">
          {isEditFormVisible ? (
            <Form
              form={form}
              onFinish={handleUpdateProduct}
              initialValues={{
                name: editProducts?.name,
                description: editProducts?.description,
                price: editProducts?.price,
                image: editProducts?.image
                  ? [{ uid: '-1', name: 'image', status: 'done', url: editProducts.image }]
                  : [],
              }}
            >
              <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="image" label="Image" rules={[{ required: true }]}>
                <Upload
                  name="image"
                  listType="picture"
                  action="http://localhost:3002/products/upload-image"
                  onChange={handleChange}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Product
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form form={form} onFinish={handleAddProduct} style={{ marginBottom: '16px' }}>
              <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="image" label="Image" rules={[{ required: true }]}>
                <Upload
                  name="image"
                  listType="picture"
                  action="http://localhost:3002/products/upload-image"
                  onChange={handleChange}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Product
                </Button>
              </Form.Item>
            </Form>
          )
          }
        </div>

        <ProductTable products={products} onEditProduct={onEditProduct} onDeleteProduct={handleDeleteProduct} />
      </div>
    </>
  );
};

export default ProductManagement;
