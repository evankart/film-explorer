import { useState, useEffect } from "react";
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

  const [film, setFilm] = useState("Portra 400");
  const [cameraStr, setCameraStr] = useState("");
  const [keywords, setKeywords] = useState("");

  const RESULTS_LENGTH = 15; // Max number of images displayed in results
  const api_key = "e094e7d812d749a0545718fa9e86b735";
  const infoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.getinfo&api_key=${api_key}&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&`;
  let imageJPG: string;
  let cameraTerm: string = "";
  let filmStockTerm: string = "";
  let gallery: HTMLElement | null;
  let serverID: string = "";
  let secret: string = "";
  let object: any = "";
  let randomIndex: number;
  let photoID = "";
  let searchTerm = "";
  const searchBox = document.getElementById("searchBox");
  const filmStock = document.getElementById("filmStock");
  const camera = document.getElementById("camera");

  const changeFilm = (e: React.FormEvent<HTMLInputElement>) => {
    setFilm((e.target as HTMLSelectElement).value);
  };

  const changeCamera = (e: React.FormEvent<HTMLInputElement>) => {
    setCameraStr((e.target as HTMLSelectElement).value);
  };

  const changeKeywords = (e: React.FormEvent<HTMLInputElement>) => {
    setKeywords((e.target as HTMLInputElement).value);
  };

  useEffect(() => {
    console.log("film changed: ", film);
  }, [film]);

  useEffect(() => {
    console.log("camera changed: ", cameraStr);
  }, [cameraStr]);

  useEffect(() => {
    console.log("keywords changed: ", keywords);
  }, [keywords]);

  async function getURLList(data: any) {
    // console.log("---RUN getURLList");

    let URLlist: string[] = [];
    let whileVal = 0;
    console.log("URLList Data: ", data);
    const resultsCount = data.photos.total;
    if (resultsCount === 0) {
      alert(`Sorry, no results!`);
    } else if (resultsCount < 15) {
      alert(`Only ${resultsCount} result(s)!`);
    }
    console.log("# PHOTOS RETURNED: ", resultsCount);
    const resultsPages = data.photos.pages;
    console.log("# PAGES: ", resultsPages);
    while (URLlist.length < RESULTS_LENGTH) {
      randomIndex = Math.floor(Math.random() * data.photos.photo.length) + 1;
      // console.log("RANDOM INDEX: ", randomIndex);
      object = data.photos.photo[randomIndex - 1];
      if (object) {
        photoID = object.id.toString();
      }

      // serverID = object.server;
      // secret = object.secret;
      // Keep randomizing results until you get a new image. Break after 100 tries
      while (URLlist.includes(randomIndex.toString()) && whileVal > 20) {
        whileVal++;
        // console.log("whileVal: ", whileVal);
        randomIndex = Math.floor(Math.random() * data.photos.photo.length) + 1;
      }
      URLlist.push(randomIndex.toString()); // track which images have been added
      // console.log("URLList", URLlist);
      // console.log("photID", photoID);
      createImageBox(photoID);
    }
  }

  async function createImageBox(ID: string) {
    // console.log("---RUN createImageBox");

    let infoURL = `${infoBaseURL}photo_id=${ID}`;

    // console.log("info search URL: ", infoURL);
    await fetch(infoURL)
      .then((response) => response.json())
      .then((data) => {
        // console.log("---FETCHED infoURL");
        let flickrLink = data.photo.urls.url[0]._content;
        // console.log("flickrLink: ", flickrLink);

        let newFig = document.createElement("figure");
        let wrapLink = document.createElement("a");
        wrapLink.href = flickrLink;
        wrapLink.target = "_blank";

        let newImg = document.createElement("img");
        serverID = data.photo.server;
        secret = data.photo.secret;
        photoID = data.photo.id;
        // console.log(serverID, secret, photoID);

        imageJPG = `https://live.staticflickr.com/${serverID}/${photoID}_${secret}_w.jpg`;
        // console.log("imageJPG: ", imageJPG);
        newImg.src = imageJPG;
        let newCaption = document.createElement("figcaption");
        let authorLink = document.createElement("a");
        // console.log(newFig);

        wrapLink.appendChild(newImg);
        newFig.appendChild(wrapLink);
        gallery = document.getElementById("gallery");
        if (gallery != null) {
          gallery.appendChild(newFig);
          // console.log(gallery);
        }

        newFig.appendChild(newCaption);
        newCaption.appendChild(authorLink);

        let authorName = data.photo.owner.realname;
        let username = data.photo.owner.username;
        let nsid = data.photo.owner.nsid;
        authorLink.href = `https://www.flickr.com/photos/${nsid}/`;

        authorLink.target = "_blank";
        let authorText;
        if (authorName !== "") {
          authorText = authorName;
        } else {
          authorText = username;
        }

        authorLink.textContent = `Film Stock: ${film} | Camera: ${cameraStr} | by ${authorText}`;
      })
      .catch((error) => console.log("Error fetching and parsing data.", error));
  }

  return (
    <div className="App" style={{ width: "100vw", overflowX: "hidden" }}>
      <Search
        api_key={api_key}
        createImageBox={createImageBox}
        getURLList={getURLList}
        changeFilm={changeFilm}
        changeCamera={changeCamera}
        changeKeywords={changeKeywords}
        cameraStr={cameraStr}
        film={film}
        keywords={keywords}
      />

      <Gallery test={api_key} />
    </div>
  );
}

export default App;
