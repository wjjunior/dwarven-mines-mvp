import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "./components/components/Header/header";
import { Mining } from "./components/components/Mining/mining"

function App() {
  return (
    <div className="App">
      <Header />
      <div className="position-relative overflow-hidden text-center home-image">
        {/* <img src="./img/mine.jpeg" alt="mine" /> */}
      </div>
      <div className="container">
        <Mining />
      </div>
    </div>
  );
}

export default App;
