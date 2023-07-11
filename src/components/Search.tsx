import { useEffect } from "react";
interface SearchProps {
  api_key: string;
  createImageBox: Function;
  getURLList: Function;
  changeFilm: Function;
  changeCamera: Function;
  changeKeywords: Function;
  cameraStr: string;
  film: string;
  keywords: string;
}

export default function Search(props: SearchProps) {
  // `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&${tagURL}${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;

  const photoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${props.api_key}&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&`;

  // const focalLength = document.getElementById("focalLength");
  // const flickrImg = document.getElementById("flickrImg");

  let searchURL = "";

  const searchBtn: Element | null = document.querySelector(".searchBtn");

  useEffect(() => {
    search();
  }, []);

  if (searchBtn) {
    searchBtn.addEventListener("click", search);
  }
  function search() {
    // console.log("---RUN search()");

    createSearchURL();
    console.log("searchURL: ", searchURL);
    console.log("Searching...");
  }

  async function createSearchURL() {
    // console.log("---RUN createSearchURL()");

    // console.log(api_key, baseURL, apiURL, searchTerm);

    let page = 1;
    searchURL = `${photoBaseURL}tags=${props.keywords},${props.film.replace(
      /\s/g,
      ""
    )},${props.cameraStr.replace(/\s/g, "")},&${page}`;
    console.log("searchURL: ", searchURL);
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

      <button className="searchBtn" onClick={search}>
        Search
      </button>
    </div>
  );
}
