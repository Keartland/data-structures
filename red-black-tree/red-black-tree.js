var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var COLOUR = {
    RED: "#FF0000",
    BLACK: "#000000",
}

class Node {
    constructor(value){
        this.value = value;
        this.colour = COLOUR.red;
        this.left = null;
        this.right = null;
        this.parent = null
    }
    uncle(){
        if (this.parent == null || this.parent.parent == null){
            return null
        }
        if (this.parent.isOnLeft()){
            return this.parent.parent.right
        } else {
            return this.parent.parent.left
        }
    }
    isOnLeft() { return this == this.parent.left}
    sibling(){
        if(this.parent == null) { return null }
        if (this.isOnLeft()){
            return this.parent.right
        } else {
            return this.parent.left
        }
    }
    moveDown(newParent){
        if (this.parent != null){
            if (this.isOnLeft()){
                this.parent.left = newParent
            } else{
                this.parent.right = newParent
            }
        }
        newParent.parent = this.parent
        this.parent = newParent
    }
    hasRedChild(){
        return (this.left != NULL && this.left == COLOUR.RED) | (this.right != NULL && this.right == COLOUR.RED)
    }
}
class RedBlackTree {
	constructor(){
		this.root = null;
	}
	
}
