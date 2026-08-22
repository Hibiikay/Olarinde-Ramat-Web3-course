function dominantDirection(text) {
  // Count occurrences of each direction for characters that belong to a script
  let counted = countBy(text, char => {
    let script = characterScript(char.codePointAt(0));
    return script ? script.direction : null;
  }).filter(({name}) => name !== null); // remove characters with no script

  if (counted.length === 0) return "ltr"; // default if no scripts found

  // Find the direction with the highest count
  return counted.reduce((a, b) => a.count > b.count ? a : b).name;
}

// Example usage:
console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
