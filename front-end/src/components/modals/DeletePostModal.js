import Modal from "react-bootstrap/Modal";
import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";

function DeletePostModal(props) {
  const { currentUser } = useContext(AuthContext);
  const [showDeletePostModal, setShowDeletePostModal] = useState(props.isOpen);
  const [post, setPost] = useState(props.deletePost);

  const handleDeletePost = () => {
    //console.log("post", post);
    axios
      .delete(`http://localhost:4000/posts/${post._id}`, {
        headers: {
          token: currentUser.accessToken,
        },
      })
      .then(function (response) {
        if (response.data.deletedCount === 1) {
          alert("Successfully deleted!");
        } else {
          alert("Deleted fail!");
        }
      })
      .catch(function (error) {
        alert(error);
      });
    handleCloseDeleteModal();
  };

  const handleCloseDeleteModal = () => {
    setShowDeletePostModal(false);
    setPost(null);
    props.handleClose();
  };

  return (
    <div>
      <Modal show={showDeletePostModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comfirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure about deleting? </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default DeletePostModal;
