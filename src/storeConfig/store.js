import { createStore, combineReducers } from "redux";
import { lootData } from "../utils/constants";

const INITIAL_STATE = {
  workersAvailable: {
    villager: 0,
    miner: 0,
    warrior: 0,
    mage: 0,
    lady: 0,
    king: 0,
  },
  workersSelected: {
    villager: 0,
    miner: 0,
    warrior: 0,
    mage: 0,
    lady: 0,
    king: 0,
  },
  workersMining: {
    small: {
      villager: 0,
      miner: 0,
      warrior: 0,
      mage: 0,
      lady: 0,
      king: 0,
    },
    medium: {
      villager: 0,
      miner: 0,
      warrior: 0,
      mage: 0,
      lady: 0,
      king: 0,
    },
    large: {
      villager: 0,
      miner: 0,
      warrior: 0,
      mage: 0,
      lady: 0,
      king: 0,
    },
    extreme: {
      villager: 0,
      miner: 0,
      warrior: 0,
      mage: 0,
      lady: 0,
      king: 0,
    },
  },
  manaStone: {
    min: 0,
    max: 0,
  },
  time: 0,
  playerManaStone: 32540,
  // playerManaStone: 1210,
  popCap: 0,
  mineLevel: 0,
  mining: {
    small: {
      status: false,
      availableClaim: 0,
      min: 0,
      max: 0
    },
    medium: {
      status: false,
      availableClaim: 0,
      min: 0,
      max: 0
    },
    large: {
      status: false,
      availableClaim: 0,
      min: 0,
      max: 0
    },
    extreme: {
      status: false,
      availableClaim: 0,
      min: 0,
      max: 0
    },
  },
};

const dwarfLoot = (workersSelected, type) => {
  let loot = {
    min: 0,
    max: 0,
  };
  let time = 0;
  for (let i = 0; i < workersSelected[type]; i++) {
    loot.min += lootData[type].min;
    loot.max += lootData[type].max;
    time += lootData[type].time;
  }
  return { loot, time };
};

const calculateLoot = (state) => {
  const { workersSelected } = state;
  const data = {
    villager: dwarfLoot(workersSelected, "villager"),
    miner: dwarfLoot(workersSelected, "miner"),
    warrior: dwarfLoot(workersSelected, "warrior"),
    mage: dwarfLoot(workersSelected, "mage"),
    lady: dwarfLoot(workersSelected, "lady"),
    king: dwarfLoot(workersSelected, "king"),
  };

  const { manaStone, time } = Object.keys(data).reduce(
    (previous, key) => {
      previous.manaStone.min += data[key].loot.min;
      previous.manaStone.max += data[key].loot.max;
      previous.time += data[key].time;
      return previous;
    },
    { manaStone: { min: 0, max: 0 }, time: 0 }
  );

  return { ...state, manaStone, time };
};

const reducers = combineReducers({
  workers: (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "UPDATE_VILLAGER":
        const villager = {
          ...state,
          workersSelected: {
            ...state.workersSelected,
            villager: action.payload,
          },
        };
        return calculateLoot(villager);
      case "UPDATE_MINER":
        const miner = {
          ...state,
          workersSelected: { ...state.workersSelected, miner: action.payload },
        };
        return calculateLoot(miner);
      case "UPDATE_WARRIOR":
        const warrior = {
          ...state,
          workersSelected: {
            ...state.workersSelected,
            warrior: action.payload,
          },
        };
        return calculateLoot(warrior);
      case "UPDATE_MAGE":
        const mage = {
          ...state,
          workersSelected: { ...state.workersSelected, mage: action.payload },
        };
        return calculateLoot(mage);
      case "UPDATE_LADY":
        const lady = {
          ...state,
          workersSelected: { ...state.workersSelected, lady: action.payload },
        };
        return calculateLoot(lady);
      case "UPDATE_KING":
        const king = {
          ...state,
          workersSelected: { ...state.workersSelected, king: action.payload },
        };
        return calculateLoot(king);
      case "UPDATE_PLAYER_MANA_STONE":
        return { ...state, playerManaStone: action.payload };
      case "UPDATE_TIME":
        return { ...state, time: action.payload };
        case "UPDATE_MANA_STONE":
        return { ...state, manaStone: action.payload };
      case "UPDATE_POP_CAP":
        return { ...state, popCap: action.payload };
      case "UPDATE_MINE_LEVEL":
        return { ...state, mineLevel: state.mineLevel + 1 };
      case "UPDATE_MINING":
        return { ...state, mining: action.payload };
      case "UPDATE_WORKERS_AVAILABLE":
        return { ...state, workersAvailable: action.payload };
      case "UPDATE_WORKERS_MINING":
        return {
          ...state,
          workersMining: { ...state.workersMining, ...action.payload },
        };
      case "RESET_SELECTED_WORKERS":
        return { ...state, workersSelected: INITIAL_STATE.workersSelected };
      case "RESET":
        return INITIAL_STATE;
      default:
        return state;
    }
  },
});

function store() {
  return createStore(reducers);
}

export default store;
