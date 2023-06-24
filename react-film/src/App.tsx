import React from "react";
import logo from "./logo.svg";
import "./App.css";

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

  // class Image {
  //   constructor(
  //     imgURL: string,
  //     flickrURL: string,
  //     title: string,
  //     tags: string
  //   ) {
  //     this.imgURL = imgURL;
  //     this.flickrURL = flickrURL;
  //     this.title = title;
  //     this.tags = tags;
  //   }
  // }

  const img1 = new Image();
  // "https://live.staticflickr.com/7372/12502775644_acfd415fa7_w.jpg",
  // "https://flickr.com/",
  // "Sample Image",
  // "Sample Tags"

  console.log("img1", img1);

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

  let fullURL;
  let gallery = document.getElementById("gallery");

  const searchBtn: Element | null = document.querySelector(".searchBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", createURL);

    searchBtn.addEventListener("keydown", function (event) {
      // if (event.keyCode === 13) {
      //   searchBtn.click();
      // }
    });
  }

  async function createURL() {
    //   console.log(api_key, baseURL, apiURL, searchTerm);
    let searchTerm;
    if (searchBox) {
      // let searchTerm: string = searchBox.value.trim();
    }
    let cameraTerm;
    if (camera) {
      // let cameraTerm = camera.value.trim();
    }
    let filmStockTerm;
    // let filmStockTerm = filmStock.value.trim();
    if (gallery) {
      gallery.innerHTML = "";
    }
    let URLlist: string[] = [];
    let page = 1;
    fullURL = `${baseURL}${methodPhotoSearch}&api_key=${api_key}${JSON}&${tagURL}${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;
    console.log("Search URL:", fullURL);
    let while1 = 0;
    let while2 = 0;
    const response = await fetch(fullURL)
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
          console.log("while1: ", while1);

          let randomIndex =
            Math.floor(Math.random() * data.photos.photo.length) + 1;
          console.log("RANDOM INDEX: ", randomIndex);

          let object = data.photos.photo[randomIndex - 1];
          console.log("OBJECT: ", object);
          let serverID = object.server;
          let photoID = object.id;
          let secret = object.secret;
          let imageJPG = `https://live.staticflickr.com/${serverID}/${photoID}_${secret}.jpg`;
          console.log(imageJPG);

          // Keep randomizing results until you get a new image. Break after 100 tries
          while (URLlist.includes(randomIndex.toString()) && while2 > 20) {
            while2++;
            console.log("while2: ", while2);
            randomIndex =
              Math.floor(Math.random() * data.photos.photo.length) + 1;
          }
          URLlist.push(randomIndex.toString()); // track which images have been added
          console.log(URLlist);

          let infoURL = `${baseURL}${methodGetInfo}&api_key=${api_key}${JSON}&photo_id=${photoID}`;
          fetch(infoURL)
            .then((response) => response.json())
            .then((data) => {
              let newFig = document.createElement("figure");
              let wrapLink = document.createElement("a");
              let fullLink = data.photo.urls.url[0]._content;
              wrapLink.href = fullLink;
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
              console.log("author name:", authorName, data);
            })
            .catch((error) =>
              console.log("Error fetching and parsing data.", error)
            );
        }
      });
  }

  createURL();

  return (
    <div className="App">
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

        <button className="searchBtn">Search</button>
      </div>
      <div id="gallery"></div>
    </div>
  );
}

export default App;
