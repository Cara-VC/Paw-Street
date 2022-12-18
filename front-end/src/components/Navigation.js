import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SignOutButton from "./SignOut";
import "../App.css";
import {Pagination, Card, Button, Container, Row, Form, Col, Stack} from "react-bootstrap";


import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {NavbarBrand} from "react-bootstrap";


const Navigation = () => {
    const { currentUser } = useContext(AuthContext);

    if(currentUser){
        return(
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            
                            <NavLink to="/" style={{ textDecoration: 'none' , color:'black' ,marginRight:"25px"}} xs={2} >
                                <img src="imgs/pawicon.png" alt="Paw Street Logo" style={{ width: '2rem' }}></img>
                                Paw Street
                            </NavLink>
                            <NavLink to="/" style={{ textDecoration: 'none' , color:'#737373', marginRight:"10px"}}>Home</NavLink>

                            <NavLink to="/MyPosts" style={{ textDecoration: 'none' , color:'#737373', marginRight:"10px"}}>My Posts</NavLink>

                            <NavLink to="/NewPost" style={{ textDecoration: 'none' , color:'#737373', marginRight:"10px"}}>New Post</NavLink>

                            <NavLink to="/Profile" style={{ textDecoration: 'none' , color:'#737373', marginRight:"10px"}}>Hello, {currentUser.displayName}</NavLink>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }else{
        return(
            <Navbar bg="light" expand="lg">
                <Container>

                        <Nav>
                            <NavLink to="/" style={{ textDecoration: 'none' , color:'black' ,marginRight:"25px"}} xs={2} >
                                <img src="imgs/pawicon.png"  alt="Paw Street Logo" style={{ width: '2rem' }}></img>
                                Paw Street
                            </NavLink>

                            <NavLink to="/" style={{ textDecoration: 'none' , color:'#737373', marginRight:"10px"}}>Home</NavLink>

                            <NavLink to="/SignIn" style={{ textDecoration: 'none' , color:'#737373', marginRight:"10px"}}>Sign In</NavLink>

                            <NavLink to="/SignUp" style={{ textDecoration: 'none' , color:'#737373', marginRight:"10px"}}>Sign Up</NavLink>

                        </Nav>

                </Container>
            </Navbar>
        );
    }


};
export default Navigation;
