export default function Search() {
  return (
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
  );
}
