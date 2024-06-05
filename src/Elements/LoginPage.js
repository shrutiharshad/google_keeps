import React from 'react';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import Column from 'antd/es/table/Column';
import Homepage from './Homepage';
import { useNavigate } from "react-router-dom";


const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
const LoginPage = () => {
    const navigate = useNavigate()

    const onFinish = (values) => {
        console.log('Success:', values);
        localStorage.setItem("Email_id", values.email)
        navigate('/Homepage')
    };
    return (<div style={{ display: 'flex', justifyContent: 'center' }}>
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
                flexDirection: Column,

                justifyContent: 'center'
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item label="Email" name='email'
                rules={[
                    { required: true, message: 'Email is required' },
                    { type: "email", message: 'Email is invalid' }
                ]}>
                <Input placeholder='Enter your Email' />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type='primary' htmlType='submit' >
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </div>);
};
export default LoginPage;