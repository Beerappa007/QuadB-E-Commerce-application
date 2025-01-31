import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import "./Users.css";
import { Slide, Flip, ToastContainer, toast } from "react-toastify";

function Users() {
  const [products, setProducts] = useState([]);
  const [searchedProds, setSearchProds] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [editedProduct, setEditedProduct] = useState({});
  let [search, setSearch] = useState("");

  const notify2 = (text) =>
    toast.success(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });

  const fetchProducts = () => {
    axios
      .get("http://localhost:4000/api/users")
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err, "err in axios get products");
      });
  };

  // Call fetchProducts inside useEffect
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = () => {
    // debugger;
    let searched = products.filter(
      (temp) =>
        (temp._id && temp._id === parseInt(search)) ||
        (temp.name && temp.name.toLowerCase().includes(search.toLowerCase())) ||
        (temp.email && temp.email.toLowerCase().includes(search.toLowerCase()))
    );
    setSearchProds(searched);
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditedProduct({ ...product }); // Make a copy of the product to avoid mutating state directly
    setShowEditModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    axios
      .delete(
        `http://localhost:4000/api/products/removeProduct/${selectedProduct.id}`
      )
      .then((res) => {
        if (res.data.result) {
          console.log("deleted sucessfully");
          fetchProducts();
          notify2("Deleted successfully");
        } else {
          console.log("error in deleting");
        }
        setShowDeleteConfirmation(false);
      })
      .catch((err) => {
        console.log(err, "error in axios delete product");
        // Handle error
      });
  };

  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:4000/api/products/updateProduct`, editedProduct)
      .then((res) => {
        if (res.data.result) {
          console.log("updated sucessfully");
          notify2("updated successfully");
          fetchProducts();
        }
        setShowEditModal(false);
      })
      .catch((err) => {
        console.log(err, "error in axios put product");
        // Handle error
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const renderTableRows = () => {
    const dataToRender = searchedProds.length !== 0 ? searchedProds : products;
    console.log(dataToRender);
    return dataToRender.map((product, index) => (
      <tr key={product._id}>
        <td>{index + 1}</td>
        <td>{product._id}</td>
        <td>
          <img
            src={`${process.env.PUBLIC_URL}/images/merchant_logo.png`}
            height="40px"
          />
        </td>
        <td>{product.name}</td>
        <td>{product.email}</td>
        <td>PRO +</td>
        <td style={{ pointerEvents: "none", backgroundColor: "#cccccc" }}>
          <FaRegEdit
            className="order-ic"
            style={{ color: "#006400", pointerEvents: "none" }}
            //   onClick={() => handleEdit(product)}
          />
          <MdDelete
            className="order-ic"
            style={{ color: "#ef233c", pointerEvents: "none" }}
            //   onClick={() => handleDelete(product)}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="container-fluid mt-5">
      <ToastContainer />
      <h1 className="mb-4 text-center">Customers</h1>
      <input
        type="text"
        placeholder="Search Customer Name ,Email  and Product ID "
        onChange={(e) => setSearch(e.target.value)}
        className="form-control search-input"
      />
      <br />
      <div className="table-responsive">
        <Table striped bordered hover className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product ID</th>
              <th>Customer Image</th>
              <th>Customer Name</th>
              <th>Customer Email</th>
              <th>Membership</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editedProduct.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={editedProduct.category}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="qty"
                value={editedProduct.qty}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="newPrice"
                value={editedProduct.newPrice}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{selectedProduct.title}</b>{" "}
          product?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Users;
