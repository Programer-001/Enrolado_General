import { useState } from "react";
import React, { Component } from "react";

const Calculator = () => {
  const [resistance, setResistance] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [power, setPower] = useState(0);
  const [current, setCurrent] = useState(0);

  const handleCalculate = () => {
    if (resistance > 0 && voltage > 0) {
      const currentCalc = voltage / resistance;
      const powerCalc = currentCalc * voltage;
      setCurrent(currentCalc);
      setPower(powerCalc);
    } else if (resistance > 0 && power > 0) {
      const voltageCalc = Math.sqrt(power * resistance);
      const currentCalc = power / voltageCalc;
      setVoltage(voltageCalc);
      setCurrent(currentCalc);
    } else if (voltage > 0 && power > 0) {
      const resistanceCalc = (voltage * voltage) / power;
      const currentCalc = power / voltage;
      setResistance(resistanceCalc);
      setCurrent(currentCalc);
    }
  };

  const handleReset = () => {
    setResistance(0);
    setVoltage(0);
    setPower(0);
    setCurrent(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calculadora Electrica</h1>
      <div className="flex justify-between mb-4">
        <br></br>
        <br></br>
        <input
          type="number"
          value={resistance}
          onChange={(e) => setResistance(parseFloat(e.target.value))}
          placeholder="Resistencia (Ω)"
          className="w-full p-2 mr-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          value={voltage}
          onChange={(e) => setVoltage(parseFloat(e.target.value))}
          placeholder="Volataje (V)"
          className="w-full p-2 mr-2 border border-gray-300 rounded-lg"
        />

        <input
          type="number"
          value={power}
          onChange={(e) => setPower(parseFloat(e.target.value))}
          placeholder="Potencia (W)"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        onClick={handleCalculate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
      >
        Calcular
      </button>
      <button
        onClick={handleReset}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        Reset
      </button>
      <div className="flex justify-between mb-4">
        <p className="font-bold mb-4">
          Corriente (A): <p>{current}</p>
        </p>
        <p className="font-bold mb-4">
          Resistencia (Ω): <p>{resistance}</p>
        </p>
        <p className="font-bold mb-4">
          Voltaje (V): <p>{voltage}</p>
        </p>
        <p className="font-bold mb-4">
          Potencia (W): <p>{power}</p>
        </p>
      </div>
      <div className="flex justify-between mb-4">
        <p>Formulas:</p>
        <p>I = V/R</p>
        <p>P = V*I</p>
        <p>R = V^2/P</p>
      </div>
    </div>
  );
};

export default Calculator;
