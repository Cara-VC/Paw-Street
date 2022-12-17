import Modal from "react-bootstrap/Modal";
import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";

export default function DeleteCommentModal(props) {
  const { currentUser } = useContext(AuthContext);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(
    props.isOpen
  );
  const [post, setPost] = useState(props.deletePost);
  const [comment, setComment] = useState(props.deleteComment);

  const handleDeleteComment = () => {
    axios
      .delete(`http://3.94.145.116:4000/posts/${post._id}/${comment._id}`, {
        headers: {
          token: currentUser.accessToken,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
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
    setShowDeleteCommentModal(false);
    setPost(null);
    setComment(null);
    props.handleClose();
  };

  return (
    <div>
      <Modal show={showDeleteCommentModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comfirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure about deleting? </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleDeleteComment}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
