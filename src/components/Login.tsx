import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Col, Row, Typography } from 'antd';
import { login } from '../redux/services/authService';
import { setTokens, setUser } from '../redux/features/auth/authSlice';
import { getCartItems } from '../redux/services/cartService';
import { setCartItems } from '../redux/features/cart/cartSlice';

const { Title } = Typography;

type FieldType = {
  email?: string;
  password?: string;
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: FieldType) => {
    try {
      const response = await login(values);

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;

        // Dispatch the action to set tokens in Redux store
        dispatch(setTokens({ accessToken, refreshToken }));

        // Dispatch the action to set user in Redux store
        dispatch(setUser(response.data.data));

        // Fetch the latest cart items
        const userId = response.data.data._id;
        getCartItems(userId)
          .then((response) => {
            const cartItems = response.data;
            dispatch(setCartItems(cartItems));
          })
          .catch((error) => {
            console.error('Error fetching cart items:', error);
          });
          console.log('response', response)
          if(response.data.data.role === 'Admin') {
            navigate('/manage-products');
          }
          else {
            navigate('/dashboard');
          }
        
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Row>
        <Col span={8}></Col>
        <Col span={8}>
          <Title level={4}>Login</Title>
        </Col>
        <Col span={8}></Col>
      </Row>
      <Row>
        <Col span={4}></Col>
        <Col span={8}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}></Col>
      </Row>
    </>
  );
};

export default Login;
