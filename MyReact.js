// This component is going to render

let globalId = 0;
let globalParent;
// this global state is like our global state for all the different components, like useState, useEffect, useMemo, and all are gonna store their information inside of this componentState.
const componentState = new Map(); // map is the perfect way to go from one value to another value.

export function useState(initialState) {
  // problem: it's difficult to know where this function is being called and what order.
  // Hooks rule: they must be called in order from top to bottom, they can't never change order and they must be called every time the component renders.

  // TODOS:
  // 1. create an ID that we're going to use to assign for each piece of our state
  // 2. then whenever we render a component, we're going to reset our ID to zero so we can always have a brand new ID to work with.
  // 3. store our state in a global variable
  // 4. create a function using closures and IIFE in case we want to render 2 parent components. then put the rest of the code in it except the variables.

  // return [state, setState];
  const id = globalId;
  const parent = globalParent;
  globalId++; // increment by 1 so after each hook runs, we just increment our id by 1, so next time we call our state, the id grows 1 larger so it'll be the next entry in our cache
  return (() => {
    const { cache } = componentState.get(parent);
    // check if we have a value in our cache for the current id
    // if it equals to null, it means this is the first time we've ever called this useState hook. so we wanna use our initialState.
    if (cache[id] == null) {
      // check if our initialState value is a type of function or value. In JS instead of React, with useState you can pass it a function or value.
      // if it's a function, we'll call it as a function otherwise, we just pass it the initialState because it's a value.
      cache[id] = {
        value:
          typeof initialState === "function" ? initialState() : initialState,
      };
    }
    // lastly, create the setState function that can take a function or a value
    const setState = (state) => {
      const { props, component } = componentState.get(parent);
      if (typeof state === "function") {
        cache[id].value = state(cache[id].value);
      } else {
        cache[id].value = state;
      }

      // PROBLEM: we'll never going to render our component when the state changes. so we need to call our render function and pass it our component, props, and parent.
      render(component, props, parent);
    };
    // return [initialState, () => {}]; // so instead of passing our initialState, we pass in the cache with the id.
    return [cache[id].value, setState];
  })();
}

export function useEffect(callback, dependencies) {
  const id = globalId;
  const parent = globalParent;
  globalId++;

  (() => {
    const { cache } = componentState.get(parent);
    if (cache[id] == null) {
      cache[id] = { dependencies: undefined };
    }

    // here we check if our array of dependencies changed at all
    const dependenciesChanged =
      dependencies == null ||
      dependencies.some((dependency, i) => {
        return (
          cache[id].dependencies == null ||
          cache[id].dependencies[i] !== dependency
        );
      });

    if (dependenciesChanged) {
      if (cache[id].cleanup != null) cache[id].cleanup();
      cache[id].cleanup = callback();
      cache[id].dependencies = dependencies;
    }
  })();
}

export function useMemo(callback, dependencies) {
  const id = globalId;
  const parent = globalParent;
  globalId++;

  return (() => {
    const { cache } = componentState.get(parent);
    if (cache[id] == null) {
      cache[id] = { dependencies: undefined };
    }

    // here we check if our array of dependencies changed at all
    const dependenciesChanged =
      dependencies == null ||
      dependencies.some((dependency, i) => {
        return (
          cache[id].dependencies == null ||
          cache[id].dependencies[i] !== dependency
        );
      });

    if (dependenciesChanged) {
      cache[id].value = callback();
      cache[id].dependencies = dependencies;
    }

    return cache[id].value;
  })();
}

// this function taking a functing, calling it and putting the output as the text content.
export function render(component, props, parent) {
  // before we render our component, we check if we have any values for this map.
  // but instead of mapping to our particular component, we're gonna use our parent as the key for our map. Because you can only put a component inside a parent ONCE. A parent cannot have multiple components inside of it. If you have 2 components being rendered in the same parent, the last one is always going to override the first one, and so we know our parent key is always going to be unique.

  const state = componentState.get(parent) || { cache: [] }; // if we dont have any state, default it to a new object with empty array(cache - this cache has the information for our hooks). For each parent that we're rendering into, we have a cache of information that we're storing inside of this state, as well as a component and props that we can use inside of the hooks as needed.
  // have our component able to update our state. So for our parent, we want to set an object that takes in our current state and pass in our component and our props(to update in case our parent gets a new component rendered inside of it or if we changed the props we pass, we wanna make sure those get updated inside of our state every single time we render the component). So the cache stays the same between every single render and we dont wanna ever change our cache.
  componentState.set(parent, { ...state, component, props });
  globalParent = parent;
  const output = component(props);
  globalId = 0; // reset globalId to zero every time we finish rendering our component that way the next component is going to have the correct ID being shown.
  parent.textContent = output;
}
