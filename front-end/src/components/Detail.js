import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Row,
  Container,
  Form,
  Button,
  Card,
  InputGroup,
  Col,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import ReactMapGL, { Map, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthContext } from "../firebase/Auth";
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import DeleteCommentModal from "./modals/DeleteCommentModal";
import DeletePostModal from "./modals/DeletePostModal";
import {
  checkTitle,
  checkUserId,
  checkUserName,
  checkStatus,
  checkContent,
  checkPetName,
  checkLongitude,
  checkLatitude,
  checkImage,
  checkComment,
} from "./validation/validation";

export default function Detail() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [originalData, setOriginalData] = useState();
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [update, setUpdate] = useState(1);
  // const [show, setShow] = useState(false);
  // const [show2, setShow2] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // const handleClose2 = () => setShow2(false);
  // const handleShow2 = () => setShow2(true);

  const [isLoading, setIsLoading] = useState(true);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [deleteComment, setDeleteComment] = useState(null);
  const [reloadAfterDelete, setReloadAfterDelete] = useState(false);

  const handleDeletePost = (post) => {
    setShowDeletePostModal(true);
    setDeletePost(post);
  };

  const handleDeleteComment = (post, comment) => {
    setShowDeleteCommentModal(true);
    setDeletePost(post);
    setDeleteComment(comment);
  };

  const handleCloseModalNavigation = () => {
    setShowDeletePostModal(false);
    setShowDeleteCommentModal(false);
    setDeletePost(null);
    setDeleteComment(null);
    navigate("/MyPosts");
  };

  const handleCloseModal = () => {
    setShowDeletePostModal(false);
    setShowDeleteCommentModal(false);
    setDeletePost(null);
    setDeleteComment(null);
    setReloadAfterDelete(!reloadAfterDelete);
  };

  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const [lng, setLng] = useState(-74.0254848);
  const [lat, setLat] = useState(40.7446316);
  const lnglat = useContext(CurrentLocationLngLatContext);
  // const [curMarkerLngLat, setCurMarkerLngLat] = useState([lng, lat]);
  const [zoom, setZoom] = useState(9);
  const popup1 = new mapboxgl.Popup({ offset: 25 }).setHTML(
    "<h1>Your current location</h1>"
  );
  const currentLocationMarker = new mapboxgl.Marker()
    .setLngLat(lnglat.current)
    .setPopup(popup1);

  const fetchData = async () => {
    try {
      await axios
        .get(`http://localhost:4000/posts/${location.state.postId}`)
        .then(function (response) {
          setOriginalData(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          navigate("/MyPosts");
        });
      // await setOriginalData(singleFakeData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    navigator.geolocation.getCurrentPosition(function (position) {
      lnglat.current = [position.coords.longitude, position.coords.latitude];
      currentLocationMarker.setLngLat(lnglat.current);
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, [update, reloadAfterDelete]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    // marker.addTo(map.current);
    currentLocationMarker.addTo(map.current);
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (originalData) {
      const marker = new mapboxgl.Marker({
        color:
          originalData.status == "lost"
            ? "#ff0000"
            : originalData.status == "found"
            ? "#0000ff"
            : "#00ff00",
      })
        .setLngLat([originalData.longitude, originalData.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            "<Container><h1>" +
              originalData.title +
              "</h1><p>" +
              originalData.content +
              "</p></Container>"
          )
        );
      marker.addTo(map.current);
    }
  }, [originalData]);

  if (location.state) {
    return (
      <Container>
        <Row>
          {!originalData || isLoading ? null : (
            <Col>
              <Card
                className="square border border-5"
                style={{ width: "40rem" }}
                border={
                  originalData.status === "lost"
                    ? "danger"
                    : originalData.status === "found"
                    ? "primary"
                    : "success"
                }
              >
                <Card.Header className="text-center">
                  {originalData.status.toUpperCase()}
                </Card.Header>

                {!originalData.image[0] ? (
                  <Card.Img variant="top" src="/imgs/missingPicture.jpeg" />
                ) : null}
                <Carousel activeIndex={index} onSelect={handleSelect}>
                  {originalData.image.map((ele) => {
                    return (
                      <Carousel.Item>
                        <img
                          style={{ width: "200px" }}
                          className="d-block w-100"
                          src={ele}
                          alt="First slide"
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
                <Card.Body>
                  <Card.Title>{originalData.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted text-end">
                    Pet Name:
                    {originalData.petName}
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted text-end">
                    Posted by {originalData.userName} at{" "}
                    {new Date(originalData.time).getDate() +
                      "/" +
                      (new Date(originalData.time).getMonth() + 1) +
                      "/" +
                      new Date(originalData.time).getFullYear() +
                      " " +
                      new Date(originalData.time).getHours() +
                      ":" +
                      new Date(originalData.time).getMinutes() +
                      ":" +
                      new Date(originalData.time).getSeconds()}
                  </Card.Subtitle>

                  <Card.Text>{originalData.content}</Card.Text>
                  {/*<Button variant="primary" onClick={()=>{*/}
                  {/*    navigate("/Edit",{state:{postId: location.state.postId}});*/}
                  {/*    }}>Edit</Button>*/}

                  {/*<Button variant="primary" onClick={()=>{*/}

                  {/*    }}>Delete</Button>*/}
                  {currentUser && currentUser.uid == originalData.userId ? (
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigate("/Edit", {
                          state: { postId: location.state.postId },
                        });
                      }}
                    >
                      Edit
                    </Button>
                  ) : null}
                  {currentUser && currentUser.uid == originalData.userId ? (
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleDeletePost(originalData);
                      }}
                    >
                      Delete
                    </Button>
                  ) : null}
                  {showDeletePostModal && (
                    <DeletePostModal
                      isOpen={showDeletePostModal}
                      handleCloseWithYes={handleCloseModalNavigation}
                      handleCloseWithNo={handleCloseModal}
                      deletePost={deletePost}
                    />
                  )}
                </Card.Body>
                <Card.Body>
                  <Card.Title>Comments:</Card.Title>
                  <Form.Group className="mb-3" xs={10}>
                    <Form.Label for="comment">Leave a comment:</Form.Label>
                    <Row>
                      <Form.Control
                        as="textarea"
                        type="input"
                        id="comment"
                        xs={10}
                      />

                      {currentUser ? (
                        <Button
                          onClick={async () => {
                            try {
                              let newComment = {
                                postId: location.state.postId,
                                userId: currentUser.uid,
                                userName: currentUser.displayName,
                                comment: checkComment(
                                  document.getElementById("comment").value
                                ),
                              };
                              await axios
                                .post(
                                  `http://localhost:4000/posts/${originalData._id}/comment`,
                                  newComment
                                )
                                .then(function (response) {
                                  alert("Successfully commented!");
                                  setUpdate((update) => update + 1);
                                  document.getElementById("comment").value = "";
                                })
                                .catch(function (error) {
                                  // handle error
                                  alert(error);
                                });
                            } catch (e) {
                              if (!e.message) alert(e);
                              else alert(e.message);
                            }
                          }}
                        >
                          Comment as {currentUser.displayName}
                        </Button>
                      ) : (
                        <Button disabled onClick={() => {}}>
                          Log in First
                        </Button>
                      )}
                    </Row>
                  </Form.Group>

                  {originalData.comments.length === 0
                    ? "No comment"
                    : originalData.comments.map((ele) => {
                        return (
                          <Card>
                            <Card.Text>{ele.comment}</Card.Text>
                            <Card.Subtitle className="mb-2 text-muted text-end">
                              Commented by {ele.userName} at{" "}
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
                            {currentUser && currentUser.uid === ele.userId ? (
                              //                          (currentUser.uid === ele.userId ||
                              //                              currentUser.uid === originalData.userId) ? (
                              <Button
                                variant="primary"
                                onClick={() => {
                                  handleDeleteComment(originalData, ele);
                                }}
                              >
                                Delete
                              </Button>
                            ) : null}

                            {showDeleteCommentModal && (
                              <DeleteCommentModal
                                isOpen={showDeleteCommentModal}
                                handleClose={handleCloseModal}
                                deletePost={deletePost}
                                deleteComment={deleteComment}
                              />
                            )}
                          </Card>
                        );
                      })}
                </Card.Body>
              </Card>
            </Col>
          )}
          <Col className="col-6 col-sm-4">
            <div ref={mapContainer} className="map-container" />
            <div className="sidebar">
              Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
          </Col>
        </Row>
      </Container>
    );
  } else {
    alert("No param passing!");
    return (
      <div className="col-6 col-sm-4">
        <div ref={mapContainer} className="map-container" />
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <Navigate to="/" />
      </div>
    );
  }
}
