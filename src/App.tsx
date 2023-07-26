import { useState, useEffect } from "react";
import "./App.css";
import Search from "./components/Search";

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
  let imageObjectArray: any[] = [];
  // const [imageInfoArray, setimageInfoArray] = useState<
  //   Array<ImageObjectState>
  // >([]);
  // const [imageInfoArray, setImageInfoArray] = useState<any>([]);
  let imageInfoArray: any[] = [];

  const RESULTS_LENGTH = 5; // Max number of images displayed in results
  const api_key = "e094e7d812d749a0545718fa9e86b735";
  const infoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.getinfo&api_key=${api_key}&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&`;
  let imageJPG: string = "";
  let gallery: HTMLElement | null = null;
  let serverID: string = "";
  let secret: string = "";
  let imgObject: ImageObjectState;
  let randomIndex: number;
  let photoID = "";
  let URLlist: any[] = [];

  // let imageInfoArray: any[] = [];
  console.log(`image info array init: ${imageInfoArray}`);

  interface ImageObjectState extends Object {
    farm: number;
    id: string;
    isFamily: number;
    isFriend: number;
    ispublic: number;
    owner: string;
    secret: string;
    server: string;
    title: string;
    imgObject: Object;
  }

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
    // console.log("film changed: ", film);
    setFilm(film);
    // console.log("camera changed: ", cameraStr);
    setCameraStr(cameraStr);
    // console.log("keywords changed: ", keywords);
    setKeywords(keywords);

    // setImageInfoArray(imageInfoArray);
  }, [film, cameraStr, keywords]);

  if (gallery == null) {
    console.log("gallery doesn't exist: ", gallery);
    gallery = document.createElement("div");
    gallery.setAttribute("id", "gallery");
  } else {
    gallery = document.getElementById("gallery");
    console.log("gallery exists: ", gallery);
  }

  async function getSearchResults(data: any) {
    console.log("Search Response Data: ", data);

    const resultsCount = data.photos.total;
    if (resultsCount === 0) {
      alert(`Sorry, no results!`);
    } else if (resultsCount < 15) {
      alert(`Only ${resultsCount} result(s)!`);
    }
    const resultsPages = data.photos.pages;

    console.log("# PHOTOS RETURNED: ", resultsCount);
    console.log("# PAGES: ", resultsPages);

    while (imageObjectArray.length < RESULTS_LENGTH) {
      randomIndex = Math.floor(Math.random() * data.photos.photo.length) + 1;
      // console.log("RANDOM INDEX: ", randomIndex);
      imgObject = data.photos.photo[randomIndex - 1];
      if (imgObject) {
        photoID = imgObject.id.toString();
      }

      // Keep randomizing results until you get a new image. Break after 100 tries
      while (URLlist.includes(randomIndex.toString())) {
        randomIndex = Math.floor(Math.random() * data.photos.photo.length) + 1;
      }
      URLlist.push(randomIndex.toString()); // track which images have been added

      imageObjectArray.push(imgObject);
      if (imageObjectArray.length === RESULTS_LENGTH) {
        console.log("Image Object Array: ", imageObjectArray);
        imageObjectArray.forEach((image) => {
          createImageBox(image);
        });
      }
    }
  }

  async function createImageBox(image: any) {
    // console.log("---RUN createImageBox");

    let infoURL = `${infoBaseURL}photo_id=${image.id}`;

    // console.log("info search URL: ", infoURL);
    if (imageInfoArray.length < RESULTS_LENGTH - 1) {
      await fetch(infoURL)
        .then((response) => response.json())
        .then((data) => {
          imageInfoArray.push(data.photo);

          if (imageInfoArray.length === RESULTS_LENGTH - 1) {
            console.log("Image Info Array: ", imageInfoArray);
          }
          let flickrLink = data.photo.urls.url[0]._content;
          let newFig = document.createElement("figure");
          let wrapLink = document.createElement("a");
          wrapLink.href = flickrLink;
          wrapLink.target = "_blank";
          let newImg = document.createElement("img");
          serverID = data.photo.server;
          secret = data.photo.secret;
          photoID = data.photo.id;

          imageJPG = `https://live.staticflickr.com/${serverID}/${photoID}_${secret}_w.jpg`;
          newImg.src = imageJPG;
          let newCaption = document.createElement("figcaption");
          let authorLink = document.createElement("a");

          wrapLink.appendChild(newImg);
          newFig.appendChild(wrapLink);
          (gallery as HTMLElement).appendChild(newFig);

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
        .catch((error) =>
          console.log("Error fetching and parsing data.", error)
        );
      // console.log("image info array: ", imageInfoArray);
    }
  }

  return (
    <div className="App" style={{ width: "100vw", overflowX: "hidden" }}>
      <Search
        api_key={api_key}
        createImageBox={createImageBox}
        getSearchResults={getSearchResults}
        changeFilm={changeFilm}
        changeCamera={changeCamera}
        changeKeywords={changeKeywords}
        cameraStr={cameraStr}
        film={film}
        keywords={keywords}
      />

      {/* <img src={imageInfoArray[0].image.url.urls[0]._content} alt="" /> */}
      <div id="gallery">
        <>
          {imageObjectArray.map((image: any) => {
            return <p>{image.id}</p>;
          })}
        </>
        <figure>
          <a
            href="https://www.flickr.com/photos/dariusphoto/50994619601/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://live.staticflickr.com/65535/50994619601_9241b4cd3f_w.jpg"
              alt=""
            />
          </a>
          <figcaption>
            <a
              href="https://www.flickr.com/photos/157470044@N07/"
              target="_blank"
              rel="noreferrer"
            >
              Film Stock: Portra 400 | Camera: | by Darius Baczynski
            </a>
          </figcaption>
        </figure>
        <figure>
          <a
            href="https://www.flickr.com/photos/dariusphoto/50994619601/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="" alt="" />
          </a>
          <figcaption>
            <a
              href="https://www.flickr.com/photos/157470044@N07/"
              target="_blank"
              rel="noreferrer"
            >
              Film Stock: Portra 400 | Camera: | by Darius Baczynski
            </a>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export default App;
