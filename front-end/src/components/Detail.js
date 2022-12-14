import React, {useContext, useEffect, useRef, useState} from 'react';
import { Row, Container, Form, Button, Card, InputGroup } from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import ReactMapGL, { Map, Marker } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import {AuthContext} from '../firebase/Auth';
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


export default function Detail() {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [originalData, setOriginalData] = useState({
        id:2,
        title:"I dont love my kitty",
        time:1670443903704,
        userName:"John",
        userId:1,
        status:"story",
        content:"this is story 1 and the rest of this is useless blahblahblahblahblahblahblahblahblahblahblahblahblah" +
            "blahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblah",
        image:[],
        longitude:-74.3,
        latitude:40.008,
        comments:[{
            commentId:1,
            userId:1,
            userName:"John",
            commentContent:"I have seen her many times",
            time:1670443903704
        },{
            commentId:2,
            userId:1,
            userName:"John",
            commentContent:"I havdfdffdn her many times",
            time:1670443903704
        },{
            commentId:3,
            userId:1,
            userName:"John",
            commentContent:"I have seensadfasdfadfasdfaes",
            time:1670443903704
        }],
        petName:"kitty"
    });
    const mapContainer = useRef(null);
    const map = useRef(null);
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
    // const marker = new mapboxgl.Marker()
    //     .setLngLat([originalData.longitude, originalData.latitude]);


    // useEffect(() => {
    //     console.log(2,curMarkerLngLat)
    //     currentLocationMarker.setLngLat(curMarkerLngLat);
    //
    // }, [curMarkerLngLat])

    useEffect(() => {

        async function fetchData() {
            let singleFakeData = {
                id:2,
                title:"I dont love my kitty",
                time:1670443903704,
                userName:"John",
                userId:1,
                status:"story",
                content:"this is story 1 and the rest of this is useless blahblahblahblahblahblahblahblahblahblahblahblahblah" +
                    "blahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblah",
                image:[],
                longitude:"",
                latitude:"",
                comments:[{
                    commentId:1,
                    userId:1,
                    userName:"John",
                    commentContent:"I have seen her many times",
                    time:1670443903704
                },{
                    commentId:2,
                    userId:1,
                    userName:"John",
                    commentContent:"I havdfdffdn her many times",
                    time:1670443903704
                },{
                    commentId:3,
                    userId:1,
                    userName:"John",
                    commentContent:"I have seensadfasdfadfasdfaes",
                    time:1670443903704
                }],
                petName:"kitty"
            };
            try {
                await setOriginalData(singleFakeData);
                await navigator.geolocation.getCurrentPosition(function(position) {

                    lnglat.current=[position.coords.longitude, position.coords.latitude];
                    currentLocationMarker.setLngLat(lnglat.current);
                    const marker = new mapboxgl.Marker()
                        .setLngLat([originalData.longitude, originalData.latitude])
                        .setPopup((new mapboxgl.Popup({ offset: 25 })
                            .setHTML("<h4>"+originalData.title+"</h4><p>"+originalData.content+"</p>")));
                    marker.addTo(map.current);

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

    return (
        <Container>
            <Card className="square border border-5"
                  style={{ width: '40rem' }}
                  border={ originalData.status === 'lost' ? "danger" : originalData.status === 'found' ? "primary" : "success" }>
                <Card.Header>{originalData.status.toUpperCase()}</Card.Header>
                <Card.Img variant="top" src="cat.jpeg" />
                <Card.Body>
                    <Card.Title>{originalData.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-end">Posted by {originalData.userName} at {
                        new Date(originalData.time).getDate()+
                        "/"+(new Date(originalData.time).getMonth()+1)+
                        "/"+new Date(originalData.time).getFullYear()+
                        " "+new Date(originalData.time).getHours()+
                        ":"+new Date(originalData.time).getMinutes()+
                        ":"+new Date(originalData.time).getSeconds()
                    }</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                        {originalData.petName}
                    </Card.Subtitle>
                    <Card.Text>
                        {originalData.content}
                    </Card.Text>
                    <Button variant="primary" onClick={()=>{
                        navigate("/Detail");
                    }}>Edit</Button>
                    <Button variant="primary" onClick={()=>{

                    }}>Delete</Button>
                </Card.Body>

                <Card.Body>
                    <Card.Title>Comments:</Card.Title>
                    <Form.Group className="mb-3" xs={10}>
                        <Form.Label>Leave a comment</Form.Label>
                        <Row>
                            <Form.Control as="textarea" type="input" id="newComment" xs={10}/>
                            <Button onClick={() => {

                            }}>Comment as {currentUser.displayName}</Button>
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
            <div className="col-6 col-sm-4">
                <div ref={mapContainer} className="map-container" />
                <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
            </div>
        </Container>
    )
}