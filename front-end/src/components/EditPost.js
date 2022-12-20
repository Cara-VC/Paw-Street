import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Navigate, useLocation, useNavitate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import Profile from "./Profile";
import {checkTitle, checkUserId, checkUserName, checkStatus, checkContent, checkPetName, 
  checkLongitude, checkLatitude, checkImage, checkComment} from "./validation/validation"

function EditPost() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        await axios
          .get(`http://3.94.145.116:4000/posts/${location.state.postId}`)
          .then(function (response) {
            setOriginalData(response.data);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, []);
  if (location.state) {
    if (currentUser) {
      if (originalData) {
        // console.log(originalData);
        let temp = originalData.userId;
        if (currentUser.uid == temp) {
          return (
            <Container>
              <h1>Edit Post</h1>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select id="status" defaultValue={originalData.status}>
                    <option value="story">Story</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="input"
                    placeholder={originalData.title}
                    id="title"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pet Name</Form.Label>
                  <Form.Control
                    type="input"
                    placeholder={originalData.petName}
                    id="petName"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    type="input"
                    placeholder={originalData.content}
                    id="content"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    try{
                      if(document.getElementById("title").value === "" &&
                      document.getElementById("status").value === originalData.status &&
                      document.getElementById("content").value === "" &&
                      document.getElementById("petName").value === ""
                      )  throw "Please edit your change"
                      let newPost = {
                        title:
                          document.getElementById("title").value !== ""
                            ? checkTitle(document.getElementById("title").value)
                            : originalData.title,
                        status:
                          document.getElementById("status").value !== ""
                            ? checkStatus(document.getElementById("status").value)
                            : originalData.status,
                        content:
                          document.getElementById("content").value !== ""
                            ? checkContent(document.getElementById("content").value)
                            : originalData.content,
                        petName:
                          document.getElementById("petName").value !== ""
                            ? checkPetName(document.getElementById("petName").value)
                            : originalData.petName,
                        token: currentUser.accessToken,
                      };
                      //console.log(newPost);
  
                      axios
                        .patch(
                          `http://localhost:4000/posts/${location.state.postId}`,
                          newPost
                        )
                        .then(function (response) {
                          alert("Successfully edit your post!");
                          navigate("/Detail", {
                            state: { postId: response.data._id },
                          });
                        })
                        .catch(function (error) {
                          alert(error);

                        });
                      // axios.get('http://localhost:4000/posts/')
                      //     .then(function (response) {
                      //         // handle success
                      //         console.log(response);
                      //     })
                      //     .catch(function (error) {
                      //         // handle error
                      //         console.log(error);
                      //     });
                    } catch(e){
                      if(!e.message) alert(e)
                      else alert(e.message)
                    }

                  }}
                >
                  Submit
                </Button>
              </Form>
            </Container>
          );
        }
        // console.log(temp,1);
      }
    }

    // console.log(originalData.userId)
    // console.log(`http://localhost:4000/posts/${location.state.postId}`)
    // if(currentUser.uid == originalData.userId)
    // console.log(user.uid,1)
  } else {
    alert("No param passing!");
    return <Navigate to="/signin" />;
  }
}

export default EditPost;
