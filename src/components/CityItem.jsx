import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

function CityItem({ city }) {
  console.log(city);
  const { currentCity, DeleteCity } = useCities();

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const { cityName, emoji, date, id, position } = city;
  console.log();
  function handleDeleteCity(e) {
    e.preventDefault();
    DeleteCity(id);
  }
  return (
    <li>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button
          onClick={(e) => handleDeleteCity(e)}
          className={styles.deleteBtn}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
