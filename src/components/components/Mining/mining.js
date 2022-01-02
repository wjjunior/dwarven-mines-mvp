import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { UnitCard } from "../UnitCard/unit-card";
import { MineCard } from "../MineCard/mine-card";

import { generateRandomFloatInRange } from "../../../utils/functions"

import "./mining.scss";

const MINES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  EXTREME: "extreme",
};

export const Mining = () => {
  const data = useSelector((state) => state.workers);
  const { playerManaStone, popCap, workersAvailable, workersMining, mining } = data;

  const { villager, miner, warrior, mage, lady, king } = workersAvailable

  const dispatch = useDispatch();

  const workersDraw = (amount) => {
    if (amount > popCap) {
      alert("🦄 Not enought population!");
      return false;
    }
    const manaLeak = amount * 200;
    if (manaLeak > playerManaStone) {
      alert("🦄 Not enought Mana Stones!");
      return false;
    }

    let workersData = {
      villager,
      miner,
      warrior,
      mage,
      lady,
      king,
    };

    for (let i = 0; i < amount; i++) {
      const value = parseFloat(generateRandomFloatInRange(0, 100).toFixed(2));

      if (value <= 0.04) {
        ++workersData.king;
      } else if (value <= 0.52) {
        ++workersData.lady;
      } else if (value <= 1.04) {
        ++workersData.mage;
      } else if (value <= 5.18) {
        ++workersData.warrior;
      } else if (value <= 10.36) {
        ++workersData.miner;
      } else {
        ++workersData.villager;
      }
    }

    dispatch({
        type: "UPDATE_WORKERS_AVAILABLE",
        payload: workersData,
      });

    dispatch({
      type: "UPDATE_PLAYER_MANA_STONE",
      payload: playerManaStone - manaLeak,
    });

    dispatch({
      type: "UPDATE_POP_CAP",
      payload: popCap - amount,
    });
  };

  const handleSpeedClaim = () => {
    let newMining = JSON.parse(JSON.stringify(mining));
    const units = Object.keys(workersMining)

    units.forEach((unit) => {
        newMining[unit].status = false
    })
    dispatch({
        type: "UPDATE_MINING",
        payload: newMining
    })
  }

  return (
    <div className="mt-5">
      <div className="row">
        <div className="col text-center mb-2">
          <div className="row player">
            <div className="col-2 text-start">
              <img src="./img/crystal.png" alt="crystal" className="crystal" />
              <span className="mana-stone-span">{(parseFloat(playerManaStone)).toFixed(2)}</span>
            </div>
            <div className="col-8"></div>
            <div className="col-2">
              <span className="pop-span">{popCap}</span>
              <img
                src="./img/dwarf-icon.png"
                alt="crystal"
                className="crystal"
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <img src="./img/chest.png" alt="chest" className="chest" />
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center">
            <button
                className="btn btn-danger btn-block mx-2 btn-speed"
                onClick={() => handleSpeedClaim()}
              >
                <img
                  src="./img/speed.png"
                  alt="speed"
                />
                Speed Claim (dev)
              </button>
              <button
                className="btn btn-primary btn-block mx-2 btn-draw"
                onClick={() => workersDraw(1)}
              >
                <img
                  src="./img/crystal.png"
                  alt="crystal"
                  className="crystal"
                />
                1x - 200
              </button>
              <button
                className="btn btn-primary btn-block mx-2 btn-draw"
                onClick={() => workersDraw(5)}
              >
                <img
                  src="./img/crystal.png"
                  alt="crystal"
                  className="crystal"
                />
                5x - 1000
              </button>
              <button
                className="btn btn-primary btn-block mx-2 btn-draw"
                onClick={() => workersDraw(10)}
              >
                <img
                  src="./img/crystal.png"
                  alt="crystal"
                  className="crystal"
                />
                10x - 2000
              </button>
              <button
                className="btn btn-warning btn-block mx-2 btn-config"
                onClick={() => alert('Under development!')}
              >
                <img
                  src="./img/config.png"
                  alt="config"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row troops">
        <UnitCard
          info={{
            name: "Dwarf Villager",
            attack: 10,
            defense: 12,
            loot: "10 - 15",
            img: "./img/units/dwarf-common.jpeg",
          }}
          amount={villager}
        />
        <UnitCard
          info={{
            name: "Dwarf Miner",
            attack: 25,
            defense: 50,
            loot: "10 - 25",
            img: "./img/units/dwarf-rare.jpeg",
          }}
          amount={miner}
        />
        <UnitCard
          info={{
            name: "Dwarf Warrior",
            attack: 40,
            defense: 10,
            loot: "20 - 40",
            img: "./img/units/dwarf-srare.jpeg",
          }}
          amount={warrior}
        />
        <UnitCard
          info={{
            name: "Dwarf Mage",
            attack: 130,
            defense: 30,
            loot: "35 - 65",
            img: "./img/units/dwarf-epic.jpeg",
          }}
          amount={mage}
        />
        <UnitCard
          info={{
            name: "Dwarf Lady",
            attack: 15,
            defense: 20,
            loot: "50 - 80",
            img: "./img/units/dwarf-legend.jpeg",
          }}
          amount={lady}
        />
        <UnitCard
          info={{
            name: "Dwarf King",
            attack: 150,
            defense: 200,
            loot: "80 - 150",
            img: "./img/units/dwarf-slegend.jpeg",
          }}
          amount={king}
        />
      </div>
      <div className="card-deck mb-3 text-center mt-5" id="mining_screen">
        <MineCard name={MINES.SMALL} />
        <MineCard name={MINES.MEDIUM} />
        <MineCard name={MINES.LARGE} />
        <MineCard name={MINES.EXTREME} />
      </div>
    </div>
  );
};
