class Node {
    constructor(value) {
        this.next = null;
        this.value = value;
    }
}

export class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    enqueue(value) {
        const node = new Node(value);
        if(this.tail) {
            this.tail.next = node;
        }
        this.tail = node;
        if(!this.head) this.head = node;
        this._size++
    }

    dequeue() {
        if(!this.head) return null;

        const oldHead = this.head;
        const value = this.head.value;

        this.head = this.head.next;
        if (!this.head) this.tail = null;

        oldHead.next = null;
        this._size--;
        return value;
    }

    front() {
        return this.head ? this.head.value : null;
    }

    size() {
        return this._size;
    }

    isEmpty() {
        return this._size === 0;
    }


}