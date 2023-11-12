import { useReducer, useState } from "react";
function reducer(state, action) {
  switch (action.type) {
    case "dec":
      return state - action.payload;
    case "inc":
      return state + action.payload;
    case "set":
      return 0;
    default:
      throw new Error("Unknown action..");
  }
  // if (action.type === "dec") return state - action.payload;
  // if (action.type === "inc") return state + action.payload;
  // if (action.type === "set") return 0;
}
export default function DateCounter() {
  const [value, dispatch] = useReducer(reducer, 0);
  const [steps, setSteps] = useState(1);
  const date = new Date();
  date.setDate(date.getDate() + value);

  return (
    <div
    // style={{
    //   display: "flex",
    //   flexDirection: "column",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   gap: "20px",
    //   height: "100vh",
    //   textAlign: "center",
    //   fontSize: "25px",
    // }}
    >
      <div>
        <p>{steps}</p>
        <input
          onChange={(e) => setSteps(e.target.value)}
          type="range"
          min="1"
          max="10"
          value={steps}
        />
      </div>
      <div>
        <button
          onClick={() => dispatch({ type: "dec", payload: Number(steps) })}
        >
          -
        </button>
        <input type="text" value={value} />
        <button
          onClick={() => dispatch({ type: "inc", payload: Number(steps) })}
        >
          +
        </button>
      </div>
      <button
        onClick={() => {
          dispatch({ type: "set" });
          setSteps(1);
        }}
      >
        Reset
      </button>
      <p>{date.toLocaleDateString()}</p>
    </div>
  );
}
