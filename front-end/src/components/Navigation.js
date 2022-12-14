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
  // const auth = getAuth();
  // const [loggedIn, setLoggedIn] = useState(false);
  //
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       setLoggedIn(true);
  //     } else {
  //       setLoggedIn(false);
  //     }
  //   });
  // }, []);
    if(currentUser){
        return(
            <Navbar bg="light" expand="lg">
                <Container>
                        <Nav>
                            
                            <NavLink to="/" style={{ textDecoration: 'none' , color:'black' ,marginRight:"25px"}} xs={2} >
                                <img src="imgs/pawicon.png" style={{ width: '2rem' }}></img>
                                Paw Street
                            </NavLink>
                            <NavLink to="/" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>Home</NavLink>

                            <NavLink to="/MyPosts" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>My Posts</NavLink>

                            <NavLink to="/Profile" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>Profile</NavLink>

                            <NavLink to="/NewPost" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>New Post</NavLink>

                            <NavLink to="/Detail" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>temp</NavLink>

                            <NavLink to="/Edit" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>temp2</NavLink>


                        </Nav>


                </Container>
            </Navbar>
        );
    }else{
        return(
            <Navbar bg="light" expand="lg">
                <Container>

                        <Nav>
                            <NavLink to="/" style={{ textDecoration: 'none' , color:'black' ,marginRight:"25px"}} xs={2} >
                                <img src="imgs/pawicon.png" style={{ width: '2rem' }}></img>
                                Paw Street
                            </NavLink>

                            <NavLink to="/" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>Home</NavLink>

                            <NavLink to="/SignIn" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>Sign In</NavLink>

                            <NavLink to="/SignUp" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>Sign Up</NavLink>

                            <NavLink to="/Detail" style={{ textDecoration: 'none' , color:'gray', marginRight:"10px"}}>temp</NavLink>

                        </Nav>

                </Container>
            </Navbar>
        );
    }

  // const NavigationAuth = () => {
  //   return (
  //       <Navbar bg="light" expand="lg">
  //         <Container>
  //             <Navbar.Brand href="/">
  //                 <img
  //                     alt=""
  //                     src="imgs/pawicon.png"
  //                     width="30"
  //                     height="30"
  //                     className="d-inline-block align-top"
  //                 />{' '}
  //                 Paw Street
  //             </Navbar.Brand>
  //             <Navbar.Toggle aria-controls="basic-navbar-nav" />
  //             <Navbar.Collapse id="basic-navbar-nav">
  //             <Nav>
  //
  //               <Nav.Link href="/">Home</Nav.Link>
  //               <Nav.Link href="/MyPosts">My Posts</Nav.Link>
  //               <Nav.Link href="/Profile">Profile</Nav.Link>
  //               <Nav.Link href="/NewPost">New Post</Nav.Link>
  //               <Nav.Link href="/Detail">temp</Nav.Link>
  //               <Nav.Link href="/Edit">temp2</Nav.Link>
  //             </Nav>
  //             </Navbar.Collapse>
  //
  //         </Container>
  //       </Navbar>
  //   );
  // };
  //
  // const NavigationNonAuth = () => {
  //   return (
  //       <Navbar bg="light" expand="lg">
  //         <Container>
  //             <Nav>
  //               <Nav.Link href="/">Home</Nav.Link>
  //               <Nav.Link href="/SignIn">Sign In</Nav.Link>
  //               <Nav.Link href="/SignUp">Sign Up</Nav.Link>
  //               <Nav.Link href="/Detail">temp</Nav.Link>
  //             </Nav>
  //         </Container>
  //       </Navbar>
  //   );
  // };
  //
  // if (currentUser) return <NavigationAuth />;
  // else return <NavigationNonAuth />;

};
export default Navigation;
