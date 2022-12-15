import React, {useContext, useEffect, useRef, useState} from 'react';
import {Container, Form, Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Navigate ,useLocation, useNavitate } from "react-router-dom";
import {AuthContext} from '../firebase/Auth';
import Profile from "./Profile";


function EditPost() {

    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [originalData, setOriginalData] = useState();


    useEffect(() => {

        async function fetchData() {
            try {
                await axios.get(
                    `http://localhost:4000/posts/${location.state.postId}`)
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
    if(location.state){

        if(currentUser){

            if(originalData){
                // console.log(originalData);
                let temp = originalData.userId;
                if(currentUser.uid == temp){
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
                                    <Form.Control type="input" placeholder={originalData.title} id="title"/>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Pet Name</Form.Label>
                                    <Form.Control type="input" placeholder={originalData.petName} id="petName"/>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control as="textarea" type="input" placeholder={originalData.content} id="content" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Upload pictures</Form.Label>
                                    <Form.Control type="file" multiple accept="image/*" id="image"/>
                                </Form.Group>

                                <Button variant="primary" type="submit" onClick={(e) => {

                                    e.preventDefault();

                                    let newPost = {

                                        title: document.getElementById("title").value != "" ? document.getElementById("title").value : originalData.title,
                                        status: document.getElementById("status").value != "" ? document.getElementById("status").value : originalData.status,
                                        content: document.getElementById("content").value != "" ? document.getElementById("content").value : originalData.content,
                                        image: document.getElementById("image").files != "" ? document.getElementById("image").files : originalData.image,
                                        petName: document.getElementById("petName").value != "" ? document.getElementById("petName").value : originalData.petName

                                    };
                                    console.log(newPost);

                                    axios.patch(`http://localhost:4000/posts/${location.state.postId}`,newPost)
                                        .then(function (response) {
                                            alert("Successfully edit your post!");
                                            navigate("/Detail",{state:{postId: response.data._id}});
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
                                }}>
                                    Submit
                                </Button>
                            </Form>
                        </Container>
                    )
                }
                // console.log(temp,1);

            }
        }


        // console.log(originalData.userId)
        // console.log(`http://localhost:4000/posts/${location.state.postId}`)
        // if(currentUser.uid == originalData.userId)
        // console.log(user.uid,1)

    }else {
        alert("No param passing!")
        return <Navigate to="/signin" />;
    }
}

export default EditPost;