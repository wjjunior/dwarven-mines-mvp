import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Countdown from "react-countdown";

import { ClaimModal } from "../ClaimModal/claim-modal";
import { generateRandomFloatInRange } from "../../../utils/functions";

import "./mine-card.scss";

const MINES = {
  small: {
    price: 1000,
    bonusPop: 10,
    time: 1,
    ratio: 1,
  },
  medium: {
    price: 2500,
    bonusPop: 5,
    time: 1.3,
    ratio: 1.5,
  },
  large: {
    price: 8000,
    bonusPop: 5,
    time: 1.8,
    ratio: 3,
  },
  extreme: {
    price: 15000,
    bonusPop: 10,
    time: 2.1,
    ratio: 6,
  },
};

const MINING_FEE = 10;

export const MineCard = ({ name }) => {
  const [locked, setLocked] = useState(true);
  const [countDown, setCountDown] = useState(0);
  const [canUnlock, setCanUnlock] = useState(true);
  const [modalShow, setModalShow] = React.useState(false);

  const data = useSelector((state) => state.workers);
  const {
    manaStone,
    time,
    playerManaStone,
    popCap,
    mineLevel,
    mining,
    workersSelected,
    workersAvailable,
    workersMining,
  } = data;

  useEffect(() => {
    const minePosition = Object.keys(MINES).indexOf(name);

    if (mineLevel >= minePosition) {
      setCanUnlock(false);
    }
  }, [mineLevel, name]);

  const dispatch = useDispatch();

  const secondsToHms = (d) => {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    h = ("0" + h).slice(-3);

    if (h.length === 3) {
      h = parseInt(h, 10);
    }

    return h + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
  };

  const unlockMine = () => {
    if (MINES[name].price > playerManaStone) {
      alert("🦄 Not enought Mana Stones!");
      return false;
    }

    dispatch({
      type: "UPDATE_PLAYER_MANA_STONE",
      payload: playerManaStone - MINES[name].price,
    });

    dispatch({
      type: "UPDATE_POP_CAP",
      payload: popCap + MINES[name].bonusPop,
    });

    dispatch({
      type: "UPDATE_MINE_LEVEL",
    });

    setLocked(false);
  };

  const Completionist = () => <span>Claim!</span>;

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    let addHours = 0;
    if (days > 0) {
      addHours = days * 24;
    }
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {addHours + hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  const handleMining = () => {
    const totalWorkersSelected = Object.values(workersSelected).reduce(
      (a, b) => a + b,
      0
    );

    if (!totalWorkersSelected) {
      alert("🦄 No units selected!");
      return false;
    }

    const units = Object.keys(workersAvailable);
    let error = false;
    let availableWorkers = {
      villager: 0,
      miner: 0,
      warrior: 0,
      mage: 0,
      lady: 0,
      king: 0,
    };
    let newWorkersMining = {
      [name]: {
        villager: 0,
        miner: 0,
        warrior: 0,
        mage: 0,
        lady: 0,
        king: 0,
      },
    };
    for (let i = 0; i < units.length; i++) {
      if (workersAvailable[units[i]] < workersSelected[units[i]]) {
        error = true;
        break;
      }
      availableWorkers[units[i]] =
        workersAvailable[units[i]] - workersSelected[units[i]];
      newWorkersMining[name][units[i]] = parseInt(
        workersMining[name][units[i]] + workersSelected[units[i]]
      );
    }

    if (error) {
      alert("🦄 Not enought units!");
      return false;
    }

    setCountDown(Date.now() + time * MINES[name].time * 1000);

    dispatch({
      type: "UPDATE_MINING",
      payload: {
        ...mining,
        [name]: {
          status: true,
          availableClaim: generateRandomFloatInRange(
            manaStone.min * MINES[name].ratio,
            manaStone.max * MINES[name].ratio
          ).toFixed(2),
          min: manaStone.min,
          max: manaStone.max,
        },
      },
    });

    dispatch({
      type: "UPDATE_WORKERS_AVAILABLE",
      payload: availableWorkers,
    });

    dispatch({
      type: "RESET_SELECTED_WORKERS",
    });

    dispatch({
      type: "UPDATE_WORKERS_MINING",
      payload: newWorkersMining,
    });

    dispatch({
      type: "UPDATE_PLAYER_MANA_STONE",
      payload: playerManaStone - MINING_FEE,
    });

    dispatch({
      type: "UPDATE_TIME",
      payload: 0,
    });

    dispatch({
      type: "UPDATE_MANA_STONE",
      payload: {
        min: 0,
        max: 0,
      },
    });
  };

  const renderButton = () => {
    if (locked) {
      return (
        <button
          type="button"
          className="btn btn-lg btn-block btn-primary"
          onClick={unlockMine}
          disabled={canUnlock}
        >
          <img src="./img/crystal.png" alt="crystal" className="crystal" />{" "}
          {MINES[name].price}
        </button>
      );
    }

    if (!mining[name].status && mining[name].availableClaim > 0) {
      return (
        <button
          type="button"
          className="btn btn-lg btn-block btn-primary"
          onClick={() => setModalShow(true)}
        >
          <img src="./img/crystal.png" alt="crystal" className="crystal" />{" "}
          Claim!
        </button>
      );
    }

    return (
      <button
        type="button"
        className="btn btn-lg btn-block btn-primary"
        onClick={() => handleMining()}
        disabled={mining[name].status}
      >
        <img src="./img/crystal.png" alt="crystal" className="crystal" />{" "}
        {MINING_FEE}
      </button>
    );
  };

  const handleClaim = () => {
    dispatch({
      type: "UPDATE_PLAYER_MANA_STONE",
      payload: (
        parseFloat(playerManaStone) + parseFloat(mining[name].availableClaim)
      ).toFixed(2),
    });

    dispatch({
      type: "UPDATE_MINING",
      payload: {
        ...mining,
        [name]: {
          status: false,
          availableClaim: 0,
        },
      },
    });

    dispatch({
      type: "UPDATE_WORKERS_AVAILABLE",
      payload: {
        villager:
          parseInt(workersAvailable.villager) +
          parseInt(workersMining[name].villager),
        miner:
          parseInt(workersAvailable.miner) +
          parseInt(workersMining[name].miner),
        warrior:
          parseInt(workersAvailable.warrior) +
          parseInt(workersMining[name].warrior),
        mage:
          parseInt(workersAvailable.mage) + parseInt(workersMining[name].mage),
        lady:
          parseInt(workersAvailable.lady) + parseInt(workersMining[name].lady),
        king:
          parseInt(workersAvailable.king) + parseInt(workersMining[name].king),
      },
    });

    dispatch({
      type: "UPDATE_WORKERS_MINING",
      payload: {
        ...workersMining,
        [name]: {
          villager: 0,
          miner: 0,
          warrior: 0,
          mage: 0,
          lady: 0,
          king: 0,
        },
      },
    });

    setCountDown(0);
    setModalShow(false);
  };

  const renderManaStone = () => {
    if (mining[name].status) {
      return `${mining[name].min * MINES[name].ratio} - ${
        mining[name].max * MINES[name].ratio
      }`;
    }

    if(!mining[name].status && mining[name].availableClaim) {
      return mining[name].availableClaim
    }

    if (manaStone.max > 0) {
      return `${manaStone.min * MINES[name].ratio} - ${
        manaStone.max * MINES[name].ratio
      }`;
    }

    return 0;
  };

  return (
    <>
      <ClaimModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        claimManaStone={handleClaim}
        manaStone={mining[name].availableClaim}
      />
      <div className={`card mb-4 box-shadow ${name}-mine`}>
        <div className={`card-header ${locked ? "greyscale" : ""}`}></div>
        <div className="card-body mt-3">
          <div className="row">
            <div className="col">
              <p className="mana-stone">
                <img
                  src="./img/crystal.png"
                  alt="crystal"
                  className="crystal"
                />
                {renderManaStone()}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p className="mana-stone">
                {mining[name].status ? (
                  <>
                    <img
                      src="./img/clock.png"
                      className="crystal"
                      alt="crystal"
                    />
                    <Countdown date={countDown} renderer={renderer} />
                  </>
                ) : locked ? (
                  <>
                    +{MINES[name].bonusPop}{" "}
                    <img
                      src="./img/dwarf-icon.png"
                      className="crystal"
                      alt="crystal"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src="./img/clock.png"
                      alt="crystal"
                      className="clock"
                    />{" "}
                    {secondsToHms(time * MINES[name].time)}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="card-footer">{renderButton()}</div>
      </div>
    </>
  );
};
