import React from "react";
import "./App.css";
import Spinner from "./components/Spinner/Spinner";
import Card from "./components/Card/Card";
import { useState, useEffect, useRef, useCallback } from "react";

function App() {
  const [launches, setLaunch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setOffset(0);
    setLaunch([]);
    setSearch(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    const query = `rocket_name=${search}`;
    fetch(
      `https://api.spacexdata.com/v3/launches/?${
        query + "&"
      }limit=10&offset=${offset}`
    )
      .then((res) => res.json())
      .then((launches) => {
        if (launches.length < 10) {
          setHasMore(false);
        }
        setLaunch((prevState) => [...prevState, ...launches]);
        setLoading(false);
        console.log(offset, hasMore);
      });
  }, [offset, hasMore, search]);

  const observer = useRef();
  const lastLaunchElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prevOffset) => prevOffset + 10);
          console.log("intersecting");
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  console.log(launches);
  return (
    <div className="App">
      <input
        value={search}
        onChange={handleSearch}
        className="search"
        type="text"
        placeholder="Search Mission Name"
      ></input>
      <div className="list">
        {launches.map((launch, index) => {
          if (launches.length === index + 1) {
            return (
              <Card
                lastRef={lastLaunchElementRef}
                images={launch.links.flickr_images}
                key={launch.flight_number}
                header={launch.mission_name}
                badge={launch.upcoming}
                year={launch.launch_date_unix}
              />
            );
          } else {
            return (
              <Card
                imagesLink={launch.links.flickr_images}
                key={launch.flight_number}
                header={launch.mission_name}
                badge={launch.upcoming}
                year={launch.launch_date_unix}
              />
            );
          }
        })}
        {loading && <Spinner />}
        {!hasMore && <p>No more data to fetch</p>}
      </div>
    </div>
  );
}

export default App;
