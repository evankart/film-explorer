import { useEffect } from "react";
interface SearchProps {
  api_key: string;
  createImageBox: Function;
  getURLList: Function;
  updateSearchTerms: Function;
}

export default function Search(props: SearchProps) {
  // `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&${tagURL}${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;

  const photoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${props.api_key}&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&`;

  const searchBox = document.getElementById("searchBox");
  const filmStock = document.getElementById("filmStock");
  const camera = document.getElementById("camera");

  // const focalLength = document.getElementById("focalLength");
  // const flickrImg = document.getElementById("flickrImg");

  let searchURL = "";
  let searchTerm = "";
  let cameraTerm = "";
  let filmStockTerm = "";

  const searchBtn: Element | null = document.querySelector(".searchBtn");

  useEffect(() => {
    search();
  }, []);

  if (searchBtn) {
    searchBtn.addEventListener("click", search);
  }
  function search() {
    // console.log("---RUN search()");
    if (camera) {
      console.log("camera: ", camera.innerText);
    }

    createSearchURL();
    console.log("searchURL: ", searchURL);
    console.log("Searching...");
  }

  async function createSearchURL() {
    // console.log("---RUN createSearchURL()");

    // console.log(api_key, baseURL, apiURL, searchTerm);

    if (searchBox) {
      searchTerm = (searchBox as HTMLInputElement).innerText;
      console.log("searchTerm: ", searchTerm);
    } else {
      console.log("no search box");
    }
    if (camera) {
      cameraTerm = (camera as HTMLInputElement).value;
      console.log("cameraTerm: ", cameraTerm);
    }
    if (filmStock) {
      filmStockTerm = (filmStock as HTMLInputElement).value;
      console.log("filmStockTerm: ", filmStockTerm);
    }

    props.updateSearchTerms(searchTerm, filmStockTerm, cameraTerm);

    let page = 1;
    searchURL = `${photoBaseURL}tags=${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;
    // console.log("searchURL: ", searchURL);
    // console.log("---FETCH searchURL: ");

    await fetch(searchURL)
      .then((response) => response.json())
      .then((response) => props.getURLList(response));
  }

  return (
    <div
      id="search"
      style={{
        backgroundColor: "skyblue",
        margin: "0",
        padding: "15px 0 15px 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label htmlFor="filmStock">Film Stock:</label>
      <select name="filmStock" id="filmStock" defaultValue={"Portra400"}>
        <option value="Portra400" disabled hidden>
          Portra 400
        </option>
        <option value="">N/A</option>
        <optgroup label="Color Film"></optgroup>
        <option value="Portra400">Portra 400</option>
        <option value="KodakGold">Kodak Gold</option>
        <option value="ColorPlus">Color Plus</option>
        <option value="Ektar">Ektar</option>
        <option value="Cinestill800T">Cinestill 800T</option>
        <option value="FujiSuperia">Fuji Superia</option>
        <optgroup label="Black and White Film"></optgroup>
        <option value="IlfordHP5">Ilford HP5</option>
        <option value="IlfordDelta">Ilford Delta</option>
        <option value="IlfordXP2">Ilford XP2</option>
        <option value="TMax400">T-Max 400</option>
        <option value="TriXPan">Tri-X Pan 400</option>
        <option value="Acros100">Acros 100</option>
        <option value="Fomapan100">Fomapan 100</option>
      </select>

      <br />

      <label htmlFor="camera">Camera:</label>
      <select name="camera" id="camera" defaultValue={"N/A"}>
        <option value="" disabled hidden>
          N/A
        </option>
        <option value="">N/A</option>
        <option value="canonA-1">Canon A-1</option>
        <option value="OlympusStylus">Olympus Stylus</option>
        <option value="MamiyaRZ67">Mamiya RZ67</option>
        <option value="Polaroid">Polaroid</option>
        <option value="Holga120">Holga</option>
      </select>

      <br />

      <label htmlFor="searchBox">Keywords:</label>
      <input type="text" id="searchBox" placeholder="e.g. 'cats'" />

      <br />

      <button className="searchBtn" onClick={search}>
        Search
      </button>
    </div>
  );
}
