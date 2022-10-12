// API Explorer: https://www.flickr.com/services/api/explore/flickr.photos.search

// Example Request: https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value

// https://www.flickr.com/services/rest/?method=GET&api_key=e094e7d812d749a0545718fa9e86b735&tags=portra400

// https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=e094e7d812d749a0545718fa9e86b735&tags=portra400

// Example image URL: https://flickr.com/photos/156018067@N06/52421787156
// Owner: 156018067@N06
// Photo ID: 52421787156

// <?xml version="1.0" encoding="utf-8" ?>
// <rsp stat="ok">
//   <photos page="1" pages="1576" perpage="100" total="157578">
//     <photo id="52421787156" owner="156018067@N06" secret="3948902d0e" server="65535" farm="66" title="Brandon" ispublic="1" isfriend="0" isfamily="0" />
//    </photos>
// </rsp>

const api_key = "e094e7d812d749a0545718fa9e86b735";
const baseURL =
  "https://www.flickr.com/services/rest/?method=flickr.photos.search";
const amp = "&";
const tagURL = "tags=";
const apiURL = `api_key=${api_key}`;
const JSON = "&format=json";
const searchBox = document.getElementById("searchBox");

let searchTerm = searchBox.value;
let fullURL;

searchBtn = document.querySelector(".searchBtn");

searchBtn.addEventListener("click", createURL);

function createURL() {
  //   console.log(api_key, baseURL, apiURL, searchTerm);
  searchTerm = searchBox.value;
  console.log(searchTerm);
  fullURL = baseURL + amp + apiURL + JSON + amp + tagURL + searchTerm;
  console.log(fullURL);

  fetch(fullURL)
    .then((response) => response)
    .then((out) => {
      console.log("Checkout this JSON! ", out);
    });
}

createURL();

// #TO DO: Figure out how to pase JSON response

// #TO DO: Once JSON response is parsed, use the owner and photo ID to get the image URL and load it into the .flickrImg div
