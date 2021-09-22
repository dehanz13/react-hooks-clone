// this function takes in props
import { useState, useEffect } from "./MyReact.js";

export default function Component({ propCount, buttonElem }) {
  // declare state
  const [count, setCount] = useState(0);
  // use memo to double the count
  const propCountDoubled = 0;

  useEffect(() => {
    const handler = () => setCount((currentCount) => currentCount + 1);
    buttonElem.addEventListener("click", handler);

    // with useEffect, whatever we return from it, it's going to be a function we run on cleanup.
    // so in return, we wanna make sure we remove the event listener on clean up, after we don't need it.
    return () => buttonElem.removeEventListener("click", handler);
  }, [buttonElem]);

  // tricky way to check if count is updating
  // setTimeout(() => {
  //   setCount((currentCount) => currentCount + 1);
  // }, 1000);

  // output state here
  return `
		State: ${count}
		Prop: ${propCount}
		Prop Doubled: ${propCountDoubled}
	`;
}
