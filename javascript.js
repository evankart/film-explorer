// API Explorer: https://www.flickr.com/services/api/explore/flickr.photos.search

// Example Request: https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value

// https://www.flickr.com/services/rest/?method=GET&api_key=e094e7d812d749a0545718fa9e86b735&tags=portra400

// https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=e094e7d812d749a0545718fa9e86b735&tags=portra400

// Example image URL: https://flickr.com/photos/156018067@N06/52421787156
// Owner: 156018067@N06
// Photo ID: 52421787156

// # Example
// #   server-id: 7372
// #   photo-id: 12502775644
// #   secret: acfd415fa7
// #   size: w
// #

// https://live.staticflickr.com/7372/12502775644_acfd415fa7_w.jpg

const api_key = "e094e7d812d749a0545718fa9e86b735";
const baseURL =
  "https://www.flickr.com/services/rest/?method=flickr.photos.search";
const amp = "&";
const tagURL = "tags=";
const apiURL = `api_key=${api_key}`;
const JSON = "&format=json&nojsoncallback=1&per_page=500%safe_search=1";
const searchBox = document.getElementById("searchBox");
const flickrImg = document.getElementById("flickrImg");

let searchTerm = searchBox.value;
let fullURL;
let gallery = document.getElementById("gallery");

searchBtn = document.querySelector(".searchBtn");

searchBtn.addEventListener("click", createURL);

searchBtn.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    document.getElementById("searchBtn").click();
  }
});

function createURL() {
  //   console.log(api_key, baseURL, apiURL, searchTerm);
  searchTerm = searchBox.value;
  console.log(searchTerm);
  console.log(fullURL);
  gallery.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    let page = `page=${Math.floor(Math.random() * 100)}`;
    fullURL =
      baseURL + amp + apiURL + JSON + amp + tagURL + searchTerm + amp + page;
    fetch(fullURL)
      .then((response) => response.json())
      .then((data) => {
        let object =
          data.photos.photo[
            Math.floor(Math.random() * data.photos.photo.length)
          ];
        console.log(data.photos);
        let serverID = object.server;
        let photoID = object.id;
        let secret = object.secret;
        let imgUrl = `https://live.staticflickr.com/${serverID}/${photoID}_${secret}.jpg`;
        console.log(imgUrl);
        let newImg = document.createElement("img");
        newImg.src = imgUrl;
        gallery.appendChild(newImg);
        // flickrImg.src = imgUrl;
        // #   secret: acfd415fa7
        // #   size: w
      });
  }
}

createURL();

// #TO DO: Figure out how to pase JSON response

// #TO DO: Once JSON response is parsed, use the owner and photo ID to get the image URL and load it into the .flickrImg div
