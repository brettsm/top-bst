import { Queue } from "./queue.js";

export class Tree {
    constructor(arr, allowDup = false) {
        this.allowDup = allowDup;
        let cleaned = removeDuplicates(mergeSort(arr));
        console.log(cleaned);
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
            console.log(curr);
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
                if(!curr) { parent.right = inserted; this._size++; return true };
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