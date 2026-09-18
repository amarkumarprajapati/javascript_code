// 02-binary-search-tree.js

class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function insert(root, val) {
  if (!root) return new BSTNode(val);
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}

function search(root, val) {
  if (!root || root.val === val) return root;
  if (val < root.val) return search(root.left, val);
  return search(root.right, val);
}

function inorder(root, out = []) {
  if (!root) return out;
  inorder(root.left, out);
  out.push(root.val);
  inorder(root.right, out);
  return out;
}

function minNode(root) {
  while (root.left) root = root.left;
  return root;
}

function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    const min = minNode(root.right);
    root.val = min.val;
    root.right = deleteNode(root.right, min.val);
  }
  return root;
}

function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}

let bst = null;
for (const v of [5, 3, 7, 2, 4, 6, 8]) bst = insert(bst, v);
console.log(inorder(bst));
console.log(isValidBST(bst));
