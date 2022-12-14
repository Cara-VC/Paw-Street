import React, { useRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import "../App.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-74.03);
  const [lat, setLat] = useState(40.75);
  const [zoom, setZoom] = useState(12);
  const popup1 = new mapboxgl.Popup({ offset: 25 })
    //.setText("<Construction on the Washington Monument began in 1848.")
    .setHTML("<h1>Hello World!</h1><a href='/signup'>Nav</a>");
  const marker1 = new mapboxgl.Marker()
    .setLngLat([-73.03, 41.75])
    .setPopup(popup1);
  const marker2 = new mapboxgl.Marker()
    .setLngLat([-73.13, 41.55])
    .setPopup(popup1);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    marker1.addTo(map.current);
    marker2.addTo(map.current);
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
