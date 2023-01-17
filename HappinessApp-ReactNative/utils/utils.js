export function setAddState(key, value, state, setState) {
    const newState = {...state};
    newState[key] = value;
    setState(newState);
}