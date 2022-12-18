import React, { useRef, useContext, useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Pagination,
  Row,
  Card,
  Col,
} from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import ModalContext from "react-bootstrap/ModalContext";
import Modal from "react-bootstrap/Modal";
import DeletePostModal from "./modals/DeletePostModal";
import { AuthContext } from "../firebase/Auth";
import CurrentLocationLngLatContext from "./CurrentLocationLngLatContext";

export default function MyPosts() {
  const { currentUser } = useContext(AuthContext);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-74.0254848);
  const [lat, setLat] = useState(40.7446316);
  const [zoom, setZoom] = useState(9);
  const lnglat = useContext(CurrentLocationLngLatContext);
  const popup1 = new mapboxgl.Popup({ offset: 25 }).setHTML(
    "<h1>Your current location</h1>"
  );
  const currentLocationMarker = new mapboxgl.Marker()
    .setLngLat(lnglat.current)
    .setPopup(popup1);

  const navigate = useNavigate();
  const [pagenum, setPagenum] = useState(1);
  const [nextPage, setNextPage] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [markerStack, setMarkerStack] = useState([]);
  //const [update, setUpdate] = useState(1);
  //const [show, setShow] = useState(false);

  //const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);

  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [reloadAfterDeletePost, setReloadAfterDeletePost] = useState(false);
  const handleDeletePostModal = (post) => {
    setShowDeletePostModal(true);
    setDeletePost(post);
  };

  const handleCloseModal = () => {
    setShowDeletePostModal(false);
    setDeletePost(null);
    setReloadAfterDeletePost(!reloadAfterDeletePost);
  };

  const fetchData = async () => {
    try {
      await axios
        .get(`http://localhost:4000/user/${currentUser.uid}?pagenum=${pagenum}`)
        .then(function (response) {
          setOriginalData(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
      await axios
        .get(
          `http://localhost:4000/user/${currentUser.uid}?pagenum=${pagenum + 1}`
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
        lnglat.current = [position.coords.longitude, position.coords.latitude];
        currentLocationMarker.setLngLat(lnglat.current);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    fetchData();
  }, [pagenum, reloadAfterDeletePost]);

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

  function contentTextTrimer(text) {
    if (text.length >= 100) {
      text = text.slice(0, 97) + "...";
    }
    return text;
  }

  return (
    <Container>
      <h1>My Posts</h1>
      {!originalData ? null : originalData && originalData == [] ? (
        <h2>It seems like you do not have any post. :</h2>
      ) : (
        <Row>
          <Col>
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
              {/*<Pagination.Ellipsis />*/}
              {/*<Pagination.Item onClick={()=>{setPagenum(Math.ceil(selectedData.length / 10))}}>{Math.ceil(selectedData.length / 10)}</Pagination.Item>*/}
              {
                // pagenum === Math.ceil(originalData.length / 10) ?
                nextPage == true ? (
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
                )
              }
              {/*<Pagination.Last onClick={()=>{setPagenum(Math.ceil(selectedData.length / 10))}}/>*/}
            </Pagination>
          </Col>

          <Row>
            <Col>
              {!originalData
                ? null
                : originalData.map((ele) => {
                    //console.log("ele", ele._id, ele.userName);
                    return (
                      <Card
                        key={ele._id}
                        className="square border border-5"
                        style={{ width: "25rem" }}
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
                          <Button
                            variant="primary"
                            onClick={() => {
                              navigate("/Edit", {
                                state: { postId: ele._id },
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleDeletePostModal(ele);
                            }}
                          >
                            Delete
                          </Button>
                          {showDeletePostModal && (
                            <DeletePostModal
                              isOpen={showDeletePostModal}
                              handleCloseWithYes={handleCloseModal}
                              handleCloseWithNo={handleCloseModal}
                              deletePost={deletePost}
                            />
                          )}
                        </Card.Body>
                      </Card>
                    );
                  })}
            </Col>

            <Row className="col-6 col-sm-4">
              <div ref={mapContainer} className="map-container" />
              <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
              </div>
            </Row>
          </Row>
        </Row>
      )}
    </Container>
  );
}
