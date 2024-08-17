import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  useFetchUserDataQuery,
  useDeleteUserMutation,
  useUpdateUseroneMutation,
} from "../slices/adminApiSlices.js";
import { LiaUserEditSolid } from "react-icons/lia";
import { TiDelete } from "react-icons/ti";
import { Button, Modal } from "react-bootstrap";
import AdminUserProfile from "./AdminUserProfile";
import AdminCreateUser from "./AdminCreateUser";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.5rem",
  fontSize: "1.2rem",
  border: "none",
  borderRadius: "0.25rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease",
};

const columns = (handleEdit, handleDelete) => [
  {
    name: "S.No",
    selector: (row, index) => index + 1,
    sortable: true,
  },
  {
    name: "Username",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Operations",
    cell: (row) => (
      <div className="d-flex justify-content-around">
        <Button
          variant="primary"
          onClick={() => handleEdit(row)}
          style={{ ...buttonStyle, backgroundColor: "#007bff" }}
          className="me-2"
        >
          <LiaUserEditSolid />
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDelete(row._id)}
          style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
        >
          <TiDelete />
        </Button>
      </div>
    ),
  },
];

const AdminHome = () => {
  const [filterText, setFilterText] = useState("");
  const { data: users, error, isLoading, refetch } = useFetchUserDataQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUseroneMutation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id).unwrap();
          refetch();
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete the user:", error);
          Swal.fire("Error!", "Failed to delete the user.", "error");
        }
      }
    });
  };

  const handleUpdate = async (updatedUser) => {
    try {
      await updateUser(updatedUser).unwrap();
      setShowEditModal(false);
      refetch();
    } catch (error) {
      console.error("Failed to update the user:", error);
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {}, [users]);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error loading users</div>;

  // Filter the user data based on the search input
  const filteredData = users?.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-white">ADMIN DASHBOARD</h1>
      <br />
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by username or email"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />
        <Button
          variant="success"
          style={{ marginLeft: "20px" }}
          onClick={() => setShowCreateModal(true)}
        >
          Create User 
        </Button>
        
      </div>

      <DataTable
        title="Users"
        columns={columns(handleEdit, handleDelete)}
        data={filteredData || []}
      />
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminUserProfile
            user={currentUser}
            onUpdate={handleUpdate}
            isLoading={isLoading}
          />
        </Modal.Body>
      </Modal>
      <AdminCreateUser
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refetch={refetch}
      />
    </div>
  );
};

export default AdminHome;