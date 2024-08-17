import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loader from "../components/Loader";
import profile from "../assets/profile.png";

const AdminUserProfile = ({ user, onUpdate, isLoading }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture1, setProfilePicture1] = useState(null);
  const [showImg, setShowImg] = useState();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setShowImg(user.profilePicture);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        let profilePictureUrl;
        if (profilePicture1) {
          const storageRef = ref(storage, `images/${profilePicture1.name}`);
          await uploadBytes(storageRef, profilePicture1);
          profilePictureUrl = await getDownloadURL(storageRef);
        }

        const res = await onUpdate({
          _id: user._id,
          name,
          email,
          password,
          profilePicture: profilePictureUrl || user.profilePicture,
        });
        toast.success("Profile updated");
      } catch (err) {
        console.error("Error updating profile:", err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    setProfilePicture1(file);
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="profilePicture" className="text-center">
        <div className="profile flex justify-center py-4">
          <label htmlFor="profile">
            <img
              src={showImg ? showImg : profile}
              alt="avatar"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </label>
          <input
            type="file"
            id="profile"
            name="profile"
            style={{ display: "none" }}
            onChange={uploadFileHandler}
          />
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
  );
};

export default AdminUserProfile;