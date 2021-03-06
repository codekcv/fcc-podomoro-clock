import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const PodomoroClock = () => {
  const [current, setCurrent] = React.useState('session');
  const [sessionX, setSessionX] = React.useState(25);
  const [breakX, setBreakX] = React.useState(5);
  const [running, setRunning] = React.useState(false);
  const [changed, setChanged] = React.useState(false);
  const [beep, setBeep] = React.useState(
    'https://www.myinstants.com/media/sounds/mlg-airhorn.mp3'
  );

  const setLength = (type, time) => {
    if (!(!running && time > 0 && time <= 60)) return;
    type === 'session' ? setSessionX(time) : setBreakX(time);
    setChanged(true);
  };

  const reset = () => {
    setChanged(true);
    setSessionX(25);
    setBreakX(5);
    setRunning(false);
    setCurrent('session');
    const airHorn = document.getElementById('beep');
    airHorn.currentTime = 0;
    airHorn.pause();
  };

  const switchTime = () => {
    //setCurrent(current === 'session' ? 'break' : 'session')
    if (current === 'session') setCurrent('break');
    else setCurrent('session');
  };

  const changeEffect = event => setBeep(event.target.value);

  return (
    <>
      <h1 id="title">&lt;Podomoro Clock /&gt;</h1>
      <Timer
        time={current === 'session' ? sessionX : breakX}
        next={current === 'session' ? breakX : sessionX}
        running={running}
        setRunning={setRunning}
        changed={changed}
        setChanged={setChanged}
        reset={reset}
        switchTime={switchTime}
        current={current}
        beep={beep}
      />
      <LengthLabel
        sessionX={sessionX}
        breakX={breakX}
        setLength={setLength}
        running={running}
      />
      <h3>Link Your Alarm Effect</h3>
      <input onChange={changeEffect} value={beep} id="beepURL" />
    </>
  );
};

const Timer = props => {
  const {
    time,
    next,
    current,
    reset,
    switchTime,
    running,
    setRunning,
    changed,
    setChanged,
    beep
  } = props;
  const [timer, setTimer] = React.useState();
  const [counter, setCounter] = React.useState(time * 60);

  const startStop = () => {
    if (!running) {
      if (changed) setCounter(time * 60);
      setChanged(false);
      setTimer(setInterval(() => setCounter(counter => counter - 1), 1000));
    } else {
      clearInterval(timer);
    }

    setRunning(!running);
  };

  const resetAll = () => {
    clearInterval(timer);
    setCounter(25 * 60);
    reset();
  };

  if (counter === -1) {
    setCounter(next * 60);
    switchTime();
    const alarm = document.getElementById('beep');
    alarm.currentTime = 0;
    alarm.play();
  }

  const nameCapital = current.charAt(0).toUpperCase() + current.slice(1);
  const timeNow = changed ? time * 60 : counter;
  let minute = Math.floor(timeNow / 60);
  minute = minute.toString().length === 1 ? `0${minute}` : `${minute}`;
  let seconds = timeNow % 60;
  seconds = seconds.toString().length === 1 ? `0${seconds}` : `${seconds}`;

  return (
    <>
      <h2 id="timer-label">{nameCapital}</h2>
      <h2 id="time-left">{`${minute}:${seconds}`}</h2>
      <button id="start_stop" onClick={startStop}>
        {running ? 'Pause' : 'Start'}
      </button>
      <button id="reset" onClick={resetAll}>
        Reset
      </button>
      <audio src={beep} id="beep" />
    </>
  );
};

const LengthLabel = ({ sessionX, breakX, setLength, running }) => {
  return (
    <div
      className="labels-container"
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <Label
        name="session"
        time={sessionX}
        setLength={setLength}
        running={running}
      />
      <Label
        name="break"
        time={breakX}
        setLength={setLength}
        running={running}
      />
    </div>
  );
};

const Label = ({ name, time, setLength }) => {
  const nameCapital = name.charAt(0).toUpperCase() + name.slice(1);
  const decrement = () => setLength(name, time - 1);
  const increment = () => setLength(name, time + 1);

  return (
    <>
      <div className="label-container">
        <div id={`${name}-length`}>{time}</div>
        <div id={`${name}-label`}>{nameCapital} Length</div>

        <div className="crementers">
          <button id={`${name}-decrement`} onClick={decrement}>
            -
          </button>
          <span> | </span>
          <button id={`${name}-increment`} onClick={increment}>
            +
          </button>
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<PodomoroClock />, document.getElementById('podomoro-clock'));
