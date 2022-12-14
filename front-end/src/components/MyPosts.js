import React, { useRef, useContext, useEffect, useState} from 'react';
import {Container, Form, Button, Pagination, Row, Card} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import axios from 'axios';
import ModalContext from "react-bootstrap/ModalContext";
import Modal from 'react-bootstrap/Modal';
import {AuthContext} from '../firebase/Auth';
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";

export default function MyPosts() {

    const { currentUser } = useContext(AuthContext);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-74.0254848);
    const [lat, setLat] = useState(40.7446316);
    const [zoom, setZoom] = useState(9);
    const lnglat = useContext(CurrentLocationLngLatContext);
    const popup1 = new mapboxgl.Popup({ offset: 25 })
        .setHTML("<h1>Your current location</h1>");
    const currentLocationMarker = new mapboxgl.Marker()
        .setLngLat(lnglat.current)
        .setPopup(popup1);

    const navigate = useNavigate();
    const [pagenum, setPagenum] = useState(1);
    const [originalData, setOriginalData] = useState([]);
    const [pagedData, setPagedData] = useState([]);
    const [markerStack, setMarkerStack] = useState([]);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });
        currentLocationMarker.addTo(map.current);

    }, []);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

    }, []);

    useEffect(() => {

        async function fetchData() {
            try {
                let originalFakeData = [
                    {
                        id:1,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"story",
                        content:"this is story 1 and the rest of this is useless blahblahblahblahblahblahblahblahblahblahblahblahblah" +
                            "blahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblah",
                        image:[],
                        longitude:-74.0290,
                        latitude:40.7448,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:2,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"found",
                        content:"this is found 2",
                        image:[],
                        longitude:-74.0266,
                        latitude:40.7514,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:3,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 3",
                        image:[],
                        longitude:-74.0244,
                        latitude:40.7542,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:4,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 4",
                        image:[],
                        longitude:-74.0271,
                        latitude:40.7483,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:5,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 5",
                        image:[],
                        longitude:-74.0276,
                        latitude:40.7388,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:6,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 6",
                        image:[],
                        longitude:-73.9982,
                        latitude:40.7358,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:7,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 7",
                        image:[],
                        longitude:-74.0023,
                        latitude:40.7520,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:8,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 8",
                        image:[],
                        longitude:-74.0010,
                        latitude:40.7594,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:9,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 9",
                        image:[],
                        longitude:-73.9970,
                        latitude:40.7335,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:10,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 10",
                        image:[],
                        longitude:-74.0088,
                        latitude:40.7146,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:11,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 11",
                        image:[],
                        longitude:-73.9978,
                        latitude:40.6863,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:12,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 12",
                        image:[],
                        longitude:-73.9758,
                        latitude:40.6916,
                        comments:[],
                        petName:"kitty"
                    },
                    {
                        id:13,
                        title:"I love my kitty",
                        time:1670443903704,
                        userName:"John",
                        userId:1,
                        status:"lost",
                        content:"this is lost 13",
                        image:[],
                        longitude:-74.0792,
                        latitude:40.7163,
                        comments:[],
                        petName:"kitty"
                    }
                ];
                await setOriginalData(originalFakeData);
                await setPagedData(originalFakeData.slice(0,10));
                // await axios.get(
                //     `http://localhost:4000/posts/${currentUser.uid}?pagenum=${pagenum}`)
                //     .then(function (response) {
                //         setOriginalData(response.data);
                //         setPagedData(response.data.slice(0,10));
                //         console.log(response.data);
                //     })
                //     .catch(function (error) {
                //         // handle error
                //         console.log(error);
                //     });

                await navigator.geolocation.getCurrentPosition(function(position) {

                    lnglat.current=[position.coords.longitude, position.coords.latitude];
                    currentLocationMarker.setLngLat(lnglat.current);

                });

            } catch (e) {
                console.log(e);
            }
        }

        fetchData();

    }, []);


    useEffect( () => {

        if(originalData === undefined){
            throw "undefined";
            //unsolved
        }

        let result = [];
        let tempData = originalData.slice(10*pagenum-10,10*pagenum);
        for(let ele of tempData){
            result.push(ele);
        }

        setPagedData(result);

        markerStack.map((ele) => {
            ele.remove();
        })

        const newMarkers = [];

        for (let i = 0; i < pagedData.length && i < 10; i++) {
            let temp = new mapboxgl.Marker()
                .setLngLat([pagedData[i].longitude, pagedData[i].latitude ])
                .setPopup(new mapboxgl.Popup({  })
                    .setHTML("<a href='/Detail'><h4>"+pagedData[i].title+"</h4></a><p>"+pagedData[i].content+"</p>"));
            temp.addTo(map.current);
            newMarkers.push(temp);
        }

        setMarkerStack(newMarkers);
    }, [pagenum,originalData]);

    const handlePageChange = (event, value) => {
        setPagenum(value);
    };



    function contentTextTrimer(text){
        if(text.length >= 100){
            text = text.slice(0,97)+"...";
        }
        return text;
    }


    return (
        <Container>
            <h1>My Posts</h1>
            {!originalData ? null :
                <div>
                    <div>
                        <Pagination>
                            <Pagination.First onClick={()=>{setPagenum(1)}} />
                            {
                                pagenum === 1 ?
                                    <Pagination.Prev onClick={()=>{setPagenum(pagenum - 1)}} disabled/>
                                    :
                                    <Pagination.Prev onClick={()=>{setPagenum(pagenum - 1)}}/>
                            }
                            <Pagination.Item active>{pagenum}</Pagination.Item>
                            <Pagination.Ellipsis />
                            <Pagination.Item onClick={()=>{setPagenum(Math.ceil(originalData.length / 10))}}>{Math.ceil(originalData.length / 10)}</Pagination.Item>
                            {
                                pagenum === Math.ceil(originalData.length / 10) ?
                                    <Pagination.Next onClick={()=>{setPagenum(pagenum + 1)}} disabled/>
                                    :
                                    <Pagination.Next onClick={()=>{setPagenum(pagenum + 1)}}/>
                            }
                            <Pagination.Last onClick={()=>{setPagenum(Math.ceil(originalData.length / 10))}}/>
                        </Pagination>
                    </div>


                    <Row>
                        {pagedData.map((ele) => {
                            return (

                                <Card className="square border border-5"
                                      style={{ width: '25rem' }}
                                      border={ ele.status === 'lost' ? "danger" : ele.status === 'found' ? "primary" : "success" }>
                                    <Card.Header>{ele.status.toUpperCase()}</Card.Header>
                                    <Card.Img variant="top" src="cat.jpeg" />
                                    <Card.Body>
                                        <Card.Title>{ele.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Posted by {ele.userName} at {
                                            new Date(ele.time).getDate()+
                                            "/"+(new Date(ele.time).getMonth()+1)+
                                            "/"+new Date(ele.time).getFullYear()+
                                            " "+new Date(ele.time).getHours()+
                                            ":"+new Date(ele.time).getMinutes()+
                                            ":"+new Date(ele.time).getSeconds()
                                        }</Card.Subtitle>
                                        <Card.Text>
                                            {contentTextTrimer(ele.content)}
                                        </Card.Text>
                                        <Button variant="primary" onClick={()=>{
                                            navigate("/Detail");
                                        }}>Detail</Button>
                                        <Button variant="primary" onClick={()=>{
                                            navigate("/Detail");
                                        }}>Edit</Button>
                                        <Button variant="primary" onClick={()=>{

                                        }}>Delete</Button>
                                    </Card.Body>
                                </Card>
                            )
                        })
                        }
                    </Row>

                    <div className="col-6 col-sm-4">
                        <div ref={mapContainer} className="map-container" />
                        <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                    </div>
                </div>
            }
        </Container>
    )
}