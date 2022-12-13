import React, {useContext, useEffect, useRef, useState} from 'react';
import {Container, Form, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";
import {AuthContext} from '../firebase/Auth';
import Profile from "./Profile";


function NewPost() {


    const { currentUser } = useContext(AuthContext);


    // console.log(user.uid,user.displayName)

    // const displayName = useRef(user.displayName);

    // useEffect(() => {
    //
    //     async function set() {
    //         try {
    //
    //             await uid.current = user.uid;
    //
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    //
    //     set();
    //
    // }, []);//////////

    // console.log(uid.current,1)
    // console.log(user.uid,2)


    if (currentUser) {
        // console.log(user.uid,1)
    return (
        <div className="container">

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
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="input" placeholder="Title" id="title" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Pet Name</Form.Label>
                    <Form.Control type="input" placeholder="Pet Name" id="petName"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" type="input" placeholder="What's new" id="content"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Upload pictures</Form.Label>
                    <Form.Control type="file" multiple accept="image/*" id="image"/>
                </Form.Group>

                <Button variant="primary" type="submit" onClick={(e) => {

                    e.preventDefault();

                    let newPost = {

                        title: document.getElementById("title").value,
                        userId: currentUser.uid,
                        userName: currentUser.displayName,
                        // userId:"EtF1bMmYrScbXgLtmtT5NVVEjGi1",
                        // userName:"夏继远",
                        status: document.getElementById("status").value,
                        content: document.getElementById("content").value,
                        image: document.getElementById("image").files,
                        longitude:-74.0792,
                        latitude:40.7163,
                        petName: document.getElementById("petName").value
                    };
                    navigator.geolocation.getCurrentPosition(function(position) {
                        newPost.longitude = position.coords.longitude;
                        newPost.latitude = position.coords.latitude;
                    });

                    axios.post('http://localhost:4000/posts/',newPost)
                        .then(function (response) {
                            console.log(response.data);
                        })
                        .catch(function (error) {
                            console.log(error);
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
                    console.log(newPost);
                }}>
                    Submit
                </Button>
            </Form>
        </div>
    )
    }else {
        return <Navigate to="/signin" />;
    }
}

export default NewPost;