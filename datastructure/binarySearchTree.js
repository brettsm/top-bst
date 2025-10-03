export class Tree {
    constructor(arr) {
        let cleaned = removeDuplicates(mergeSort(arr));
        this.root = buildTree(cleaned);
    }

    buildTree(arr) {
        let mid = Math.floor(arr.length / 2);
        const root = new Node(arr[mid]);

        let left = Math.floor(arr.splice(0,mid).length);
        console.log(left);

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