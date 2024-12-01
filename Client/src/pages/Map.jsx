import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { createRoot } from "react-dom/client";

const Map = () => {
    const mapElement = useRef(null);
    const [map, setMap] = useState(null);
    const [mapLongitude, setMapLongitude] = useState(31.2357); // Default longitude (Cairo, Egypt)
    const [mapLatitude, setMapLatitude] = useState(30.0444); // Default latitude (Cairo, Egypt)
    const [mapZoom, setMapZoom] = useState(20); // Default zoom level
    const [userMarker, setUserMarker] = useState(null);

    const updateMap = () => {
        if (map) {
            map.setCenter([parseFloat(mapLongitude), parseFloat(mapLatitude)]);
            map.setZoom(mapZoom);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapLatitude(latitude);
                    setMapLongitude(longitude);

                    console.log(latitude, longitude);

                    userMarker.setLngLat([longitude, latitude]);
                    setUserMarker(marker);
                    setMapZoom(20);
                },
                () => {
                    alert("Unable to retrieve your location");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    map.on("load", () => {

        console.log("Creating new marker");

        const customMarkerContainer = document.createElement("div");

        const root = createRoot(customMarkerContainer);
        root.render(<MarkerElement />);

        const marker = new tt.Marker({ element: customMarkerContainer })
          .setLngLat([userMarker.longitude, userMarker.latitude])
          .addTo(map);
    });

    const MarkerElement = () => {
        return (
            <div className="user-location-marker h-5 aspect-square rounded-full p-2 text-red-500 text-2xl">
                <FaMapMarkerAlt />
            </div>
        );
    };

    useEffect(() => {
        const mapInstance = tt.map({
            key: "LGRLpO9NGdpJxDLEi7Dxc8Osv5CyusEc",
            container: mapElement.current,
            center: [mapLongitude, mapLatitude],
            zoom: mapZoom,
        });
        setMap(mapInstance);

        // Try to get the user's current location on mount
        getCurrentLocation();

        return () => mapInstance.remove();
    }, []);

    useEffect(() => {
        updateMap();
    }, [mapLongitude, mapLatitude, mapZoom]);

    return (
        <div className="relative">
            <div className="!h-full w-full absolute top-0 left-0">
                <div
                    ref={mapElement}
                    className="mapDiv min-h-dvh !h-full w-full"
                ></div>
            </div>
            <div className="absolute top-4 left-4 z-10">
                <Button onClick={getCurrentLocation}>
                    Get Current Location
                </Button>
            </div>
        </div>
    );
};

export default Map;
