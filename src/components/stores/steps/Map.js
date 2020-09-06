import React from "react";

import { Button, Tooltip } from "antd";
import "@reach/combobox/styles.css";

import FadeLoader from "react-spinners/FadeLoader";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import geohash from "ngeohash";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
};

const center = {
  lat: 12.879721,
  lng: 121.774017,
};

export default function App({ onFinish2 }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDx6E9M7YcoilEIfy59pshCn2pj-QNEjoo",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [ghash, setGhash] = React.useState();

  const [address, setAddress] = React.useState();

  const onMapClick = React.useCallback(e => {
    console.log(e);
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newGhash = geohash.encode(lat, lng);
    setMarkers({ lat, lng });
    setGhash(newGhash);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback(map => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded)
    return (
      <div className="centerLoader">
        <FadeLoader loading={true} color="#43DABC" />
      </div>
    );

  const handleSubmit = () => {
    const loc = { ...markers, ghash, address };
    onFinish2(loc);
  };

  return (
    <div className="google_map">
      <Locate panTo={panTo} />
      {isLoaded && <Search panTo={panTo} setAddress={setAddress} />}
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        <Marker
          key={`${markers.lat}-${markers.lng}`}
          position={{
            lat: parseFloat(markers.lat),
            lng: parseFloat(markers.lng),
          }}
        />
      </GoogleMap>
      <Button
        type="primary"
        htmlType="submit"
        style={{ margin: "1rem" }}
        disabled={markers.length === 0 || !address ? true : false}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {markers.length === 0 || !address ? (
        <i> pin and search a location to proceed</i>
      ) : null}
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <Tooltip title="Click for current location">
        <img src="/compass.svg" alt="compass" />
      </Tooltip>
      ,
    </button>
  );
}

function Search({ panTo, setAddress }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 12.879721, lng: () => 121.774017 },
      radius: null,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = e => {
    setValue(e.target.value);
  };

  const handleSelect = async address => {
    setAddress(address);
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error.message);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
