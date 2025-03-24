import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import TablasResultados from "./Resultado";
const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <TablasResultados
      Voltaje={220}
      Potencia={2500}
      Longitud={92}
      diametro_tubo="5/16"
    />
  </React.StrictMode>
);
