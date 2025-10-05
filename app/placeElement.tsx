import axios from "axios";
import { time } from "console";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function PlaceElement({
  elements,
  setElements,
  timestamp,
}: {
  elements: any;
  setElements: Dispatch<SetStateAction<{}>>;
  timestamp: string;
}) {
  const [placeName, setPlaceName] = useState("");
  const [debouncedPlace] = useDebounce(placeName, 500);
  const [isEditing, setIsEditing] = useState(true);
  const [autocompletePlaceName, setAutocompletePlaceName] = useState({});
  const [placeLocation, setPlaceLocation] = useState("");
  const [debouncedLocation] = useDebounce(placeLocation, 500);
  const [autocompletePlaceAddress, setAutocompletePlaceAddress] = useState({});
  const [autocompleteEnabled, setAutocompleteEnabled] = useState(true);
  const [placeLat, setPlaceLat] = useState("");
  const [placeLon, setPlaceLon] = useState("");
  const [placeBoundingBox, setPlaceBoundingBox] = useState([]);
  const [placeNotes, setPlaceNotes] = useState("");

  const getAutocompleteSuggestions = async (placeName: string) => {
    if (!autocompleteEnabled || !placeName || placeName.length < 2) {
      return;
    }
    const data = await axios.get(
      `https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_LOCATION_API_KEY}&q=${placeName}&limit=3&dedupe=1&`
    );
    setAutocompletePlaceName(data);
    console.log(data.data);
  };

  const getCoordinatesFromAddress = async (address: string) => {
    if (!address) {
      return;
    }
    const data = await axios.get(
      `https://api.locationiq.com/v1/search?key=${process.env.NEXT_PUBLIC_LOCATION_API_KEY}&q=${address}&limit=3&format=json`
    );
    setAutocompletePlaceAddress(data);
    console.log(data.data);
  };

  useEffect(() => {
    getAutocompleteSuggestions(debouncedPlace);
  }, [debouncedPlace]);

  useEffect(() => {
    getCoordinatesFromAddress(debouncedLocation);
  }, [debouncedLocation]);

  return (
    <div className="grid grid-cols-[80%_20%] w-full border border-gray-700 rounded p-4">
      <div className="flex flex-col gap-2 pr-4">
        {isEditing ? (
          <div className="border border-gray-600 rounded">
            <input
              type="text"
              placeholder="Place Name"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              onClick={() => setAutocompleteEnabled(true)}
              className="w-full p-2"
            />
            {autocompletePlaceName.data && (
              <div
                className="flex flex-col px-2 rounded border border-transparent cursor-pointer hover:border-gray-600 transition-all"
                onClick={() => {
                  setPlaceName(placeName);
                  setAutocompletePlaceName({});
                  setAutocompleteEnabled(false);
                }}
              >
                <p>{placeName}</p>
                <span className="text-gray-500 text-sm">
                  Ignore autocomplete
                </span>
              </div>
            )}
            {autocompletePlaceName.data &&
              autocompletePlaceName.data.map((place) => (
                <div
                  key={place.place_id}
                  className="flex flex-col px-2 rounded border border-transparent cursor-pointer hover:border-gray-600 transition-all"
                  onClick={() => {
                    setPlaceLocation(place.display_address);
                    setPlaceName(place.display_place);
                    setAutocompletePlaceName({});
                    setAutocompleteEnabled(false);
                    setPlaceLat(place.lat);
                    setPlaceLon(place.lon);
                    setPlaceBoundingBox(place.boundingbox);
                  }}
                >
                  <p>{place.display_place}</p>
                  <span className="text-gray-500 text-sm">
                    {place.display_address}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex place-items-center gap-2">
            <h2 className="text-lg">{placeName}</h2>
            <p
              className="text-gray-500 hover:underline hover:text-white cursor-pointer transition-all"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </p>
            <p
              className="text-gray-500 hover:underline hover:text-white cursor-pointer transition-all"
              onClick={() =>
                setElements((prev) => {
                  const newElements = { ...prev };
                  delete newElements[timestamp];
                  return newElements;
                })
              }
            >
              Delete
            </p>
          </div>
        )}
        {isEditing ? (
          <textarea
            placeholder="Notes"
            value={placeNotes}
            onChange={(e) => setPlaceNotes(e.target.value)}
            className="p-2 border border-gray-600 rounded-b"
          />
        ) : (
          <p>{placeNotes}</p>
        )}
        {isEditing ? (
          <div className="border border-gray-600 rounded">
            <input
              type="text"
              placeholder="Location"
              value={placeLocation}
              onChange={(e) => setPlaceLocation(e.target.value)}
              className="w-full p-2"
            />
            {autocompletePlaceAddress.data &&
              autocompletePlaceAddress.data.map((place) => (
                <div
                  key={place.place_id}
                  className="flex flex-col px-2 rounded border border-transparent cursor-pointer hover:border-gray-600 transition-all"
                  onClick={() => {
                    setPlaceLocation(place.display_name);
                    setAutocompletePlaceAddress({});
                    setPlaceLat(place.lat);
                    setPlaceLon(place.lon);
                    setPlaceBoundingBox(place.boundingbox);
                  }}
                >
                  <p className="text-gray-500 text-sm">{place.display_name}</p>
                </div>
              ))}
          </div>
        ) : (
          <p>{placeLocation}</p>
        )}
        {isEditing ? (
          <input
            type="button"
            value="Save"
            onClick={() => {
              setIsEditing(false);
              setElements((prev) => ({
                ...prev,
                [timestamp]: {
                  ...prev.timestamp,
                  type: "place",
                  name: placeName,
                  notes: placeNotes,
                  address: placeLocation,
                  lat: placeLat,
                  lon: placeLon,
                  bbox: placeBoundingBox,
                },
              }));
            }}
            className="w-full border border-gray-600 py-2 hover:border-white cursor-pointer rounded transition-all"
          />
        ) : null}
      </div>
      <div className="relative w-full">
        {/* <Image
          src={
            "https://cdn.londonandpartners.com/asset/british-museum_museum-frontage-image-courtesy-of-the-british-museum_f0b0a5a3c53f8fc1564868c561bd167c.jpg"
          }
          alt=""
          fill
          className="rounded aspect-auto"
        /> */}
        {placeBoundingBox.length == 4 ? (
          <iframe
            className="w-full h-full rounded"
            src={`http://www.openstreetmap.org/export/embed.html?bbox=${placeBoundingBox[2]},${placeBoundingBox[0]},${placeBoundingBox[3]},${placeBoundingBox[1]}&layer=mapnik&marker=${placeLat},${placeLon}`}
          ></iframe>
        ) : (
          <iframe
            className="w-full h-full rounded"
            src={`http://www.openstreetmap.org/export/embed.html?layer=mapnik`}
          ></iframe>
        )}
      </div>
    </div>
  );
}
