let arrays = [[1, 2, 3], [4, 5], [6]];

let flattened = arrays.reduce((acc, current) => acc.concat(current), []);

console.log(flattened);
// → [1, 2, 3, 4, 5, 6]

