# Binary Tree & Traversals

Hierarchical structure with root, left child, right child.

## Node
```javascript
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
```

## Traversals
```javascript
function inorder(root) {
  if (!root) return;
  inorder(root.left);
  console.log(root.val);
  inorder(root.right);
}

function preorder(root) {
  if (!root) return;
  console.log(root.val);
  preorder(root.left);
  preorder(root.right);
}

function postorder(root) {
  if (!root) return;
  postorder(root.left);
  postorder(root.right);
  console.log(root.val);
}

function levelOrder(root) {
  if (!root) return [];
  const queue = [root], result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}
```

## Max depth
```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

## Symmetric tree
```javascript
function isSymmetric(root) {
  function mirror(left, right) {
    if (!left && !right) return true;
    if (!left || !right) return false;
    return left.val === right.val && mirror(left.left, right.right) && mirror(left.right, right.left);
  }
  return mirror(root, root);
}
```

## Practice
- LeetCode: 144. Binary Tree Preorder Traversal
- LeetCode: 94. Binary Tree Inorder Traversal
- LeetCode: 145. Binary Tree Postorder Traversal
- LeetCode: 102. Binary Tree Level Order Traversal
- LeetCode: 104. Maximum Depth of Binary Tree
- LeetCode: 101. Symmetric Tree
