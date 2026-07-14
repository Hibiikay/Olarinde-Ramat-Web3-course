// Step 1: Define countBs to count only uppercase "B" characters
function countBs(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "B") {
      count++;
    }
  }
  return count;
}

// Test Step 1
console.log(countBs("BBC"));   // Expected output: 2


// Step 2: Define a more general function countChar
// This counts how many times a given character appears in a string
function countChar(str, char) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      count++;
    }
  }
  return count;
}

// Test Step 2
console.log(countChar("kakkerlak", "k"));   // Expected output: 4


// Step 3: Rewrite countBs to reuse countChar
// Now countBs is just a special case of countChar
function countBs(str) {
  return countChar(str, "B");
}

// Test Step 3
console.log(countBs("BBC"));   // Expected output: 2
