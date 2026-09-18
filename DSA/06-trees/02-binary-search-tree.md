# Binary Search Tree (BST)

Left child < parent, right child > parent.

## Node
```javascript
class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
```

## Insert
```javascript
function insert(root, val) {
  if (!root) return new BSTNode(val);
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}
```

## Search
```javascript
function search(root, val) {
  if (!root || root.val === val) return root;
  if (val < root.val) return search(root.left, val);
  return search(root.right, val);
}
```

## Inorder traversal (gives sorted order)
```javascript
function inorder(root, out = []) {
  if (!root) return out;
  inorder(root.left, out);
  out.push(root.val);
  inorder(root.right, out);
  return out;
}
```

## Min / Max
```javascript
function minNode(root) {
  while (root.left) root = root.left;
  return root;
}

function maxNode(root) {
  while (root.right) root = root.right;
  return root;
}
```

## Delete
```javascript
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
```

## Validate BST
```javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}
```

## Practice
- LeetCode: 98. Validate Binary Search Tree
- LeetCode: 230. Kth Smallest Element in a BST
- LeetCode: 701. Insert into a BST
- LeetCode: 450. Delete Node in a BST
