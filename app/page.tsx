"use client";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import axios from "axios";
import PlaceElement from "./placeElement";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map"), {
  ssr: false,
});

export default function Home() {
  const getLocalDate = () => {
    const date = new Date();
    const localDateString = date.toLocaleString().split(",")[0];
    let [localDay, localMonth, localYear] = localDateString.split(".");
    localDay = localDay.length < 2 ? "0" + localDay : localDay;
    localMonth = localMonth.length < 2 ? "0" + localMonth : localMonth;
    return `${localYear}-${localMonth}-${localDay}`;
  };

  const [tripStartDate, setTripStartDate] = useState(getLocalDate());
  const [tripEndDate, setTripEndDate] = useState(getLocalDate());

  const [elements, setElements] = useState({});

  useEffect(() => {
    console.log(elements);
  }, [elements]);

  return (
    <div className="max-h-screen h-screen flex flex-row">
      <Sidebar elements={elements} setElements={setElements}></Sidebar>
      <div className="relative flex flex-col w-full border border-gray-700 rounded m-4 p-4">
        <div className="flex place-items-center justify-between flex-wrap">
          <div className="flex flex-wrap place-items-center gap-2">
            <input
              type="text"
              placeholder="Trip name"
              className="p-2 border border-gray-600 rounded"
            />
            <p>Start date:</p>
            <input
              type="date"
              value={tripStartDate}
              className="p-2 border border-gray-600 rounded"
              onChange={(e) => setTripStartDate(e.target.value)}
            />
            <p>End date:</p>
            <input
              type="date"
              value={tripEndDate}
              className="p-2 border border-gray-600 rounded"
              onChange={(e) => setTripEndDate(e.target.value)}
            />
          </div>
          <div className="flex place-items-center gap-4">
            <input
              type="button"
              value="<-"
              className="px-4 border border-gray-600 py-2 hover:border-white cursor-pointer rounded transition-all"
            />
            <p>{getLocalDate()}</p>
            <input
              type="button"
              value="->"
              className="px-4 border border-gray-600 py-2 hover:border-white cursor-pointer rounded transition-all"
            />
          </div>
        </div>
        {/* <div className="flex flex-row w-full">
          <div className="flex flex-col w-fit border mt-4 border-gray-700 rounded">
            <div className="flex flex-row place-items-center justify-between bg-emerald-400 rounded-t px-2">
              <span>On time</span>
              <div className="w-2 h-2 bg-green-600 animate-ping rounded-full"></div>
            </div>
            <input
              type="text"
              placeholder="Flight number"
              className="p-2 border border-gray-600 rounded-b"
            />
          </div>
        </div> */}
        <Map places={elements}></Map>
        <p className="mt-4 text-lg">Day 1</p>
        <div className="h-full flex flex-col w-full mt-2 gap-4 overflow-y-auto">
          {Object.entries(elements).map(([timestamp, element]) => {
            return (
              <PlaceElement
                key={timestamp}
                elements={elements}
                setElements={setElements}
                timestamp={timestamp}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
