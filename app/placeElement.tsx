import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function PlaceElement({ elements, timestamp }) {
  const [placeName, setPlaceName] = useState("");
  const [debouncedPlace] = useDebounce(placeName, 500);
  const [isEditing, setIsEditing] = useState(true);
  const [autocompleteData, setAutocompleteData] = useState({});
  const [placeLocation, setPlaceLocation] = useState("");
  const [autocompleteEnabled, setAutocompleteEnabled] = useState(true);

  const getAutocompleteSuggestions = async (placeName: string) => {
    if (!autocompleteEnabled || !placeName || placeName.length < 2) {
      return;
    }
    const data = await axios.get(
      `https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_LOCATION_API_KEY}&q=${placeName}&limit=5&dedupe=1&`
    );
    setAutocompleteData(data);
    console.log(data.data);
  };

  useEffect(() => {
    getAutocompleteSuggestions(debouncedPlace);
  }, [debouncedPlace]);
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
            {autocompleteData.data &&
              autocompleteData.data.map((place) => (
                <div
                  key={place.place_id}
                  className="flex flex-col px-2 rounded border border-transparent cursor-pointer hover:border-gray-600 transition-all"
                  onClick={() => {
                    setPlaceLocation(place.display_address);
                    setPlaceName(place.display_place);
                    setAutocompleteData({});
                    setAutocompleteEnabled(false);
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
          <h2>{placeName}</h2>
        )}
        {isEditing ? (
          <textarea
            placeholder="Notes"
            className="p-2 border border-gray-600 rounded-b"
          />
        ) : (
          <p></p>
        )}
        <p>{placeLocation}</p>
        {isEditing ? (
          <input
            type="button"
            value="Save"
            onClick={() => {
              setIsEditing(false);
              console.log(elements.elements[timestamp]);
            }}
            className="w-full border border-gray-600 py-2 hover:border-white cursor-pointer rounded transition-all"
          />
        ) : null}
      </div>
      <div className="relative w-full">
        <Image
          src={
            "https://cdn.londonandpartners.com/asset/british-museum_museum-frontage-image-courtesy-of-the-british-museum_f0b0a5a3c53f8fc1564868c561bd167c.jpg"
          }
          alt=""
          fill
          className="rounded aspect-auto"
        />
      </div>
    </div>
  );
}
