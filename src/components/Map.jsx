import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useURlposition } from "../hooks/useURlposition";

function Map() {
  const { cities } = useCities();

  const [MapPostion, setMappostion] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geoPosition,
    getPosition,
  } = useGeolocation();

  const [Maplat, Maplng] = useURlposition();

  useEffect(
    function () {
      if (Maplat && Maplng) setMappostion([Maplat, Maplng]);
    },
    [Maplat, Maplng]
  );

  useEffect(
    function () {
      if (geoPosition) setMappostion([geoPosition.lat, geoPosition.lng]);
    },
    [geoPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoPosition && (
        <Button type="position" onclick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        className={styles.map}
        center={MapPostion}
        // center={[Maplat, Maplng]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker position={city.position} key={city.id}>
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangePostion position={MapPostion} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangePostion({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      console.log(e.latlng);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
