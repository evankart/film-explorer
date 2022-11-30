"use strict";
// #TO DO: Clean up code and annotate

// #TO DO: Update styling for single column on mobile and various grid sizes on larger screens

// #TO DO: Object/class based mewthod of adding image results to the page

/*
 * #TO DO: Create Dropdown input to select specific film stocks
 * -Dropdowns:
 *   --Film Stock
 *   --ISO
 *   --Camera
 *   --Lens
 * -Text Input:
 *   --tags
 */

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

class Image {
  constructor(imgURL, flickrURL, title, tags) {
    this.imgURL = imgURL;
    this.flickrURL = flickrURL;
    this.title = title;
    this.tags = tags;
  }
}

const img1 = new Image(
  "https://live.staticflickr.com/7372/12502775644_acfd415fa7_w.jpg",
  "https://flickr.com/",
  "Sample Image",
  "Sample Tags"
);

console.log("img1", img1);

const api_key = "e094e7d812d749a0545718fa9e86b735";
const baseURL = "https://www.flickr.com/services/rest/?method=";
const methodPhotoSearch = "flickr.photos.search";
const methodGetInfo = "flickr.photos.getinfo";
const amp = "&";
const tagURL = "tags=";
const apiURL = ``;
const JSON =
  "&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&";
const searchBox = document.getElementById("searchBox");
const filmStock = document.getElementById("filmStock");
const camera = document.getElementById("camera");
const focalLength = document.getElementById("focalLength");
const flickrImg = document.getElementById("flickrImg");

let fullURL;
let gallery = document.getElementById("gallery");

const searchBtn = document.querySelector(".searchBtn");

searchBtn.addEventListener("click", createURL);

searchBtn.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    document.getElementById("searchBtn").click();
  }
});

async function createURL() {
  //   console.log(api_key, baseURL, apiURL, searchTerm);
  let searchTerm = searchBox.value.trim();
  let cameraTerm = camera.value.trim();
  let filmStockTerm = filmStock.value.trim();
  gallery.innerHTML = "";
  let URLlist = [];
  // let page = `page=${Math.floor(Math.random() * 3) + 1}`;
  let page = 1;
  fullURL = `${baseURL}${methodPhotoSearch}&api_key=${api_key}${JSON}&${tagURL}${searchTerm},${filmStockTerm},${cameraTerm},&${page}`;
  console.log(fullURL);
  const response = await fetch(fullURL)
    .then((response) => response.json())
    .then((data) => data);
  for (let i = 0; i < 15; i++) {
    let object = data.photos.photo[randomIndex];
    console.log("OBJECT: ", object);
    let serverID = object.server;
    let photoID = object.id;
    let secret = object.secret;
    let imgUrl = `https://live.staticflickr.com/${serverID}/${photoID}_${secret}.jpg`;
    while (URLlist.includes(imgUrl)) {
      randomIndex = Math.floor(Math.random() * data.photos.photo.length);
    }
    URLlist.push(randomIndex); // track which images have been added

    // console.log(imgUrl);
    let newFig = document.createElement("figure");
    let newCaption = document.createElement("figcaption");
    let newLink = document.createElement("a");

    let newImg = document.createElement("img");
    newFig.appendChild(newImg);
    newFig.appendChild(newCaption);
    newCaption.appendChild(newLink);
    newImg.src = imgUrl;
    gallery.appendChild(newFig);
    let infoURL = `${baseURL}${methodGetInfo}&api_key=${api_key}${JSON}&photo_id=${photoID}`;
    fetch(infoURL)
      .then((response) => response.json())
      .then((data) => {
        let fullLink = data.photo.urls.url[0]._content;
        let authorName = data.photo.owner.realname;
        let username = data.photo.owner.username;
        console.log(fullLink);
        newLink.href = fullLink;
        newLink.target = "_blank";
        if (authorName !== "") {
          newLink.textContent = `${authorName}`;
        } else {
          newLink.textContent = `${username}`;
        }
        console.log("author name:", authorName, data);
      })
      .catch((error) => console.log("Error fetching and parsing data.", error));
  }
}

createURL();
