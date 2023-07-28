import { useEffect, useState } from "react";
interface SearchProps {
  api_key: string;
  createImageBox: Function;
  getSearchResults: Function;
  changeFilm: Function;
  changeCamera: Function;
  changeKeywords: Function;
  cameraStr: string;
  film: string;
  keywords: string;
}

export default function Search(props: SearchProps) {
  // `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&${tagURL}${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;

  let page = 1;
  const photoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${props.api_key}&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&`;

  // const focalLength = document.getElementById("focalLength");
  // const flickrImg = document.getElementById("flickrImg");

  const [searchURL, setSearchURL] = useState(
    `${photoBaseURL}tags=Portra400,&${page}`
  );

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    updateSearchURL();
  }, [props.keywords, props.film, props.cameraStr]);

  const updateSearchURL = () => {
    setSearchURL(
      `${photoBaseURL}tags=${props.keywords},${props.film.replace(
        /\s/g,
        ""
      )},${props.cameraStr.replace(/\s/g, "")},&${page}`
    );
  };

  async function search() {
    updateSearchURL();

    console.log("Searching...", searchURL);

    await fetch(searchURL)
      .then((response) => response.json())
      .then((response) => props.getSearchResults(response));
  }

  return (
    <div
      id="search"
      className="w-full items-center"
      style={{
        backgroundColor: "none",
        margin: "0",
        padding: "15px 0 15px 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label htmlFor="filmStock">Film Stock:</label>
      <select
        name="filmStock"
        id="filmStock"
        defaultValue={"Portra400"}
        onChange={(e) => props.changeFilm(e)}
      >
        <option value="Portra400" disabled hidden>
          Portra 400
        </option>
        <option value="">N/A</option>
        <optgroup label="Color Film"></optgroup>
        <option value="Portra 400">Portra 400</option>
        <option value="Kodak Gold">Kodak Gold</option>
        <option value="Color Plus">Color Plus</option>
        <option value="Ektar">Ektar</option>
        <option value="Cinestill 800T">Cinestill 800T</option>
        <option value="Fuji Superia">Fuji Superia</option>
        <optgroup label="Black and White Film"></optgroup>
        <option value="Ilford HP5">Ilford HP5</option>
        <option value="Ilford Delta">Ilford Delta</option>
        <option value="Ilford XP2">Ilford XP2</option>
        <option value="TMax 400">T-Max 400</option>
        <option value="TriXPan">Tri-X Pan 400</option>
        <option value="Acros 100">Acros 100</option>
        <option value="Fomapan 100">Fomapan 100</option>
      </select>

      <br />

      <label htmlFor="camera">Camera:</label>
      <select
        name="camera"
        id="camera"
        defaultValue={"N/A"}
        onChange={(e) => props.changeCamera(e)}
      >
        <option value="" disabled hidden>
          N/A
        </option>
        <option value="">N/A</option>
        <option value="Canon A-1">Canon A-1</option>
        <option value="Olympus Stylus">Olympus Stylus</option>
        <option value="Mamiya RZ67">Mamiya RZ67</option>
        <option value="Polaroid">Polaroid</option>
        <option value="Holga 120">Holga</option>
      </select>

      <br />

      <label htmlFor="searchBox">Keywords:</label>
      <input
        type="text"
        id="searchBox"
        placeholder="e.g. 'cats'"
        onChange={(e) => props.changeKeywords(e)}
      />

      <br />

      <div className="flex justify-between">
        <button className="w-8 " onClick={search}>{`<`}</button>
        <button className="searchBtn mx-2 w-24" onClick={search}>
          Search
        </button>
        <button className="w-8" onClick={search}>{`>`}</button>
      </div>
    </div>
  );
}