import { Queue } from "./queue.js";

export class Tree {
    constructor(arr) {
        let cleaned = removeDuplicates(mergeSort(arr));
        this.root = this.buildTree(cleaned);
    }

    buildTree(arr) {
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
        if (left[0] < right[0]) {
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