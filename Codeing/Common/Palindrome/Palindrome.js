function isPalindrome(str) {
  const cleaned = str.toLowerCase();

  return cleaned === cleaned.split('').reverse().join('');
}

console.log(isPalindrome("madam")); // true
console.log(isPalindrome("hello")); // false