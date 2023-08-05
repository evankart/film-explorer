import { useEffect, useState } from "react";
interface SearchProps {
  createImageBox: Function;
  getSearchResults: Function;
  changeFilm: Function;
  changeCamera: Function;
  changeKeywords: Function;
  cameraStr: string;
  film: string;
  keywords: string;
}

/* API INSTRUCTIONS
* API Explorer: https://www.flickr.com/services/api/explore/flickr.photos.search
* Example Request: https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value
* https://www.flickr.com/services/rest/?method=GET&api_key=e094e7d812d749a0545718fa9e86b735&tags=portra400
* https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=e094e7d812d749a0545718fa9e86b735&tags=portra400

* Example image URL: https://flickr.com/photos/156018067@N06/52421787156
* Owner: 156018067@N06
* Photo ID: 52421787156

* # Example info URL: https://live.staticflickr.com/7372/12502775644_acfd415fa7_w.jpg
* #   server-id: 7372
* #   photo-id: 12502775644
* #   secret: acfd415fa7
* #   size: w
*/

export default function Search(props: SearchProps) {
  const [keywords, setKeywords] = useState("");
  let page = 1;
  const photoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&`;

  // const focalLength = document.getElementById("focalLength");
  // const flickrImg = document.getElementById("flickrImg");

  const [searchURL, setSearchURL] = useState(
    `${photoBaseURL}tags=Portra400,&${page}`
  );

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      console.log("pressed enter");
      props.changeKeywords(keywords);
      search();
    }
  };

  useEffect(() => {
    let newURL: string = "";

    if (props.film === "" && props.cameraStr === "") {
      newURL = `${photoBaseURL}tags=${props.keywords},35mm`;
    } else {
      newURL = `${photoBaseURL}tags=${props.keywords},${props.film.replace(
        /\s/g,
        ""
      )},${props.cameraStr.replace(/\s/g, "")},&${page}`;
    }
    setSearchURL(newURL);
  }, [
    props.film,
    props.cameraStr,
    props.keywords,
    page,
    photoBaseURL,
    searchURL,
  ]);

  // why state doesn't update immediately (add a useEffect hook)
  // https://blog.logrocket.com/why-react-doesnt-update-state-immediately/#:~:text=State%20updates%20in%20React%20are,components%20in%20a%20single%20pass.
  useEffect(() => {
    search();
  }, [searchURL]);

  // const updateSearchURL = () => {
  //   // if (props.keywords === "" && props.film === "") {
  //   //   newURL = `${photoBaseURL}tags=dogs`;
  //   // } else {
  //   //   newURL = `${photoBaseURL}tags=${props.keywords},${props.film.replace(
  //   //     /\s/g,
  //   //     ""
  //   //   )},${props.cameraStr.replace(/\s/g, "")},&${page}`;
  //   // }
  //   // setSearchURL(newURL);
  // };

  useEffect(() => {
    console.log(keywords);
  }, [keywords]);

  async function search() {
    // updateSearchURL();

    console.log("Searching...", searchURL);

    await fetch(searchURL)
      .then((response) => response.json())
      .then((response) => props.getSearchResults(response));
  }

  const handleKeywordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setKeywords((e.target as HTMLInputElement).value);
  };

  return (
    <div>
      <div
        id="search"
        className="w-full  flex flex-col sm:flex-row items-center sm:justify-around sm:mb-3"
      >
        <div className="flex flex-col w-[50vw] sm:w-[30vw] ">
          <label className="mx-auto" htmlFor="filmStock">
            Film Stock
          </label>
          <select
            className="flex flex-col"
            name="filmStock"
            id="filmStock"
            defaultValue={"Portra400"}
            onChange={(e) => {
              props.changeFilm(e);
              // if (props.film === "" && props.cameraStr === "") {
              //   newURL = `${photoBaseURL}tags=dogs`;
              // } else {
              //   newURL = `${photoBaseURL}tags=${
              //     props.keywords
              //   },${props.film.replace(/\s/g, "")},${props.cameraStr.replace(
              //     /\s/g,
              //     ""
              //   )},&${page}`;
              // }
              // setSearchURL(newURL);
              // console.log(newURL, searchURL);
              // search();
            }}
          >
            <option value="Portra400" disabled hidden>
              Portra 400
            </option>
            <option value="">Any</option>
            <optgroup label="Color Film" className="font-bold"></optgroup>
            <option value="Portra 400">Portra 400</option>
            <option value="Kodak Gold">Kodak Gold</option>
            <option value="Color Plus">Color Plus</option>
            <option value="Ektar">Ektar</option>
            <option value="Cinestill 800T">Cinestill 800T</option>
            <option value="Fuji Superia">Fuji Superia</option>
            <optgroup
              label="Black and White Film"
              className="font-bold"
            ></optgroup>
            <option value="Ilford HP5">Ilford HP5</option>
            <option value="Ilford Delta">Ilford Delta</option>
            <option value="Ilford XP2">Ilford XP2</option>
            <option value="TMax 400">T-Max 400</option>
            <option value="TriXPan">Tri-X Pan 400</option>
            <option value="Acros 100">Acros 100</option>
            <option value="Fomapan 100">Fomapan 100</option>
          </select>
        </div>

        <br />

        <div className="flex flex-col w-[50vw]  sm:w-[30vw]">
          <label htmlFor="camera" className="mx-auto">
            Camera
          </label>
          <select
            name="camera"
            id="camera"
            defaultValue={""}
            onChange={(e) => props.changeCamera(e)}
          >
            <option value="" className="font-bold">
              Any
            </option>
            <option value="Canon A-1">Canon A-1</option>
            <option value="Olympus Stylus">Olympus Stylus</option>
            <option value="Mamiya RZ67">Mamiya RZ67</option>
            <option value="Polaroid">Polaroid</option>
            <option value="Holga 120">Holga</option>
          </select>
        </div>
        <br />

        <div className="flex flex-col w-[50vw]  sm:w-[30vw]">
          <label htmlFor="searchBox" className="mx-auto">
            Keywords
          </label>
          <input
            type="text"
            id="searchBox"
            placeholder="e.g. 'cats'"
            onChange={(e) => handleKeywordChange(e)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </div>

        <br />
      </div>
      <div className="flex justify-between w-[100px] mx-auto items-center">
        <button
          className="w-8 h-5 flex flex-col justify-center px-2 mr-2"
          onClick={search}
        >{`<`}</button>
        <p className="flex flex-col justify-center">More</p>
        <button
          className="w-8 h-5 flex flex-col justify-center px-2 ml-2"
          onClick={search}
        >{`>`}</button>
      </div>
    </div>
  );
}
