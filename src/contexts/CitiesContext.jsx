import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const url = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [currentCity, setCurrentCity] = useState({});
  // const [isLoading, setIsloading] = useState(false);

  const intialstate = {
    cities: [],
    currentCity: {},
    isLoading: false,
    error: "",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "loading":
        return { ...state, isLoading: true };
      case "cities/loaded":
        return { ...state, cities: action.payload, isLoading: false };
      case "city/created/loaded":
        return {
          ...state,
          cities: [...state.cities, action.payload],
          isLoading: false,
          currentCity: action.payload,
        };
      case "city/loaded":
        return { ...state, isLoading: false, currentCity: action.payload };

      case "city/delete":
        return {
          ...state,
          cities: state.cities.filter((city) => city.id !== action.payload),
          isLoading: false,
          currentCity: {},
        };

      case "rejected":
        return { ...state, isLoading: false, error: action.payload };

      default:
        throw new Error("Unknown action");
    }
  }

  const [{ cities, currentCity, isLoading }, dispatch] = useReducer(
    reducer,
    intialstate
  );
  useEffect(function () {
    async function Fetch() {
      dispatch({ type: "loading" });
      try {
        // setIsloading(true);

        const req = await fetch(`${url}/cities`);
        if (!req.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await req.json();
        console.log(data);
        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: "Problem with fetching data" });
      }
    }

    Fetch();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        // setIsloading(true);

        const req = await fetch(`${url}/cities/${id}`);
        if (!req.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await req.json();
        console.log(data);
        // setCurrentCity(data);
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "Problem with fetching city data:",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      // setIsloading(true);

      const req = await fetch(`${url}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!req.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await req.json();

      // setCities((city) => [...city, data]);
      dispatch({ type: "city/created/loaded", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Problem with creating city",
      });
    }
  }
  async function DeleteCity(id) {
    dispatch({ type: "loading" });
    try {
      // setIsloading(true);

      const req = await fetch(`${url}/cities/${id}`, {
        method: "DELETE",
      });
      if (!req.ok) {
        throw new Error("Network response was not ok");
      }

      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({
        type: "city/delete",
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Problem with deleting city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        DeleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("this Context used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
