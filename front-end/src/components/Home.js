import React, { useRef, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {Pagination, Card, Button, Container, Row, Form} from "react-bootstrap";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import { getPreciseDistance } from 'geolib';
import axios from 'axios';
import {AuthContext} from '../firebase/Auth';
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


export default function Home() {

    const { currentUser } = useContext(AuthContext);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-74.0254848);
    const [lat, setLat] = useState(40.7446316);
    const lnglat = useContext(CurrentLocationLngLatContext);

    const [zoom, setZoom] = useState(9);
    const popup1 = new mapboxgl.Popup({ offset: 25 })
        .setHTML("<h1>Your current location</h1>");
    const currentLocationMarker = new mapboxgl.Marker()
        .setLngLat(lnglat.current)
        .setPopup(popup1);

    const navigate = useNavigate();
    const [markerStack, setMarkerStack] = useState([]);
    const [pagenum, setPagenum] = useState(1);
    const [nextPage, setNextPage] = useState(false);
    const [originalData, setOriginalData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [pagedData, setPagedData] = useState([]);
    const [showRange, setShowRange] = useState("Range: 10 miles");

    const [tempDistance, setTempDistance] = useState("5");
    const [tempStory, setTempStory] = useState(false);
    const [tempLost, setTempLost] = useState(false);
    const [tempFound, setTempFound] = useState(false);
    const [tempTime, setTempTime] = useState("all");

    const [filter, setFilter] = useState({
        distance:'5',
        story:true,
        lost:true,
        found:true,
        time:"all"
    });

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
            try {
                await axios.get(
                    `http://localhost:4000/posts/${lnglat.current[0]}/${lnglat.current[1]}?pagenum=${pagenum}&story=${filter.story}&found=${filter.found}&lost=${filter.lost}&distance=${filter.distance}&time=${filter.time}`)
                    .then(function (response) {
                        setOriginalData(response.data);
                        setPagedData(response.data.slice(0,10));
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
                await axios.get(
                    `http://localhost:4000/posts/${lnglat.current[0]}/${lnglat.current[1]}?pagenum=${pagenum+1}&story=${filter.story}&found=${filter.found}&lost=${filter.lost}&distance=${filter.distance}&time=${filter.time}`)
                    .then(function (response) {
                        if(response.data.length != 0){
                            setNextPage(true);
                        }else{
                            setNextPage(false);
                        }
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });

                // await setOriginalData(originalFakeData);
                // await setSelectedData(originalFakeData);
                // await setPagedData(originalFakeData.slice(0,10));
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

    // useEffect(() => {
    //
    //     // filterData();
    //     if(originalData === undefined){
    //         throw "undefined";
    //         //unsolved
    //     }
    //     let resultData = [];
    //     let tempData = originalData;
    //     for(let ele of tempData){
    //         if(checkTime(ele) && checkStatus(ele) && checkDistance(ele)){
    //             resultData.push(ele);
    //         }
    //     }
    //     setSelectedData(resultData);
    // }, [filter,pagenum,originalData]);

    useEffect( () => {
        async function changePage(){
            try{
                await axios.get(
                    `http://localhost:4000/posts/${lnglat.current[0]}/${lnglat.current[1]}?pagenum=${pagenum}&story=${filter.story}&found=${filter.found}&lost=${filter.lost}&distance=${filter.distance}&time=${filter.time}`)
                    .then(function (response) {

                        setOriginalData(response.data);
                        setPagedData(response.data.slice(0,10));
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
                await axios.get(
                    `http://localhost:4000/posts/${lnglat.current[0]}/${lnglat.current[1]}?pagenum=${pagenum+1}&story=${filter.story}&found=${filter.found}&lost=${filter.lost}&distance=${filter.distance}&time=${filter.time}`)
                    .then(function (response) {
                        if(response.data.length != 0){
                            setNextPage(true);
                        }else{
                            setNextPage(false);
                        }
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
            }catch (e){
                console.log(e);
            }
        }
        changePage();
    }, [pagenum,filter]);

    useEffect( () => {

        if(selectedData === undefined){
            throw "undefined";
            //unsolved
        }

        // let result = [];
        // let tempData = originalData.slice(10*pagenum-10,10*pagenum);
        // for(let ele of tempData){
        //     result.push(ele);
        // }
        // setPagedData(result);

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

    }, [originalData]);

    const handlePageChange = (event, value) => {
        setPagenum(value);
        // navigate(`/pokemon/page/${value}`);
    };



    function contentTextTrimer(text){
        if(text.length >= 100){
            text = text.slice(0,97)+"...";
        }
        return text;
    }

    function checkStatus(singleData){
        if(singleData.status === "story" && filter.story === true){
            return true;
        }
        if(singleData.status === "lost" && filter.lost === true){
            return true;
        }
        if(singleData.status === "found" && filter.found === true){
            return true;
        }
        return false;
    }

    function checkTime(singleData){
        let difference = (new Date().getTime()) - singleData.time;
        if(filter.time === "all"){
            return true;
        }
        if(Math.floor(difference/1000/60/60/24) <= 7 && filter.time === "oneWeek"){
            return true;
        }
        if(Math.floor(difference/1000/60/60/24) <= 30 && filter.time === "oneMonth"){
            return true;
        }
        if(Math.floor(difference/1000/60/60/24) <= 90 && filter.time === "threeMonths"){
            return true;
        }
        return false;
    }

    function checkDistance(singleData){
        let distance = getPreciseDistance({ latitude: lnglat.current[1], longitude: lnglat.current[0] },
            { latitude: singleData.latitude, longitude: singleData.longitude }) / 1000 / 1.6;
        if(filter.distance == "1" && distance <= 1){
            return true;
        }else if(filter.distance == "2" && distance <= 5){
            return true;
        }else if(filter.distance == "3" && distance <= 10){
            return true;
        }else if(filter.distance == "4" && distance <= 50){
            return true;
        }else if(filter.distance == "5"){
            return true;
        }
        return false;
    }

    // console.log(originalData);
    // console.log(selectedData);
    // console.log(pagedData);


    return (
        <div className="container justify-content-center">
            <h1>Home</h1>
            {!originalData ? null :
                <div className="row">


                    <div className="col-6 col-md-4">
                        <Pagination>
                            <Pagination.First onClick={()=>{setPagenum(1)}} />
                            {
                                pagenum === 1 ?
                                    <Pagination.Prev onClick={()=>{setPagenum(pagenum - 1)}} disabled/>
                                    :
                                    <Pagination.Prev onClick={()=>{setPagenum(pagenum - 1)}}/>
                            }
                            <Pagination.Item active>{pagenum}</Pagination.Item>
                            {/*<Pagination.Ellipsis />*/}
                            {/*<Pagination.Item onClick={()=>{setPagenum(Math.ceil(selectedData.length / 10))}}>{Math.ceil(selectedData.length / 10)}</Pagination.Item>*/}
                            {
                                // pagenum === Math.ceil(originalData.length / 10) ?
                                nextPage == true?
                                    <Pagination.Next onClick={()=>{setPagenum(pagenum + 1)}} />
                                    :
                                    <Pagination.Next onClick={()=>{setPagenum(pagenum + 1)}} disabled/>
                            }
                            {/*<Pagination.Last onClick={()=>{setPagenum(Math.ceil(selectedData.length / 10))}}/>*/}
                        </Pagination>
                    </div>

                    <div className="col-6 col-md-4">
                        <Form>
                            <label htmlFor="distance" className="form-label">{showRange}</label>
                            <input type="range" className="form-range" id="distance" min="1" max="5" step="1"
                                   onChange={()=>{
                                       if(document.getElementById("distance").value == 1){
                                           setShowRange("Range: 1 mile");
                                       }else if(document.getElementById("distance").value == 2){
                                           setShowRange("Range: 5 miles");
                                       }else if(document.getElementById("distance").value == 3){
                                           setShowRange("Range: 10 miles");
                                       }else if(document.getElementById("distance").value == 4){
                                           setShowRange("Range: 50 miles");
                                       }else {
                                           setShowRange("Nationwide");
                                       }
                                       setTempDistance(document.getElementById("distance").value);

                                   }
                            }/>
                            <Form.Check id="story" style={{display:"inline-block"}}
                                type="checkbox" label="Story" onChange={() => {
                                setTempStory(document.getElementById("story").checked);

                            }
                            }
                            />
                            <Form.Check id="lost" style={{display:"inline-block"}}
                                type="checkbox" label="Lost" onChange={() => {
                                setTempLost(document.getElementById("lost").checked);

                            }
                            }
                            />
                            <Form.Check id="found"  style={{display:"inline-block"}}
                                        onChange={() => {
                                setTempFound(document.getElementById("found").checked);

                            }
                            }
                                type="checkbox" label="Found"
                            />
                            <Form.Select size="sm" id="time" onChange={() => {
                                setTempTime(document.getElementById("time").value);
                            }
                            }>
                                <option value="all">all time</option>
                                <option value="oneWeek">in one week</option>
                                <option value="oneMonth">in one month</option>
                                <option value="threeMonths">in three months</option>
                            </Form.Select>
                            <Button variant="primary" onClick={()=>{
                                setPagenum(1);
                                setFilter({distance: tempDistance,
                                    story: tempStory,
                                    found: tempFound,
                                    lost: tempLost,
                                    time: tempTime
                                });

                            }}>submit filter</Button>

                        </Form>
                    </div>

                    <div className="row">


                        <div className="col-6 col-sm-4">
                            {
                                !originalData ? null :

                                originalData.map((ele) => {

                                    // console.log([ele.longitude, ele.latitude ], markerStack);
                                    return (

                                        <Card className="square border border-5"
                                        style={{ width: '25rem' }}
                                        border={ ele.status === 'lost' ? "danger" : ele.status === 'found' ? "primary" : "success" }>
                                            <Card.Header>{ele.status.toUpperCase()}</Card.Header>
                                            <Card.Img variant="top" src="cat.jpeg" />
                                            <Card.Body>
                                            <Card.Title>{ele.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted text-end">Posted by {ele.userName} at {
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
                                            </Card.Body>
                                        </Card>
                                    )
                            })
                            }
                            </div>
                            <div className="col-6 col-sm-4">
                                <div ref={mapContainer} className="map-container" />
                                <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                            </div>
                    </div>
                </div>
                            }

        </div>
    )
}
