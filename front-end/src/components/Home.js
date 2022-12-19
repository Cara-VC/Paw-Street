import React, { useRef, useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Pagination,
  Card,
  Button,
  Container,
  Row,
  Form,
  Col,
  Stack,
} from "react-bootstrap";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import { getPreciseDistance } from "geolib";
import axios from "axios";
import { AuthContext } from "../firebase/Auth";
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";
import Modal from "react-bootstrap/Modal";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase/Firebase";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const { currentUser } = useContext(AuthContext);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-74.0254848);
  const [lat, setLat] = useState(40.7446316);
  const lnglat = useContext(CurrentLocationLngLatContext);

  const [zoom, setZoom] = useState(9);
  const popup1 = new mapboxgl.Popup({ offset: 25 }).setHTML(
    "<h1>Your current location</h1>"
  );
  const currentLocationMarker = new mapboxgl.Marker()
    .setLngLat(lnglat.current)
    .setPopup(popup1);

  const navigate = useNavigate();
  const [markerStack, setMarkerStack] = useState([]);
  const [pagenum, setPagenum] = useState(1);
  const [nextPage, setNextPage] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [showRange, setShowRange] = useState("Range: 10 miles");

  const [tempDistance, setTempDistance] = useState("5");
  const [tempStory, setTempStory] = useState(false);
  const [tempLost, setTempLost] = useState(false);
  const [tempFound, setTempFound] = useState(false);
  const [tempTime, setTempTime] = useState("all");

  const [filter, setFilter] = useState({
    distance: "5",
    story: true,
    lost: true,
    found: true,
    time: "all",
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    currentLocationMarker.addTo(map.current);
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        await axios
          .get(
            `http://localhost:4000/posts/${lnglat.current[0]}/${lnglat.current[1]}?pagenum=${pagenum}&story=${filter.story}&found=${filter.found}&lost=${filter.lost}&distance=${filter.distance}&time=${filter.time}`
          )
          .then(function (response) {
            setOriginalData(response.data);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
        await axios
          .get(
            `http://localhost:4000/posts/${lnglat.current[0]}/${
              lnglat.current[1]
            }?pagenum=${pagenum + 1}&story=${filter.story}&found=${
              filter.found
            }&lost=${filter.lost}&distance=${filter.distance}&time=${
              filter.time
            }`
          )
          .then(function (response) {
            if (response.data.length != 0) {
              setNextPage(true);
            } else {
              setNextPage(false);
            }
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });

        await navigator.geolocation.getCurrentPosition(function (position) {
          lnglat.current = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          currentLocationMarker.setLngLat(lnglat.current);
        });
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [pagenum, filter]);

  // useEffect(() => {
  //   async function changePage() {
  //     try {
  //       await axios
  //         .get(
  //           `http://localhost:4000/posts/${lnglat.current[0]}/${lnglat.current[1]}?pagenum=${pagenum}&story=${filter.story}&found=${filter.found}&lost=${filter.lost}&distance=${filter.distance}&time=${filter.time}`
  //         )
  //         .then(async function (response) {
  //           setOriginalData(response.data);
  //         })
  //         .catch(function (error) {
  //           // handle error
  //           console.log(error);
  //         });
  //       await axios
  //         .get(
  //           `http://localhost:4000/posts/${lnglat.current[0]}/${
  //             lnglat.current[1]
  //           }?pagenum=${pagenum + 1}&story=${filter.story}&found=${
  //             filter.found
  //           }&lost=${filter.lost}&distance=${filter.distance}&time=${
  //             filter.time
  //           }`
  //         )
  //         .then(function (response) {
  //           if (response.data.length != 0) {
  //             setNextPage(true);
  //           } else {
  //             setNextPage(false);
  //           }
  //         })
  //         .catch(function (error) {
  //           // handle error
  //           console.log(error);
  //         });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   changePage();
  // }, [pagenum, filter]);

  useEffect(() => {
    if (originalData) {
      markerStack.map((ele) => {
        ele.remove();
      });

      const newMarkers = [];

      for (let i = 0; i < originalData.length && i < 10; i++) {
        let temp = new mapboxgl.Marker()
          .setLngLat([originalData[i].longitude, originalData[i].latitude])
          .setPopup(
            new mapboxgl.Popup({}).setHTML(
              "<Container><h1>" +
                originalData[i].title +
                "</h1><p>" +
                originalData[i].content +
                "</p></Container"
            )
          );
        temp.addTo(map.current);
        newMarkers.push(temp);
      }

      setMarkerStack(newMarkers);
    }
  }, [originalData]);

  const handlePageChange = (event, value) => {
    setPagenum(value);
  };

  let checkBox
  checkBox = (
      <Col xs="2">
      <Form.Check
        id="story"
        type="checkbox"
        label="Story"
        onChange={() => {
          setTempStory(document.getElementById("story").checked);
        }}
      />
      <Form.Check
        id="lost"
        type="checkbox"
        label="Lost"
        onChange={() => {
          setTempLost(document.getElementById("lost").checked);
        }}
      />
      <Form.Check
        id="found"
        type="checkbox"
        label="Found"
        onChange={() => {
          setTempFound(document.getElementById("found").checked);
        }}
      />
    </Col>
    )

  function contentTextTrimer(text) {
    if (text.length >= 100) {
      text = text.slice(0, 97) + "...";
    }
    return text;
  }

  return (
    <Container>
      <h1>Home</h1>
        <Row>
          <Col xs="12">
            <Form>
              <Row>
                <Col xs="2">
                  <Pagination>
                    <Pagination.First
                      onClick={() => {
                        setPagenum(1);
                      }}
                    />
                    {pagenum === 1 ? (
                      <Pagination.Prev
                        onClick={() => {
                          setPagenum(pagenum - 1);
                        }}
                        disabled
                      />
                    ) : (
                      <Pagination.Prev
                        onClick={() => {
                          setPagenum(pagenum - 1);
                        }}
                      />
                    )}
                    <Pagination.Item active>{pagenum}</Pagination.Item>

                    {nextPage == true ? (
                      <Pagination.Next
                        onClick={() => {
                          setPagenum(pagenum + 1);
                        }}
                      />
                    ) : (
                      <Pagination.Next
                        onClick={() => {
                          setPagenum(pagenum + 1);
                        }}
                        disabled
                      />
                    )}
                  </Pagination>
                </Col>
                <Col xs="2">
                  <label htmlFor="distance" className="form-label">
                    {showRange}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="distance"
                    min="1"
                    max="5"
                    step="1"
                    defaultValue="3"
                    onChange={() => {
                      if (document.getElementById("distance").value == 1) {
                        setShowRange("Range: 1 mile");
                      } else if (
                        document.getElementById("distance").value == 2
                      ) {
                        setShowRange("Range: 5 miles");
                      } else if (
                        document.getElementById("distance").value == 3
                      ) {
                        setShowRange("Range: 10 miles");
                      } else if (
                        document.getElementById("distance").value == 4
                      ) {
                        setShowRange("Range: 50 miles");
                      } else {
                        setShowRange("Nationwide");
                      }
                      setTempDistance(
                        document.getElementById("distance").value
                      );
                    }}
                  />
                </Col>
                {/* <Col xs="2">
                  <Form.Check
                    id="story"
                    type="checkbox"
                    label="Story"
                    onChange={() => {
                      setTempStory(document.getElementById("story").checked);
                    }}
                  />
                  <Form.Check
                    id="lost"
                    type="checkbox"
                    label="Lost"
                    onChange={() => {
                      setTempLost(document.getElementById("lost").checked);
                    }}
                  />
                  <Form.Check
                    id="found"
                    type="checkbox"
                    label="Found"
                    onChange={() => {
                      setTempFound(document.getElementById("found").checked);
                    }}
                  />
                </Col> */}
                {checkBox}

                <Col xs="2">
                  <Form.Select
                    size="sm"
                    id="time"
                    onChange={() => {
                      setTempTime(document.getElementById("time").value);
                    }}
                  >
                    <option value="all">all time</option>
                    <option value="oneWeek">in one week</option>
                    <option value="oneMonth">in one month</option>
                    <option value="threeMonths">in three months</option>
                  </Form.Select>
                </Col>
                <Col xs="3">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setPagenum(1);
                      setFilter({
                        distance: tempDistance,
                        story: tempStory,
                        found: tempFound,
                        lost: tempLost,
                        time: tempTime,
                      });
                    }}
                  >
                    submit filter
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>


          <Row>
          {!originalData ? (<h2>Failed to get data.</h2>
          ) : originalData && originalData.length == 0 ? (
            <h2>It seems like there is no post.</h2>
          ) : (
            
            <Col xs="6">
              {!originalData
                ? null
                : originalData.map((ele) => {
                    // const storageRef = ref(storage, ele.image[0]);
                    //
                    // getDownloadURL(storageRef)
                    //     .then(async (url) => {
                    //         // const img = document.getElementById(`${ele._id}`);
                    //         // img.setAttribute('src', url);
                    //         // console.log(url);
                    //
                    //     })
                    //     .catch((error) => {
                    //         alert(error);
                    //     });

                    // console.log([ele.longitude, ele.latitude ], markerStack);
                    return (
                      <Card
                        className="square border border-5"
                        style={{ width: "25rem" }}
                        key={ele._id}
                        border={
                          ele.status === "lost"
                            ? "danger"
                            : ele.status === "found"
                            ? "primary"
                            : "success"
                        }
                      >
                        <Card.Header className="text-center">
                          {ele.status.toUpperCase()}
                        </Card.Header>
                        <Card.Img
                          variant="top"
                          src={
                            ele.image[0]
                              ? ele.image[0]
                              : "/imgs/missingPicture.jpeg"
                          }
                          alt={
                            ele.image[0]['name'] ? ele.image[0]['name']: "/imgs/missingPicture.jpeg"
                          }
                        />
                        <Card.Body>
                          <Card.Title>{ele.title}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted text-end">
                            Pet Name: {ele.petName}
                          </Card.Subtitle>
                          <Card.Subtitle className="mb-2 text-muted text-end">
                            Posted by {ele.userName} at{" "}
                            {new Date(ele.time).getDate() +
                              "/" +
                              (new Date(ele.time).getMonth() + 1) +
                              "/" +
                              new Date(ele.time).getFullYear() +
                              " " +
                              new Date(ele.time).getHours() +
                              ":" +
                              new Date(ele.time).getMinutes() +
                              ":" +
                              new Date(ele.time).getSeconds()}
                          </Card.Subtitle>

                          <Card.Text>
                            {contentTextTrimer(ele.content)}
                          </Card.Text>
                          <Button
                            variant="primary"
                            onClick={() => {
                              navigate("/Detail", {
                                state: { postId: ele._id },
                              });
                            }}
                          >
                            Detail
                          </Button>
                        </Card.Body>
                      </Card>
                    );
                  })}
            </Col>
          )}

            <Col xs="6">
              <div ref={mapContainer} className="map-container" />
              <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
              </div>
            </Col>
          </Row>
        </Row>
      
    </Container>
  );
}
