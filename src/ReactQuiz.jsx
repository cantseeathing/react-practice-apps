import { useEffect, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved": {
      console.log("data recieved!");
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        points: Number(0),
      };
    }
    case "loading": {
      return {
        ...state,
        status: "loading",
      };
    }
    case "dataFailed": {
      console.log("error here", action.payload);
      return {
        ...state,
        status: "error",
        errorMessage: action.payload,
      };
    }
    case "active": {
      return {
        ...state,
        status: "active",
        currentQuestion: 0,
        points: 0,
      };
    }

    case "restart": {
      return {
        ...state,
        status: "active",
        currentQuestion: 0,
        points: 0,
        secondsRemaining: initialState.secondsRemaining,
      };
    }
    case "correct": {
      console.log("that was correct");
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        points: Number(state.points) + 10,
        secondsRemaining: initialState.secondsRemaining,
      };
    }
    case "wrong": {
      console.log("that was wrong!");
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        secondsRemaining: initialState.secondsRemaining,
      };
    }
    case "tick": {
      console.log("tick: ", state.secondsRemaining);
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status:
          state.secondsRemaining === 0
            ? (state.currentQuestion = 15)
            : state.status,
      };
    }
    default:
      throw new Error("Unknown command");
  }
}
const initialState = {
  questions: [],
  // LOADING, ERROR, READY, ACTIVE, FINISHED
  status: "loading",
  secondsRemaining: 10,
};
export default function ReactQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  useEffect(function () {
    dispatch({ type: "loading" });
    fetch("http://localhost:8000/questions")
      .then((json) => json.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed", payload: err }));
  }, []);
  if (state.status === "loading") return <p>Loading...</p>;
  if (state.status === "error")
    return <p>An error occurred when loading the data..</p>;
  if (state.status === "ready")
    return (
      <>
        <p>{state.questions.length} questions to test your React skillz!</p>
        <button onClick={() => dispatch({ type: "restart" })}>
          Start the Quiz!
        </button>
      </>
    );
  if (state.currentQuestion === state.questions.length)
    return (
      <div>
        <p>Congrats on completing the quiz</p>
        <p>
          your final score is:{" "}
          {(state.points / (state.currentQuestion * 10)) * 100} %
        </p>
        <button onClick={() => dispatch({ type: "restart" })}>
          Start Again!
        </button>
      </div>
    );
  if (state.status === "active")
    return (
      <div>
        <p>React Quiz</p>
        <Timer dispatch={dispatch} secondsRemaining={state.secondsRemaining} />
        <p>
          {state.currentQuestion + 1}/{state.questions.length}
        </p>
        <p>Score: {state.points}</p>
        <p>{state.questions.at(state.currentQuestion).question}</p>
        {state.questions.at(state.currentQuestion).options.map((ans) => {
          const correctAnswer = state.questions.at(state.currentQuestion)
            .options[state.questions.at(state.currentQuestion).correctOption];
          console.log(
            "correct answer: ",
            state.questions.at(state.currentQuestion).options[
              state.questions.at(state.currentQuestion).correctOption
            ]
          );
          return correctAnswer === ans ? (
            <button key={ans} onClick={() => dispatch({ type: "correct" })}>
              {ans}
            </button>
          ) : (
            <button key={ans} onClick={() => dispatch({ type: "wrong" })}>
              {ans}
            </button>
          );
        })}
      </div>
    );
}

function Timer({ dispatch, secondsRemaining }) {
  useEffect(
    function () {
      const timer = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    },
    [dispatch]
  );
  return (
    <div>
      <p>Seconds Remaining: {secondsRemaining}</p>
    </div>
  );
}
