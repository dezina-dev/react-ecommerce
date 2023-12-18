import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select } from 'antd';
import { toast } from "react-toastify";
import { register } from '../redux/services/authService';

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  address?: string;
  role?: string;
};
const { Option } = Select;
const Register: React.FC = () => {

  const navigate = useNavigate()
  const onFinish = async (values: any) => {
    try {
      const response = await register(values);

      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
        });
        setTimeout(() => {
          navigate('/login');
        }, 1000)
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

  const handleChange = (value: string) => {
  };

  return (
    <div>
      <h2>Register</h2>
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
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

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
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select
            defaultValue="User"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="User">User</Option>
            <Option value="Admin">Admin</Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
