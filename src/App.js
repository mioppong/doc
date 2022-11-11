import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import "./App.css";

function App() {
  const [allData, setAllData] = useState(null);

  const getAllData = async () => {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
    );

    // for each of the pokemon in the response, get the details
    const allPokemon = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const pokemonDetails = await axios.get(pokemon.url);
        return pokemonDetails.data;
      })
    );

    // format the data for the table
    const formattedData = allPokemon.map((pokemon) => {
      return {
        name: pokemon.name,
        types: pokemon.types
          .map((type) => type.type.name)
          .join(", ")
          .split(","),
        image: pokemon.sprites.front_default,
      };
    });

    setAllData(formattedData);
  };

  useEffect(() => {
    getAllData();
  }, []);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) => (
        <div className="app_nameRow">{row.name.toUpperCase()}</div>
      ),
    },
    {
      name: "Types",
      cell: (row) => (
        <div style={{ display: "flex" }}>
          {row.types.map((type) => {
            return <div className="app_typesRow">{type}</div>;
          })}
        </div>
      ),
    },
    {
      name: "Image",
      cell: (row) => <img src={row.image} alt={row.name} />,
    },
  ];

  return (
    <div className="App">
      {allData && (
        <div style={{ fontSize: 20, fontWeight: "bold" }}>
          {" "}
          {"Pokemon".toLocaleUpperCase()}
        </div>
      )}

      <div className="app_tableContainer">
        {!allData && <div>Loading...</div>}
        {allData && <DataTable columns={columns} data={allData} />}
      </div>
    </div>
  );
}

export default App;
