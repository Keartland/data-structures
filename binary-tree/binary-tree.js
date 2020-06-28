var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

fontDim = 24

class Tree{
    constructor(){
        this.root = null
    }
    genFromSortedArray(arr){
        if (arr.length <= 1) {
            this.addValue(arr[0])
            return 0;
        }
        var mid = Math.floor(arr.length/2)
        this.addValue(arr[mid])
        this.genFromSortedArray(arr.splice(0,mid))
        this.genFromSortedArray(arr)
    }
    addValue(value){
        if (this.root == null){
            this.root = new Node(value)
        } else {
            this.root.addChild(value, 0)
        }
    }
    maxDepth(node){
        if (node == null) return 0
        return Math.max(this.maxDepth(node.left), this.maxDepth(node.right)) + 1
    }
    remove(C, D){
        if (D == 0) this.root = null
        var maxD = this.maxDepth(this.root);
        var conMaxD = maxD
        var curlevel = [this.root]
        var d = 0;
        while(maxD > 0){
            var nextlevel = []
            var count = 0;
            for (var n of curlevel) {
                if (count == Math.floor(C/2) && d == (D-1)){
                    if (C/2 > (count)) {
                        n.right = null
                    } else {
                        n.left = null
                    }
                }
                count++;
            }
            d++;
            for (var n of curlevel){
                if(n != null) {
                    nextlevel.push(n.left)
                    nextlevel.push(n.right)
                }
            }
            maxD--;
            curlevel = nextlevel
        }
    }
    draw(){
        var maxD = this.maxDepth(this.root);
        var conMaxD = maxD
        ctx.font = fontDim+"px Sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle='#293241';    // color of fill
        ctx.fillRect(0, 0, canvas.width,canvas.height)
        ctx.fillStyle='#FFFFFF';    // color of fill
        if (this.root == null){
            return;
        }
        var curlevel = [this.root]
        var d = 0;
        while(maxD > 0){
            var nextlevel = []
            var count = 0;
            for (var n of curlevel) {
                if (n != null){
                    ctx.fillText(n.value, canvas.width*(2*count+1)/2**(d+1),canvas.height*(d+1)/(conMaxD+1));
                    if (d>0){
                        ctx.beginPath();
                        ctx.moveTo(canvas.width*(2*count+1)/2**(d+1), canvas.height*(d+1)/(conMaxD+1) - fontDim );
                        ctx.lineTo(canvas.width*(4*Math.floor(count/2)+2)/2**(d+1), canvas.height*(d)/(conMaxD+1));
                        ctx.stroke();
                    }
                }
                count++;
            }
            d++;
            for (var n of curlevel){
                if(n == null) {
                    nextlevel.push(null)
                    nextlevel.push(null)
                } else {
                    nextlevel.push(n.left)
                    nextlevel.push(n.right)
                }
            }
            maxD--;
            curlevel = nextlevel
        }
    }
}

class Node {
    constructor(value){
        this.left = null
        this.right = null
        this.value = value
    }
    addChild(value){
        if (value < this.value){
            if(this.left == null){
                this.left = new Node(value);
            } else {
                this.left.addChild(value)
            }
        } else if (value > this.value){
            if(this.right == null){
                this.right =  new Node(value);
            } else {
                this.right.addChild(value)
            }
        }
    }

}

var tree = new Tree()
arr = []
for(var i=0;i<30;i++) arr.push(i)
tree.genFromSortedArray(arr)
var outStr = ""
tree.draw()
ctx.font = fontDim+"px Sans-serif";
ctx.textAlign = "center";
ctx.fillText(outStr == "" ? 0 : outStr, canvas.width/2, fontDim);
document.onkeydown = function(e){
    if (Number(outStr.split(",").map(x=>+x)[outStr.split(",").length-1] + e.key)){
        outStr += e.key;
    } else if (e.keyCode == 13){
        console.log(outStr.split(",").map(x=>+x))
        tree.genFromSortedArray(outStr.split(",").map(x=>+x))
        outStr = ""
    } else if (e.keyCode == 8){
        outStr = outStr.substring(0, outStr.length - 1);
    }else if (e.keyCode == 46){
        tree.root = null;
    }else if (e.keyCode == 188){
        outStr += e.key;
    }
    tree.draw()
    ctx.font = fontDim+"px Sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(outStr == "" ? 0 : outStr, canvas.width/2, fontDim);
};
document.onmousedown = function(e){
    maxD = tree.maxDepth(tree.root);
    var d = Math.round((e.pageY*(maxD+1)/canvas.height) - 1)
    var c = Math.round(-0.5 + e.pageX*(2**d)/canvas.width)
    tree.remove(c,d)
    tree.draw()
    ctx.font = fontDim+"px Sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(outStr == "" ? 0 : outStr, canvas.width/2, fontDim);
}
