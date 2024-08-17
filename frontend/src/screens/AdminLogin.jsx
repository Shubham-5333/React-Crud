import React, { useState } from 'react';
import FormContainer from '../components/FormContainer';
import { Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAdminLoginMutation } from '../slices/adminApiSlices';
import { setAdminCredentials } from '../slices/adminAuthSlices';
import { toast } from 'react-toastify';
import backgroundImage from '../assets/360_F_684592278_xAceXmIN3m7d3AKj52NDAOuXaeRvEJVC.jpg'

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const adminInfo = useSelector(state => state.adminAuth.adminInfo);
    const [adminLogin, { isLoading }] = useAdminLoginMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await adminLogin({ email, password }).unwrap();
            dispatch(setAdminCredentials({ ...res }));
            navigate('/admin/home');
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || err.error);
        }
    };

    // Inline styles
    const backgroundStyle = {
        background: `url(${backgroundImage}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const containerStyle = {
        maxWidth: '500px',
        margin: 'auto',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#333'
    };

    const formGroupStyle = {
        marginBottom: '1rem'
    };

    const buttonStyle = {
        width: '100%',
        padding: '0.5rem',
        fontSize: '1rem'
    };

    return (
        <div style={backgroundStyle}>
            <FormContainer style={containerStyle}>
                <h1 style={headerStyle}>Sign In</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group style={formGroupStyle} controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group style={formGroupStyle} controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    {isLoading && <Loader />}
                    <Button type='submit' variant='primary' style={buttonStyle}>
                        Sign In
                    </Button>
                </Form>
            </FormContainer>
        </div>
    );
};

export default AdminLogin;
