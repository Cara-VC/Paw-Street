import React, {useContext, useEffect, useRef, useState} from 'react';
import { Row, Container, Form, Button, Card, InputGroup,Col } from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ReactMapGL, { Map, Marker } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import {AuthContext} from '../firebase/Auth';
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Carousel from 'react-bootstrap/Carousel';


export default function Detail() {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [originalData, setOriginalData] = useState();
    const mapContainer = useRef(null);
    const map = useRef(null);

    const [update, setUpdate] = useState(1);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const [lng, setLng] = useState(-74.0254848);
    const [lat, setLat] = useState(40.7446316);
    const lnglat = useContext(CurrentLocationLngLatContext);
    // const [curMarkerLngLat, setCurMarkerLngLat] = useState([lng, lat]);
    const [zoom, setZoom] = useState(9);
    const popup1 = new mapboxgl.Popup({ offset: 25 })
        .setHTML("<h1>Your current location</h1>");
    const currentLocationMarker = new mapboxgl.Marker()
        .setLngLat(lnglat.current)
        .setPopup(popup1)


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
                // await setOriginalData(singleFakeData);
                navigator.geolocation.getCurrentPosition(function(position) {

                    lnglat.current=[position.coords.longitude, position.coords.latitude];
                    currentLocationMarker.setLngLat(lnglat.current);


                });

            } catch (e) {
                console.log(e);
            }

        }

        fetchData();

    }, []);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });
        // marker.addTo(map.current);
        currentLocationMarker.addTo(map.current);

    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

    });

    useEffect( () => {

        if(originalData){
            const marker = new mapboxgl.Marker()
                .setLngLat([originalData.longitude, originalData.latitude])
                .setPopup((new mapboxgl.Popup({ offset: 25 })
                    .setHTML("<Container><h1>"+originalData.title+"</h1><p>"+originalData.content+"</p></Container>")));
            marker.addTo(map.current);
        }
    },[originalData]);

    if(location.state){

        return (

            <Container>
                <Row>
                    {
                        !originalData ? null :
                            <Col>



                                <Card className="square border border-5"
                                      style={{ width: '40rem' }}
                                      border={ originalData.status === 'lost' ? "danger" : originalData.status === 'found' ? "primary" : "success" }>
                                    <Card.Header className="text-center">{originalData.status.toUpperCase()}</Card.Header>

                                    {!originalData.image[0] ? (
                                        <Card.Img variant="top" src="/imgs/missingPicture.jpeg" />

                                    ) : null}
                                    <Carousel activeIndex={index} onSelect={handleSelect}>
                                        {
                                            originalData.image.map((ele) => {
                                            return (
                                                <Carousel.Item>
                                                    <img
                                                        style={{ width: "200px" }}
                                                        className="d-block w-100"
                                                        src={ele}
                                                        alt="First slide"
                                                    />
                                                </Carousel.Item>
                                            )

                                        })

                                        }

                                    </Carousel>
                                    <Card.Body>
                                        <Card.Title>{originalData.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted text-end">Pet Name:
                                            {originalData.petName}
                                        </Card.Subtitle>
                                        <Card.Subtitle className="mb-2 text-muted text-end">Posted by {originalData.userName} at {
                                            new Date(originalData.time).getDate()+
                                            "/"+(new Date(originalData.time).getMonth()+1)+
                                            "/"+new Date(originalData.time).getFullYear()+
                                            " "+new Date(originalData.time).getHours()+
                                            ":"+new Date(originalData.time).getMinutes()+
                                            ":"+new Date(originalData.time).getSeconds()
                                        }</Card.Subtitle>

                                        <Card.Text>
                                            {originalData.content}
                                        </Card.Text>
                                        {/*<Button variant="primary" onClick={()=>{*/}
                                        {/*    navigate("/Edit",{state:{postId: location.state.postId}});*/}
                                        {/*    }}>Edit</Button>*/}

                                        {/*<Button variant="primary" onClick={()=>{*/}

                                        {/*    }}>Delete</Button>*/}
                                        {currentUser && currentUser.uid == originalData.userId ? (
                                            <Button variant="primary" onClick={()=>{
                                                navigate("/Edit",{state:{postId: location.state.postId}});
                                            }}>Edit</Button>

                                        ) : null}
                                        {currentUser && currentUser.uid == originalData.userId ? (
                                                <Button variant="primary" onClick={()=>{

                                                    handleShow();

                                                }}>Delete</Button>


                                        ) : null}

                                    </Card.Body>
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Delete Comfirm</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Are you sure about deleting?</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                No
                                            </Button>
                                            <Button variant="danger" onClick={async () => {
                                                await axios.delete(
                                                    `http://localhost:4000/posts/${originalData._id}`)
                                                    .then(function (response) {
                                                        if(response.data.deletedCount == 1){
                                                            alert("Successfully deleted!");
                                                           navigate("/");
                                                        }
                                                        else{
                                                            alert("Deleted fail!");
                                                        }
                                                    })
                                                    .catch(function (error) {
                                                        // handle error
                                                        alert(error);
                                                    });

                                                handleClose();
                                            }}>
                                                Yes
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>

                                    <Card.Body>
                                        <Card.Title>Comments:</Card.Title>
                                        <Form.Group className="mb-3" xs={10}>
                                            <Form.Label>Leave a comment:</Form.Label>
                                            <Row>
                                                <Form.Control as="textarea" type="input" id="comment" xs={10}/>

                                                {currentUser ? (
                                                    <Button onClick={async () => {
                                                        let newComment = {

                                                            postId:location.state.postId,
                                                            userId:currentUser.uid,
                                                            userName:currentUser.displayName,
                                                            comment:document.getElementById("comment").value

                                                        };
                                                        await axios.post(
                                                            `http://localhost:4000/posts/${originalData._id}/comment`,newComment)
                                                            .then(function (response) {

                                                                alert("Successfully commented!");
                                                                setUpdate(update => update + 1);
                                                                document.getElementById("comment").value = "";

                                                            })
                                                            .catch(function (error) {
                                                                // handle error
                                                                alert(error);
                                                            });
                                                    }}>Comment as {currentUser.displayName}</Button>

                                                ) : (
                                                    <Button disabled onClick={() => {

                                                    }}>Log in First</Button>
                                                )}
                                            </Row>

                                        </Form.Group>

                                        {originalData.comments.length === 0 ? "No comment" :
                                            originalData.comments.map((ele) => {
                                                return (
                                                    <Card>
                                                        <Card.Text>
                                                            {ele.comment}
                                                        </Card.Text>
                                                        <Card.Subtitle className="mb-2 text-muted text-end">Commented by {ele.userName} at {
                                                            new Date(ele.time).getDate()+
                                                            "/"+(new Date(ele.time).getMonth()+1)+
                                                            "/"+new Date(ele.time).getFullYear()+
                                                            " "+new Date(ele.time).getHours()+
                                                            ":"+new Date(ele.time).getMinutes()+
                                                            ":"+new Date(ele.time).getSeconds()
                                                        }</Card.Subtitle>
                                                        {currentUser && ((currentUser.uid == ele.userId) || (currentUser.uid == originalData.userId)) ? (
                                                            <Button variant="primary" onClick={()=>{
                                                                handleShow2();
                                                            }}>Delete</Button>

                                                        ) : null}

                                                        <Modal show={show2} onHide={handleClose2}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Delete Comfirm</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>Are you sure about deleting?</Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={handleClose2}>
                                                                    No
                                                                </Button>
                                                                <Button variant="danger" onClick={async () => {
                                                                    await axios.delete(
                                                                        `http://localhost:4000/posts/${originalData._id}/${ele._id}`)
                                                                        .then(function (response) {

                                                                            alert("Successfully deleted!");
                                                                            setUpdate(update => update + 1);

                                                                        })
                                                                        .catch(function (error) {
                                                                            // handle error
                                                                            alert(error);
                                                                        });

                                                                    handleClose2();
                                                                }}>
                                                                    Yes
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </Card.Body>
                                </Card>

                            </Col>

                    }
                    <Col className="col-6 col-sm-4">
                        <div ref={mapContainer} className="map-container" />
                        <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                    </Col>
                </Row>
            </Container>

        )
    }else{
        alert("No param passing!")
        return(
            <div className="col-6 col-sm-4">
                <div ref={mapContainer} className="map-container" />
                <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                <Navigate to="/"/>
            </div>
        )
    }


}