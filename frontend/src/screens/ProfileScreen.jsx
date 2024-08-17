import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../components/FormContainer';
import { Button, Form } from 'react-bootstrap';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { storage } from '../firebase/config';
import profile from '../assets/profile.png';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import { apiSlice } from '../slices/apiSlice';
import axios from 'axios';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture1, setProfilePicture1] = useState(null);
    const [showImg,setShowImg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading }] = useUpdateUserMutation();

    useEffect(() => {
        setName(userInfo.name)
        setEmail(userInfo.email)
        setShowImg(userInfo.profilePicture)
        console.log(userInfo.profilePicture);
        console.log(userInfo.name);
        console.log(userInfo.email);
        console.log(userInfo.password);
    }, [userInfo.setName, userInfo.setEmail, userInfo.profilePicture])


    useEffect(()=>{
      const handle=async()=>{
        try {
            const res = await axios.get("/api/users/profile"); 
            console.log(res.data.users);
            setName(res.data.users.name);
            setEmail(res.data.users.email);
            setShowImg(res.data.users.profilePicture)
       
        } catch (error) {
            console.log('users')
        }   
      }  
      handle()
    },[])
    

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                let profilePictureUrl 
                if (profilePicture1) {
                    const storageRef = ref(storage, `images/${profilePicture1.name}`);
                    await uploadBytes(storageRef, profilePicture1);
                    profilePictureUrl = await getDownloadURL(storageRef);
                }

                const res = await updateProfile({
                    _id: userInfo._id,
                    name,
                    email,
                    password,
                    profilePicture: profilePictureUrl,
                }).unwrap();

                dispatch(setCredentials({ ...res }));
                toast.success('Profile updated');
            } catch (err) {
                console.error('Error updating profile:', err);
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const uploadFileHandler = (e) => {
        const file = e.target.files[0];
        setProfilePicture1(file);
    };

    return (
        <FormContainer>
            <h1 className="text-center">Update Profile</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="profilePicture" className="text-center">
                    <div className="profile flex justify-center py-4">
                        <label htmlFor="profile">
                            <img
                                src={showImg ? showImg : profile}
                                alt="avatar"
                                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        </label>
                        <input type="file" id="profile" name="profile" style={{ display: 'none' }} onChange={uploadFileHandler} />
                    </div>
                </Form.Group>

                <Form.Group className="my-2" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-2" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>

                {isLoading && <Loader />}
                <div className="text-center">
                    <Button type="submit" variant="primary" className="mt-3">
                        Update
                    </Button>
                </div>
            </Form>
        </FormContainer>
    );
};

export default ProfileScreen;
