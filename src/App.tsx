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

  const api_key = "e094e7d812d749a0545718fa9e86b735";
  const infoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.getinfo&api_key=${api_key}&`;
  let photoID: string = "";
  let imageJPG: string;
  let filmStockTerm: string;
  let cameraTerm: string;
  let gallery = document.getElementById("gallery");
  let infoURL = `${infoBaseURL}photo_id=${photoID}`;

  const createImageBox = function createImageBox() {
    fetch(infoURL)
      .then((response) => response.json())
      .then((data) => {
        let flickrLink = data.photo.urls.url[0]._content;

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
          authorLink.textContent = `${filmStockTerm} | ${cameraTerm} | by ${authorName}`;
        } else {
          authorLink.textContent = `${filmStockTerm} | ${cameraTerm} | by ${username}`;
        }
      })
      .catch((error) => console.log("Error fetching and parsing data.", error));
  };
  createImageBox();

  return (
    <div className="App">
      <Search api_key={api_key} />
      <div>{`infoURL: ${infoURL}`}</div>
      <Gallery test={api_key} />
    </div>
  );
}

export default App;
