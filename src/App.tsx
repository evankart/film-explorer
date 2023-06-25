import { KeyboardEvent } from "react";
import "./App.css";
import Search from "./components/Search";
import Gallery from "./components/Gallery";

function App() {
  // API Explorer: https://www.flickr.com/services/api/explore/flickr.photos.search

  // Example Request: https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value

  // https://www.flickr.com/services/rest/?method=GET&api_key=e094e7d812d749a0545718fa9e86b735&tags=portra400

  // https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=e094e7d812d749a0545718fa9e86b735&tags=portra400

  /*
   * Example image URL: https://flickr.com/photos/156018067@N06/52421787156
   * Owner: 156018067@N06
   * Photo ID: 52421787156
   */

  /*
   * # Example
   * #   server-id: 7372
   * #   photo-id: 12502775644
   * #   secret: acfd415fa7
   * #   size: w
   * #
   */

  // https://live.staticflickr.com/7372/12502775644_acfd415fa7_w.jpg

  /**
   * Get a list of images from search
   * Pick images at random to include in gallery (check for duplicates)
   * For each image selected:
   *    - Create a new object with the Image class
   *    - Get URL for static image
   *    - Get URL for full flickr site
   *    - Get image title and creator
   *    - ADD TO GALLERY ARRAY
   * Loop through each object in array
   *    - Place image in gallery
   *    - hyperlink image to flickr address
   *    - display the title and/or creator under the image
   *    - display the relevant tags
   */

  const RESULTS_LENGTH = 15; // Max number of images displayed in results

  const api_key = "e094e7d812d749a0545718fa9e86b735";
  const baseURL = "https://www.flickr.com/services/rest/?method=";
  const methodPhotoSearch = "flickr.photos.search";
  const methodGetInfo = "flickr.photos.getinfo";
  const tagURL = "tags=";
  const JSON =
    "&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&";
  const searchBox = document.getElementById("searchBox");
  const filmStock = document.getElementById("filmStock");
  const camera = document.getElementById("camera");
  const focalLength = document.getElementById("focalLength");
  const flickrImg = document.getElementById("flickrImg");

  let searchURL = "";
  let gallery = document.getElementById("gallery");

  const searchBtn: Element | null = document.querySelector(".searchBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", search);
  }
  function search() {
    createSearchURL();
    getURLList();
  }
  function createSearchURL() {
    // console.log(api_key, baseURL, apiURL, searchTerm);
    let searchTerm;
    if (searchBox) {
      searchTerm = (searchBox as HTMLInputElement).value;
    }
    let cameraTerm;
    if (camera) {
      // let cameraTerm
      cameraTerm = (camera as HTMLInputElement).value;
    }
    // let filmStockTerm = filmStock.value.trim();
    let filmStockTerm;
    if (filmStock) {
      filmStockTerm = (filmStock as HTMLInputElement).value;
    }

    if (gallery) {
      gallery.innerHTML = "";
    }
    let page = 1;
    searchURL = `${baseURL}${methodPhotoSearch}&api_key=${api_key}${JSON}&${tagURL}${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;
    console.log("Search URL:", searchURL);
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

          let randomIndex =
            Math.floor(Math.random() * data.photos.photo.length) + 1;
          // console.log("RANDOM INDEX: ", randomIndex);

          let object = data.photos.photo[randomIndex - 1];
          // console.log("OBJECT: ", object);
          let serverID = object.server;
          let photoID = object.id;
          let secret = object.secret;
          let imageJPG = `https://live.staticflickr.com/${serverID}/${photoID}_${secret}.jpg`;
          // console.log(imageJPG);

          // Keep randomizing results until you get a new image. Break after 100 tries
          while (URLlist.includes(randomIndex.toString()) && while2 > 20) {
            while2++;
            // console.log("while2: ", while2);
            randomIndex =
              Math.floor(Math.random() * data.photos.photo.length) + 1;
          }
          URLlist.push(randomIndex.toString()); // track which images have been added
          // console.log(URLlist);

          const createImageBox = function createImageBox() {
            let infoURL = `${baseURL}${methodGetInfo}&api_key=${api_key}${JSON}&photo_id=${photoID}`;
            fetch(infoURL)
              .then((response) => response.json())
              .then((data) => {
                let flickrLink = data.photo.urls.url[0]._content;
                // console.log("flickr link: ", flickrLink);

                let newFig = document.createElement("figure");
                let wrapLink = document.createElement("a");
                wrapLink.href = flickrLink;
                wrapLink.target = "_blank";

                let newImg = document.createElement("img");
                newImg.src = imageJPG;
                let newCaption = document.createElement("figcaption");
                let authorLink = document.createElement("a");

                wrapLink.appendChild(newImg);
                newFig.appendChild(wrapLink);
                if (gallery) {
                  gallery.appendChild(newFig);
                }
                newFig.appendChild(newCaption);
                newCaption.appendChild(authorLink);

                let authorName = data.photo.owner.realname;
                let username = data.photo.owner.username;
                let nsid = data.photo.owner.nsid;
                authorLink.href = `https://www.flickr.com/photos/${nsid}/`;

                authorLink.target = "_blank";
                if (authorName !== "") {
                  authorLink.textContent = `${authorName}`;
                } else {
                  authorLink.textContent = `${username}`;
                }
                // console.log("author name:", authorName, data);
              })
              .catch((error) =>
                console.log("Error fetching and parsing data.", error)
              );
          };
          createImageBox();
        }
      });
  }

  createSearchURL();
  getURLList();

  return (
    <div className="App">
      <Gallery />

      <Search />
      <div id="gallery"></div>
    </div>
  );
}

export default App;
