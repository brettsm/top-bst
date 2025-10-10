import { Tree } from "./datastructure/binarySearchTree.js";

const test = new Tree([2,3,1,4]);

test.printTree(test.root);

test.insert(26);
test.insert(6);
test.insert(5);
test.insert(9);
test.insert(7);
test.insert(8);


test.printTree(test.root);
console.log("8 height: " + test.height(8));
console.log("8 depth: " + test.depth(8));

if(!test.isBalanced()) {
    test.rebalance();
}

test.printTree(test.root);
console.log("8 height: " + test.height(8));
console.log("8 depth: " + test.depth(8));