import React, { useState, useEffect, useRef } from "react";
import { Button, Drawer, Space, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import UserIconAnimated from "../assets/Images/icons8-street-view.gif";
import UserIconStatic from "../assets/Images/Person.svg";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { createRoot } from "react-dom/client";
import Services from "../components/Services";
import { getCookie } from "../utils/cookies";
import useServicesStore from "../store/ServicesStore";
import { GiTowTruck } from "react-icons/gi";
import WorkshopIcon from "../assets/Images/Workshop.svg";
import axios from "axios";

const { Text } = Typography;

const Map = () => {
  const mapElement = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [marker, setMarker] = useState(null);
  const [mapLongitude, setMapLongitude] = useState(31.2357);
  const [mapLatitude, setMapLatitude] = useState(30.0444);
  const [mapZoom, setMapZoom] = useState(15);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const setServices = useServicesStore((state) => state.setServices);

  const fetchServices = async () => {
    try {
      const token = getCookie("session_token");
      const response = await axios.get(
        "https://wincheck-production.up.railway.app/api/user/nearby",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const UserMarkerElement = () => {
    const [isAnimated, setIsAnimated] = useState(false);
    useEffect(() => {
      const interval = setInterval(() => {
        setIsAnimated((prev) => !prev);
      }, 1240);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="h-14 flex justify-center bg-white items-center aspect-square rounded-full p-2">
        <img
          src={isAnimated ? UserIconAnimated : UserIconStatic}
          alt="User Icon"
        />
      </div>
    );
  };

  const MarkerElement = ({ type }) => (
    <div className="h-14 flex justify-center bg-[#F9CD6A] items-center aspect-square rounded-full p-2">
      {type === "winch" ? <GiTowTruck /> : <img src={WorkshopIcon} alt="Workshop Icon" />}
    </div>
  );

  const updateMarker = (longitude, latitude) => {
    if (!map) return;
    if (marker) {
      marker.setLngLat([longitude, latitude]);
    } else {
      const markerContainer = document.createElement("div");
      const root = createRoot(markerContainer);
      root.render(<UserMarkerElement />);
      const newMarker = new tt.Marker({ element: markerContainer })
        .setLngLat([longitude, latitude])
        .addTo(map);
      setMarker(newMarker);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setMapLatitude(latitude);
        setMapLongitude(longitude);
        setMapZoom(15);
        updateMarker(longitude, latitude);
        map.setCenter([longitude, latitude]);
      },
      (error) => console.error("Geolocation error:", error.message)
    );
  };

  useEffect(() => {
    if (!mapElement.current) return;
    const mapInstance = tt.map({
      key: "LGRLpO9NGdpJxDLEi7Dxc8Osv5CyusEc",
      container: mapElement.current,
      center: [mapLongitude, mapLatitude],
      zoom: mapZoom,
    });

    setMap(mapInstance);
    handleGetLocation();

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (map) {
      map.setCenter([mapLongitude, mapLatitude]);
      updateMarker(mapLongitude, mapLatitude);
    }
  }, [mapLongitude, mapLatitude]);

  const handleGetLocation = () => {
    if (!isGettingLocation) {
      setIsGettingLocation(true);
      getCurrentLocation();
      setTimeout(() => setIsGettingLocation(false), 2000);
    }
  };

  const locatService = (longitude, latitude, role, id, username, phone) => {
    if (!map || isNaN(latitude) || isNaN(longitude)) return;
  
    const existingMarker = markers.find((m) => m.id === id);
    if (existingMarker) return;
  
    const markerContainer = document.createElement("div");
    const root = createRoot(markerContainer);
    root.render(<MarkerElement type={role} />);
    const newMarker = new tt.Marker({ element: markerContainer })
      .setLngLat([longitude, latitude])
      .addTo(map);

    newMarker.getElement().addEventListener('click', () => {
      if (role !== 'user') {
        setSelectedService({ username, role, phone });
        setDrawerVisible(true);
      }
    });
        
    // Store marker with role and ID
    setMarkers((prev) => [...prev, { id, role, marker: newMarker }]);
  
    // Center the map on the new marker
    map.setCenter([longitude, latitude]);
  };
  

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(selectedService.phone);
    message.success("Phone number copied!");
  };

  return (
    <div className="relative">
      <div ref={mapElement} className="absolute inset-0 h-dvh w-full"></div>
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={handleGetLocation} loading={isGettingLocation}>
          Get Current Location
        </Button>
      </div>
      <Services locatService={locatService} selecteService={(service) => {setSelectedService(service); setDrawerVisible(true)}} />

      <Drawer
        title={selectedService.role}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={400}
      >
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Text strong>User: {selectedService.username}</Text>
          <Text>Phone: {selectedService.phone}</Text>
          <Space>
            <Button onClick={handleCopyPhone} icon={<CopyOutlined />}>
              Copy Phone Number
            </Button>
            <Button disabled type="primary">Request</Button>
          </Space>
        </Space>
      </Drawer>
    </div>
  );
};

export default Map;
