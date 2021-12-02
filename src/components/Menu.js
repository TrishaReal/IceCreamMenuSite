import React, { useState } from "react";
import Gelato from "./Gelato";
import axios from "axios";
import data from "../fakeData";

const url = "https://react-corso-api.netlify.app/.netlify/functions/gelateria";

const Menu = () => {
  //Vado a sostituire i dati che ottengo dal mio arrey di oggetti in locale con i dati che ci arrivano dalla nostra API.
  //Eseguo un refactoring:
  const [isLoading, setIsLoading] = useState(true); //Loading State for data fetching.
  const [isError, setIsError] = useState(false); //Error Handing State
  const [prodotti, setProdotti] = React.useState(data); //Tutti i prodotti

  //Andiamo a lavorare effettivamente sul filtraggio dei nostri prodotti.
  //La prima cosa di cui abbiamo bisogno è dare all'utente visivamente un metodo per riconoscere quello che è la sezione attiva.
  //Definisco quindi uno 'state selected':
  const [selected, setSelected] = useState(0); //Active BTN Selector

  //Ora ci serve andare a costruire una funzione per filtrare i nostri prodotti utilizzando uno 'state':
  const [filterProducts, setFilterProducts] = useState(prodotti); //Prodotti filtrati dallo 'State di Prodotti'.

  //Definisco un state che descriva e che contenga le categorie:
  const [categorie, setCategorie] = useState([]);

  //Utilizzo 'Array.from' mescolato all'utilizzo e alla creazione di un 'set': è un array , un'insieme di elementi unici che non sono ripetibili.
  // const categorie = Array.from(new Set(prodotti.map((el) => el.categoria)));

  //Manca il valore, la categoria 'All' e quindi lo aggiungo:
  // categorie.unshift("all");

  const filtraProdotti = (categoria, index) => {
    setSelected(index);
    if (categoria === "all") {
      setFilterProducts(prodotti);
    } else {
      setFilterProducts(
        prodotti.filter((el) => (el.categoria === categoria ? el : "")) //stringa vuota "" uguale falsie
      );
    }
  };

  //Fetchare i dati:
  React.useEffect(() => {
    //Un'altro metodo molto come di data fetching è quello di dichiarare un ifi, ovvero una funzione
    //che non appena viene definita viene subito poi eseguita:
    (async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(url);

        setProdotti(response.data.data.default);
        setFilterProducts(response.data.data.default);

        //Categorie Array
        const nuoveCategorie = Array.from(
          new Set(response.data.data.default.map((el) => el.categoria))
        );
        nuoveCategorie.unshift("all");

        setCategorie(nuoveCategorie);
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsError(true);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h4 style={{ textAlign: "center", textTransform: "uppercase" }}>
        Le vostre scelte
      </h4>
      {!isLoading && !isError ? (
        <>
          <div className="lista-categorie">
            {categorie.map((categoria, index) => {
              return (
                <button
                  key={index}
                  onClick={() => filtraProdotti(categoria, index)}
                  className={`btn btn-selector ${
                    index === selected && "active"
                  }`}
                >
                  {categoria}
                </button>
              );
            })}
          </div>
          {/* Ora faccio un render dei prodotti */}
          <div className="vetrina">
            {filterProducts.map((el) => (
              <Gelato key={el.id} {...el} />
            ))}
          </div>
        </>
      ) : !isLoading && isError ? (
        <h4
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate (-50%, -50%)",
          }}
        >
          Error...
        </h4>
      ) : (
        <h4
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate (-50%, -50%)",
          }}
        >
          Loading...
        </h4>
      )}
    </div>
  );
};

export default Menu;
