import { useState, useRef } from 'react';

export default function useLongPress({onClick} = {}) {
  const [action, setAction] = useState();

  const timerRef = useRef();
  const isLongPress = useRef();

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setAction('longpress');
    }, 200)
  }

  function handleOnClick(e) {
    console.log('handleOnClick');
    if ( isLongPress.current ) {
      console.log('Is long press - not continuing.');
      return;
    }
    if (typeof onClick === 'function') {
        onClick()
    }
    setAction('click')
  }

  function handleOnMouseDown(e) {
    e.preventDefault()
    console.log('handleOnMouseDown');
    startPressTimer();
  }

  function handleOnMouseUp(e) {
    e.preventDefault()

    console.log('handleOnMouseUp');
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart(e) {
    e.preventDefault()

    console.log('handleOnTouchStart');
    startPressTimer();
  }

  function handleOnTouchEnd(e) {
    e.preventDefault()

    if ( action === 'longpress' ) return;
    console.log('handleOnTouchEnd');
    clearTimeout(timerRef.current);
  }

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd
    }
  }
}