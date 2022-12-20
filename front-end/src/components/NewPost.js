import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase/Firebase";
import {
  checkTitle,
  checkUserId,
  checkUserName,
  checkStatus,
  checkContent,
  checkPetName,
  checkLongitude,
  checkLatitude,
  checkImage,
} from "./validation/validation";

function NewPost() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const lnglat = useContext(CurrentLocationLngLatContext);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      let newPostFormData = new FormData();
      newPostFormData.set(
        "title",
        checkTitle(document.getElementById("title").value)
      );
      newPostFormData.set("userId", checkUserId(currentUser.uid));
      newPostFormData.set("userName", checkUserName(currentUser.displayName));
      newPostFormData.set(
        "status",
        checkStatus(document.getElementById("status").value)
      );
      newPostFormData.set(
        "content",
        checkContent(document.getElementById("content").value)
      );
      newPostFormData.set(
        "petName",
        checkPetName(document.getElementById("petName").value)
      );
      newPostFormData.set("longitude", checkLongitude(lnglat.current[0]));
      newPostFormData.set("latitude", checkLatitude(lnglat.current[1]));
      //newPostFormData.set("token", currentUser.accessToken);

      newPostFormData.append(
        "image",
        checkImage(document.getElementById("image").files[0])
      );

      axios
        .post("http://localhost:4000/posts/", newPostFormData)
        .then(function (response) {
          alert("Successfully create a new post!");
          navigate("/Detail", { state: { postId: response.data._id } });
        })
        .catch(function (error) {
          alert(error);
        });

      //   let newPost = {
      //     title: document.getElementById("title").value,
      //     userId: currentUser.uid,
      //     userName: currentUser.displayName,
      //     status: document.getElementById("status").value,
      //     content: document.getElementById("content").value,
      //     image: [],
      //     longitude: lnglat.current[0],
      //     latitude: lnglat.current[1],
      //     petName: document.getElementById("petName").value,
      //   };
      //   navigator.geolocation.getCurrentPosition(function (position) {
      //     newPost.longitude = position.coords.longitude;
      //     newPost.latitude = position.coords.latitude;
      //   });

      //   const files = document.getElementById("image").files;

      //   for (let file of files) {
      //     const storageRef = ref(
      //       storage,
      //       `images/${currentUser.displayName + new Date()}`
      //     );

      //     await uploadBytesResumable(storageRef, file).then(async () => {
      //       await getDownloadURL(storageRef)
      //         .then(async (url) => {
      //           newPost.image.push(url);
      //         })
      //         .catch((error) => {
      //           alert(error);
      //         });
      //     });
      //   }
      //   await axios
      //     .post("http://localhost:4000/posts/", newPost)
      //     .then(async function (response) {
      //       alert("Successfully create a new post!");
      //       navigate("/Detail", { state: { postId: response.data._id } });
      //     })
      //     .catch(function (error) {
      //       alert(error);
      //     });
    } catch (e) {
      alert(e);
    }
  };

  if (currentUser) {
    // console.log(user.uid,1)
    return (
      <Container>
        <h1>New Post</h1>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select id="status">
              <option value="story">Story</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label for="title">Title</Form.Label>
            <Form.Control id="title" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label for="petName">Pet Name</Form.Label>
            <Form.Control id="petName" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label for="content">Content</Form.Label>
            <Form.Control
              as="textarea"
              type="input"
              placeholder="What's new"
              id="content"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label for="image">Upload pictures</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              id="image"
              name="image"
            />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </Container>
    );
  } else {
    return <Navigate to="/signin" />;
  }
}

export default NewPost;
