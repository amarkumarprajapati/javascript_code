// 03-advanced-trees.js

class AVLNode {
  constructor(val) {
    this.val = val;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

function getHeight(node) { return node ? node.height : 0; }
function getBalance(node) { return node ? getHeight(node.left) - getHeight(node.right) : 0; }
function updateHeight(node) { node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right)); }

function rightRotate(y) {
  const x = y.left, T2 = x.right;
  x.right = y; y.left = T2;
  updateHeight(y); updateHeight(x);
  return x;
}

function leftRotate(x) {
  const y = x.right, T2 = y.left;
  y.left = x; x.right = T2;
  updateHeight(x); updateHeight(y);
  return y;
}

function insertAVL(node, val) {
  if (!node) return new AVLNode(val);
  if (val < node.val) node.left = insertAVL(node.left, val);
  else node.right = insertAVL(node.right, val);
  updateHeight(node);
  const balance = getBalance(node);
  if (balance > 1 && val < node.left.val) return rightRotate(node);
  if (balance < -1 && val > node.right.val) return leftRotate(node);
  if (balance > 1 && val > node.left.val) { node.left = leftRotate(node.left); return rightRotate(node); }
  if (balance < -1 && val < node.right.val) { node.right = rightRotate(node.right); return leftRotate(node); }
  return node;
}

let avl = null;
for (const v of [10, 20, 30, 25, 28]) avl = insertAVL(avl, v);
console.log('AVL root:', avl.val);
