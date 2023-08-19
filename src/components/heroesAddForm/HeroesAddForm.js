import { useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import store from "../../store";

import { selectAll } from "../heroesFilters/FiltersSlice";
import { useCreateHeroMutation } from "../../api/apiSlice";
import Spinner from "../spinner/Spinner";

const HeroesAddForm = () => {
  const [heroName, setHeroName] = useState("");
  const [heroDescr, setHeroDescr] = useState("");
  const [heroElement, setHeroElement] = useState("");

  // createHero - викликає мутацію
  // в другом аргументі- це об'єкт з станами запиту
  const [createHero, { isLoading }] = useCreateHeroMutation();

  const { filtersLoadingStatus } = useSelector((state) => state.filters);
  const filters = selectAll(store.getState());

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const newHero = {
      id: uuidv4(),
      name: heroName,
      description: heroDescr,
      element: heroElement,
    };

    createHero(newHero).unwrap();

    setHeroName("");
    setHeroDescr("");
    setHeroElement("");
  };

  const renderFilters = (filters, status) => {
    if (status === "loading") {
      return <option>Loading Items</option>;
    } else if (status === "error") {
      return <option>Loading error</option>;
    }

    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        // eslint-disable-next-line
        if (name === "all") return;

        return (
          <option key={name} value={name}>
            {label}
          </option>
        );
      });
    }
  };

  return (
    <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Name of the new hero
        </label>
        <input
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="What is my name?"
          value={heroName}
          onChange={(e) => setHeroName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Description
        </label>
        <textarea
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="What can I do?"
          style={{ height: "130px" }}
          value={heroDescr}
          onChange={(e) => setHeroDescr(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Select hero element
        </label>
        <select
          required
          className="form-select"
          id="element"
          name="element"
          value={heroElement}
          onChange={(e) => setHeroElement(e.target.value)}
        >
          <option value="">I own the element...</option>
          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isLoading ? true : false}
      >
        {isLoading ? <Spinner mark={"addForm"} /> : "Create"}
      </button>
    </form>
  );
};

export default HeroesAddForm;
