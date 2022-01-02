import React from "react";
import { useDispatch, useSelector } from "react-redux";

import "./unit-card.scss";

const workersReducer = {
  "Dwarf Villager": "UPDATE_VILLAGER",
  "Dwarf Miner": "UPDATE_MINER",
  "Dwarf Warrior": "UPDATE_WARRIOR",
  "Dwarf Mage": "UPDATE_MAGE",
  "Dwarf Lady": "UPDATE_LADY",
  "Dwarf King": "UPDATE_KING",
};

export const UnitCard = ({ info, amount }) => {
  const { workersSelected } = useSelector((state) => state.workers);
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    if (workersSelected[name.replace("Dwarf ", "").toLowerCase()] === value) {
      value = 0
    }
    dispatch({
      type: workersReducer[name],
      payload: value,
    });
  };
  const { name, attack, defense, loot, img } = info;
  return (
    <div className="col-2 troop-card">
      <div className="row p-2">
        <div className="col-5">
          <img src={img} alt="dwarf-common" />
        </div>
        <div className="col-7">
          <table className="unit-table" width="100%">
            <tbody>
              <tr>
                <th colSpan="3">{name}</th>
              </tr>
              <tr>
                <td align="left">Attack</td>
                <td>
                  <span className="unit_attack">{attack}</span>
                </td>
              </tr>
              <tr>
                <td align="left">Defense</td>
                <td>
                  <span className="unit_defense">{defense}</span>
                </td>
              </tr>
              <tr>
                <td align="left">Loot</td>
                <td>
                  <span className="unit_defense">{loot}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col p-2 text-center">
              <input
                type="text"
                className="form-control"
                onChange={(e) => handleChange(name, e.target.value)}
                value={workersSelected[name.replace("Dwarf ", "").toLowerCase()]}
              />
            </div>
          </div>
          <div className="row">
            <div className="col text-center mb-2">
              <a
                href="/#"
                className=""
                onClick={() => handleChange(name, amount)}
              >
                ({amount})
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
