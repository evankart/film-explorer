interface SearchProps {
  api_key: string;
}

export default function Search(props: SearchProps) {
  // `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&${tagURL}${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;

  const RESULTS_LENGTH = 15; // Max number of images displayed in results
  const photoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${props.api_key}&`;

  const searchBox = document.getElementById("searchBox");
  const filmStock = document.getElementById("filmStock");
  const camera = document.getElementById("camera");
  // const focalLength = document.getElementById("focalLength");
  // const flickrImg = document.getElementById("flickrImg");

  let searchURL = "";
  let gallery = document.getElementById("gallery");

  let object;
  let serverID;
  let secret;
  let randomIndex;
  let photoID: string;
  let imageJPG: string;

  const searchBtn: Element | null = document.querySelector(".searchBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", search);
  }
  function search() {
    createSearchURL();
    getURLList();
    console.log("search complete");
  }

  let searchTerm = "";
  let cameraTerm = "";
  let filmStockTerm = "";

  function createSearchURL() {
    // console.log(api_key, baseURL, apiURL, searchTerm);
    if (searchBox) {
      searchTerm = (searchBox as HTMLInputElement).value;
    }
    if (camera) {
      cameraTerm = (camera as HTMLInputElement).value;
    }
    if (filmStock) {
      filmStockTerm = (filmStock as HTMLInputElement).value;
    }

    if (gallery) {
      gallery.innerHTML = "";
    }
    let page = 1;
    searchURL = `${photoBaseURL}tags=${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;
  }

  async function getURLList() {
    let URLlist: string[] = [];
    let while1 = 0;
    let while2 = 0;

    await fetch(searchURL)
      .then((response) => response.json())
      .then((data) => {
        const results = data.photos;
        console.log("SEARCH RESULTS: ", results);
        const resultsCount = data.photos.total;
        if (resultsCount == 0) {
          alert(`Sorry, no results!`);
        } else if (resultsCount < 15) {
          alert(`Only ${resultsCount} result(s)!`);
        }
        console.log("# PHOTOS RETURNED: ", resultsCount);
        const resultsPages = data.photos.pages;
        console.log("# PAGES: ", resultsPages);

        while (URLlist.length < RESULTS_LENGTH) {
          while1++;
          // console.log("while1: ", while1);

          randomIndex =
            Math.floor(Math.random() * data.photos.photo.length) + 1;
          // console.log("RANDOM INDEX: ", randomIndex);

          object = data.photos.photo[randomIndex - 1];
          // console.log("OBJECT: ", object);
          serverID = object.server;
          photoID = object.id.toString();
          secret = object.secret;
          // console.log("IMAGE_JPG", imageJPG);

          // Keep randomizing results until you get a new image. Break after 100 tries
          while (URLlist.includes(randomIndex.toString()) && while2 > 20) {
            while2++;
            // console.log("while2: ", while2);
            randomIndex =
              Math.floor(Math.random() * data.photos.photo.length) + 1;
          }
          URLlist.push(randomIndex.toString()); // track which images have been added
          // console.log(URLlist);
        }
      });
  }
  return (
    <div id="search">
      <label htmlFor="filmStock">Film Stock:</label>
      <select name="filmStock" id="filmStock">
        <option value="Portra400" disabled selected hidden>
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
      <select name="camera" id="camera">
        <option value="" disabled selected hidden>
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
