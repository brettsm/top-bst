import { Queue } from "./queue.js";

export class Tree {
    constructor(arr = [], allowDup = false) {
        this.allowDup = allowDup;
        let cleaned = removeDuplicates(mergeSort(arr));
        this.root = this._buildTree(cleaned);
    }

    _buildTree(arr) {
        if (arr.length < 1) return null;
        const mid = Math.floor((arr.length - 1) / 2);

        const q = new Queue();
        const root = new Node(arr[mid]);

        q.enqueue({n: root, s: 0, e: arr.length - 1});
        while (!q.isEmpty()) {
            let curr = q.dequeue();
            let node = curr.n;
            let start = curr.s;
            let end = curr.e;
            let index = start + Math.floor((end - start) / 2);

            if (start < index) {
                let midLeft = start + Math.floor((index - 1 - start) / 2); // middle of the left side of array, excluding the mid value
                let left = new Node(arr[midLeft]);
                node.left = left;
                q.enqueue({n: left, s: start, e: index - 1}); // now we need to find the left and right children 'left' if they exist so push it in
            }

            if (index < end) { 
                let midRight = index + 1 + Math.floor((end - index - 1) / 2);  // (end - (index + 1)) ==> (end - index - 1)
                let right = new Node(arr[midRight]);
                node.right = right;
                q.enqueue({n: right, s: index + 1, e: end});
            }
        }
        
        return root;
    }

    insert(value) {
        const inserted = new Node(value);

        if (this.root === null) {
            this.root = inserted;
            return true;
        }


        let parent = null;
        let curr = this.root;
        while (curr !== null) {
            parent = curr;
            if (curr.value > value) {
                curr = curr.left;
            } else if (curr.value < value) {
                curr = curr.right;
            } else {
                if (!this.allowDup) return false; // means curr.value === value (key already exists)
                // place dups to the right
                curr = curr.right;
                if(!curr) { parent.right = inserted; return true };
            }
        }

        // If x is smaller, make it left child, else right child
        if (parent.value > value) {
            parent.left = inserted;
            return true;
        } else {
            parent.right = inserted;
            return true;
        }

    }

    deleteItem(value) {
        this.root = this._deleteNode(this.root, value);
    }

    _deleteNode(node, value) {
        if (node === null) return null;

        if (value < node.value) 
            node.left = this._deleteNode(node.left, value);
        else if (value > node.value) 
            node.right = this._deleteNode(node.right, value);
        else {
            // If node matches with the given key

            // 0 to 1 children handled
            if (node.left === null) {
                return node.right;
            }

            if (node.right === null) {
                return node.left;
            }

            // 2 children
            let succ = this._getSuccessor(node);
            node.value = succ.value;
            node.right = this._deleteNode(node.right, succ.value);
        }
        return node;
    }


    _getSuccessor(curr) {
        if (!curr?.right) return null;
        curr = curr.right;
        while (curr.left) curr = curr.left;
        return curr;
    }

    printTree(node, prefix = '', isLeft = true) {
        if (node === null) return;

        if (node.right !== null) {
            this.printTree(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
        if (node.left !== null) {
            this.printTree(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
    }

    find(value) {
        let curr = this.root;

        while (curr) {
            if (value === curr.value) return curr;
            curr = value < curr.value ? curr.left : curr.right;
        }

        return null;
    }

    levelOrderForEach(callback) {
        if (!this.root) return;
        if (typeof callback !== 'function') throw new TypeError("levelOrderForEach(callback) expects a function");

        const q = new Queue();
        q.enqueue(this.root);

        while(!q.isEmpty()) {
            let node = q.dequeue();
            callback(node);
            if(node.left) q.enqueue(node.left);
            if(node.right) q.enqueue(node.right);
        }
    }

    inOrderForEach(callback) {
        if (typeof callback !== 'function') 
            throw new TypeError("inOrderForEach(callback) expects a function");
        
        const walk = (node) => {
            if (!node) return;
            walk(node.left);
            callback(node);
            walk(node.right);
        }
        walk(this.root);
    }


    preOrderForEach(callback) {
        if (typeof callback !== 'function') 
            throw new TypeError("preOrderForEach(callback) expects a function");
        
        const walk = (node) => {
            if (!node) return;
            callback(node);
            walk(node.left);
            walk(node.right);
        }
        walk(this.root);
    }

    postOrderForEach(callback) {
        if (typeof callback !== 'function') 
            throw new TypeError("postOrderForEach(callback) expects a function");
        
        const walk = (node) => {
            if (!node) return;
            walk(node.left);
            walk(node.right);
            callback(node);
        }
        walk(this.root);
    }

    height(value) {
        const n = this.find(value);
        return n ? this._nodeHeight(n) : null;
    }

    treeHeight() {
        return this._nodeHeight(this.root);
    }

    _nodeHeight(node) {
        if (!node) return -1;
        const lh = this._nodeHeight(node.left);
        const rh = this._nodeHeight(node.right);

        return 1 + Math.max(lh, rh);
    }

    depth(value) {
        let k = 0;
        let curr = this.root;
        while (curr) {
            if (curr.value === value) return k;
            curr = curr.value > value ? curr.left : curr.right;
            k++;
        }
        return null;
    }

    isBalanced() {
        return this._checkBalanced(this.root).ok;
    } 

    _checkBalanced(node) {
        if (!node) return { h: -1, ok: true };           // empty subtree: height -1 (edges)

        const L = this._checkBalanced(node.left);
        if (!L.ok) return { h: 0, ok: false };           // early exit

        const R = this._checkBalanced(node.right);
        if (!R.ok) return { h: 0, ok: false };

        const ok = Math.abs(L.h - R.h) <= 1;
        return { h: 1 + Math.max(L.h, R.h), ok };
    }

    rebalance() {
        const sort = [];
        const callback = (node) => {
            sort.push(node.value);
        }
        this.inOrderForEach(callback);
        this.root = this._buildTree(sort);

        return this;
    }
}
 
class Node {
    constructor(value) {
        this.left = null;
        this.right = null;
        this.value = value;
    }
}

function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);

    let left = mergeSort(arr.slice(0,mid));
    let right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    let sortedArr = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            sortedArr.push(left[i++]);
        } else  {
            sortedArr.push(right[j++]);
        }
    }

    return [...sortedArr, ...left.slice(i), ...right.slice(j)];
}


function removeDuplicates(arr) {
    if (arr.length === 0) return arr;

    let j = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[j]) {
            j++;
            arr[j] = arr[i];
        }
    }

    arr.length = j + 1; 
    return arr;
}