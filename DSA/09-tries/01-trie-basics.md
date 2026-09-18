# Tries (Prefix Trees)

A Trie is a tree-like data structure used to efficiently store and retrieve keys in a dataset of strings. Great for autocomplete, spell checker, and prefix matching.

---

## JavaScript Implementation

```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert word — O(L) where L is length of word
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // Search word — O(L)
  search(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isEndOfWord;
  }

  // Check prefix — O(L)
  startsWith(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return true;
  }
}
```

## Practice Problems
- LeetCode 208: Implement Trie (Prefix Tree)
- LeetCode 211: Design Add and Search Words Data Structure
- LeetCode 212: Word Search II
