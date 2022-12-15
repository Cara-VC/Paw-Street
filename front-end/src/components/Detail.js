import React, {useContext, useEffect, useRef, useState} from 'react';
import { Row, Container, Form, Button, Card, InputGroup } from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ReactMapGL, { Map, Marker } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import {AuthContext} from '../firebase/Auth';
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";


export default function Detail() {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [originalData, setOriginalData] = useState();
    const mapContainer = useRef(null);
    const map = useRef(null);

    const [update, setUpdate] = useState(1);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
    const marker = new mapboxgl.Marker()
        .setLngLat(lnglat.current)

    useEffect(() => {

        async function fetchData() {
            // let singleFakeData = {
            //     id:2,
            //     title:"I dont love my kitty",
            //     time:1670443903704,
            //     userName:"John",
            //     userId:1,
            //     status:"story",
            //     content:"this is story 1 and the rest of this is useless blahblahblahblahblahblahblahblahblahblahblahblahblah" +
            //         "blahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblah",
            //     image:[],
            //     longitude:"",
            //     latitude:"",
            //     comments:[{
            //         commentId:1,
            //         userId:1,
            //         userName:"John",
            //         commentContent:"I have seen her many times",
            //         time:1670443903704
            //     },{
            //         commentId:2,
            //         userId:1,
            //         userName:"John",
            //         commentContent:"I havdfdffdn her many times",
            //         time:1670443903704
            //     },{
            //         commentId:3,
            //         userId:1,
            //         userName:"John",
            //         commentContent:"I have seensadfasdfadfasdfaes",
            //         time:1670443903704
            //     }],
            //     petName:"kitty"
            // };
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
                {
                    !originalData ? null :
                        <div>

                            <Card className="square border border-5"
                                  style={{ width: '40rem' }}
                                  border={ originalData.status === 'lost' ? "danger" : originalData.status === 'found' ? "primary" : "success" }>
                                <Card.Header className="text-center">{originalData.status.toUpperCase()}</Card.Header>
                                <Card.Img variant="top" src="cat.jpeg" />
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
                                        <Button variant="danger" onClick={() => {
                                            axios.delete(
                                                `http://localhost:4000/posts/${originalData._id}`)
                                                .then(function (response) {
                                                    if(response.data.deletedCount == 1){
                                                        alert("Successfully deleted!");
                                                        setUpdate(update+1);
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
                                            <Form.Control as="textarea" type="input" id="newComment" xs={10}/>
                                            {/*<Button onClick={() => {*/}

                                            {/*}}>Comment as {currentUser.displayName}</Button>*/}
                                            {currentUser ? (
                                                <Button onClick={() => {

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
                                                        {ele.commentContent}
                                                    </Card.Text>
                                                    <Card.Subtitle className="mb-2 text-muted text-end">Commented by {ele.userName} at {
                                                        new Date(ele.time).getDate()+
                                                        "/"+(new Date(ele.time).getMonth()+1)+
                                                        "/"+new Date(ele.time).getFullYear()+
                                                        " "+new Date(ele.time).getHours()+
                                                        ":"+new Date(ele.time).getMinutes()+
                                                        ":"+new Date(ele.time).getSeconds()
                                                    }</Card.Subtitle>
                                                    <Button variant="primary" onClick={()=>{

                                                    }}>Delete</Button>
                                                </Card>
                                            )
                                        })
                                    }
                                </Card.Body>
                            </Card>

                        </div>

                }
                <div className="col-6 col-sm-4">
                    <div ref={mapContainer} className="map-container" />
                    <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                </div>
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