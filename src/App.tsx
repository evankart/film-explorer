import { useState, useEffect, useMemo } from "react";
import "./App.css";
import Search from "./components/Search";

function App() {
  const [film, setFilm] = useState("Portra 400");
  const [cameraStr, setCameraStr] = useState("");
  const [keywords, setKeywords] = useState("");

  let imageObjectArray: any[] = [];
  const [infoArrayState, setInfoArrayState] = useState<any>([]);
  let imageInfoArray: any[] = [];
  let [resultsAlert, setResultsAlert] = useState("");

  const RESULTS_LENGTH = 15; // Max number of images displayed in results
  const infoBaseURL = `https://www.flickr.com/services/rest/?method=flickr.photos.getinfo&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&format=json&nojsoncallback=1&per_page=500&safe_search=1&sort=interestingness-desc&tag_mode=all&`;
  let imgObject: any;
  let randomIndex: number;
  let URLlist: any[] = [];
  const [resultsSize, setResultsSize] = useState(100);

  const changeFilm = (e: React.FormEvent<HTMLInputElement>) => {
    let newFilm = (e.target as HTMLSelectElement).value;
    setFilm(newFilm);
    console.log("new film: ", newFilm);
    console.log("film: ", film);
  };

  const changeCamera = (e: React.FormEvent<HTMLInputElement>) => {
    setCameraStr((e.target as HTMLSelectElement).value);
  };

  const changeKeywords = (keywords: string) => {
    setKeywords(keywords);
    console.log(keywords);
  };

  useEffect(() => {
    // console.log("film changed: ", film);
    // console.log("camera changed: ", cameraStr);
    // console.log("infoArrayState changed: ", infoArrayState);
    // setInfoArrayState(infoArrayState);
  }, [film, cameraStr, infoArrayState]);

  async function getSearchResults(data: any) {
    setInfoArrayState(imageInfoArray);
    let newResultsSize = data.photos.total;
    setResultsSize(newResultsSize);
    if (data.photos.total != 0 && data.photos.total > 15) {
      setResultsAlert("");
      // console.log("JSON Response: ", data);
      console.log("# PHOTOS RETURNED: ", resultsSize);

      while (imageObjectArray.length < RESULTS_LENGTH) {
        randomIndex = Math.floor(Math.random() * data.photos.photo.length) + 1;
        imgObject = data.photos.photo[randomIndex - 1];

        // Keep randomizing results until you get a new image. Break after 100 tries
        while (URLlist.includes(randomIndex.toString())) {
          randomIndex =
            Math.floor(Math.random() * data.photos.photo.length) + 1;
        }
        URLlist.push(randomIndex.toString()); // track which images have been added

        imageObjectArray.push(imgObject);
        if (imageObjectArray.length === RESULTS_LENGTH) {
          imageObjectArray.forEach((image) => {
            createImageBox(image);
          });
        }
      }
    } else if (data.photos.total == 0) {
      setResultsAlert(`Sorry, no results!`);
      setInfoArrayState([]);
    } else if (data.photos.total <= 15) {
      setResultsAlert(`Only ${resultsSize} results!`);
    }
  }

  async function createImageBox(image: any) {
    let infoURL = `${infoBaseURL}photo_id=${image.id}`;

    if (imageInfoArray.length < RESULTS_LENGTH - 1) {
      await fetch(infoURL)
        .then((response) => response.json())
        .then((data) => {
          imageInfoArray.push(data.photo);
          setInfoArrayState([...imageInfoArray]);

          if (imageInfoArray.length === RESULTS_LENGTH - 1) {
            console.log("Image Info Array: ", imageInfoArray);
          }
          //
        })
        .catch((error) =>
          console.log("Error fetching and parsing data.", error)
        );
    }
  }

  return (
    <div
      className="App bg-[#f8f8f8]"
      style={{ width: "100vw", overflowX: "hidden" }}
    >
      <Search
        createImageBox={createImageBox}
        getSearchResults={getSearchResults}
        changeFilm={changeFilm}
        changeCamera={changeCamera}
        changeKeywords={changeKeywords}
        cameraStr={cameraStr}
        film={film}
        keywords={keywords}
      />
      <p>{resultsAlert}</p>
      <div id="gallery" className=" flex flex-wrap flex-col sm:flex-row">
        {infoArrayState.map((info: any, i: number) => {
          return (
            <figure
              className=" mx-auto py-2 w-[90vw] max-w-[500px] mb-3 lg:mb-6"
              key={i}
            >
              <a
                href={info.urls.url[0]._content}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`https://live.staticflickr.com/${info.server}/${info.id}_${info.secret}_w.jpg`}
                  alt={info.description._content}
                  className="aspect-[7/5] shadow-[-1px_2px_10px_rgba(0,0,0,0.2)] hover:scale-[102%] transition-all"
                />
              </a>
              <figcaption className="text-right text-xs sm:text-base">
                {`${film ? `${film} | ` : ""} ${
                  cameraStr ? `${cameraStr} |` : ""
                } `}
                <a
                  href={`https://www.flickr.com/photos/${info.owner.nsid}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold"
                >
                  {`${
                    info.owner.realname
                      ? info.owner.realname
                      : info.owner.username
                  }`}
                </a>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <p className="text-center">{`${resultsSize.toLocaleString(
        undefined
      )} results.`}</p>
    </div>
  );
}

export default App;
