
// ************************************ Helper methods *********************************

Object.clone = function(obj){
    if (typeof(obj) != "object"){
        return obj;
    }
    var clone = new obj.constructor(), props = [], p;
    for(p in obj){
        props.push([p]);
    }
    props.sort();
    for(p=0;p<props.length;p++){
        clone[props[p]] = typeof obj[props[p]] === "object" ? Object.clone(obj[props[p]]) : obj[props[p]];
    }
    return clone;
};

Array.merge = function(a1,a2){
    a1 = Object.clone(a1);
    a2.map(function(i){ a1.push(i); });
    return a1;
};

Array.append = function(arr,item){
    var ret = Object.clone(arr);
    ret.push(item);
    return ret;
}

Array.prepend = function(arr,item){
    var ret = [Object.clone(item)], arr = Object.clone(arr);
    arr.map(function(i){ ret.push(i); });
    return ret;
}


// ************************************ M abstract baseclass ************************************

M = function(){
    var ret = {type:"base"};
    ret.constructor = M;
    ret.id = ++M.objs;
    return ret;
};

M.objs = 0;

M.equal = function(a1,a2){
    if (typeof a1 !== "object" && typeof a2 !== "object"){
        return a1 === a2;
    }
    if (typeof a1 !== "object" || typeof a2 !== "object"){
        return false;
    }
    if (a1.type !== a2.type){
        return false;
    }
    switch(a1.type){
        case "foo": return a2.type === "foo";
        case "bar": return a2.type === "bar";
        default: return M[a1.type].equal(a1,a2);
    }
}

M.calc = function(item){
    if (typeof M[item.type] !== "object" || typeof M[item.type].calc !== "function"){
        return item;
    }
    return M[item.type].calc(item);
}

// *************************** Collection abstract class methods ******************************

M.collection = function(arg){
    if (arg.items.length === 1){
        return arg.items[0];
    }
    var ret = M(),num = arg.items.length;
    ret.type = arg.type;
    ret.items = [];
    for(var i=0;i<num;i++){
        o = Object.clone(arg.items[i]);
        o.parentType = arg.type;
        o.positionInParent = !i ? "first" : i === num - 1 ? "last" : i;
        ret.items.push(o);
    }
    return ret;
};

M.collection.harvestItems = function(col,depth){
    var ret = [];
    if (depth === undefined){
        depth = -1;
    }
    col.items.map(function(item){
        if (item.type === col.type && depth !=0){
            ret = Array.merge(ret,M.collection.harvestItems(item,depth-1));
        }
        else {
            ret.push(item);
        } 
    });
    return ret;
};

M.collection.removeItem = function(col,unwanted){
    var items = [];
    col.items.map(function(item){
        if(!(M.equal(item,unwanted))){
            items.push(item);
        }
    });
    return M[col.type](items); 
};

M.collection.equal = function(s1,s2){
    var found,fail;
    if (s1.items.length !== s2.items.length){
        return false;
    }
    [{tolookfor:s1,tolookin:s2},{tolookfor:s2,tolookin:s1}].map(function(o){
        o.tolookfor.items.map(function(a1){
            found = false;
            o.tolookin.items.map(function(a2){
                if (M.equal(a1,a2)){
                    found = true;
                }
            });
            if (!found){
                fail = true;
                return;
            }
        });
    });
    return !fail;
}


// ************************************ Value class *****************************************

M.val = function(val){
    var ret = M();
    ret.type = "val";
    ret.val = val;
    return ret;
};

M.val.equal = function(v1,v2){
    return v1.val === v2.val;
};

// ************************************ Sum class *******************************************

M.sum = function(arr){
    return M.collection({items:arr,type:"sum"});
};

M.sum.calc = function(sum){
    var arr = [], obj = {};
    sum = M.sum.removeZeroes( M.sum.flattenSum( sum ) );
    sum.items.map(function(item){
        if (!obj[item.type]){
            obj[item.type] = [];
        }
        obj[item.type].push(item);
    });
    for(var type in obj){
        switch(type){
            case "val": // Adding all values together into a single value
                var val;
                obj.val.map(function(v){
                    if (!val) {
                        val = v;
                    } else {
                        val = M.sum.add(val,v);
                    }
                });
                arr.push(val);
                break;
            default: // grouping all equal non-value items together 
                var found = {}, duplicates = [];
                for(var i=0;i<obj[type].length;i++){
                    if (duplicates.indexOf(i)===-1){
                        found[i] = 1;
                        for(var j=0;j<obj[type].length;j++){
                            if (j!=i && M.equal(obj[type][i],obj[type][j])){
                                duplicates.push(j);
                                found[i]++;
                            }
                        }
                    }
                }
                for(var pos in found){
                    var item = obj[type][pos], num = found[pos];
                    arr.push( num > 1 ? M.prod([M.val(num),item]) : item);
                }
        }
    };
    return M.sum(arr);
};

M.sum.flattenSum = function(sum,depth){
    return M.sum( M.collection.harvestItems(sum,depth) );    //M.sum.harvestTerms(sum,depth));
};

M.sum.removeZeroes = function(sum){
    return M.collection.removeItem(sum,M.val(0));
    var terms = [];
    sum.items.map(function(item){
        if(!(item.type === "val" && item.val === 0)){
            terms.push(item);
        }
    });
    return M.sum(terms);
};

M.sum.add = function(a1,a2,order){
    // Adding a zero just returns the other argument
    if (a1.type === "val" && a1.val === 0){
        return a2;
    }
    if (a2.type === "val" && a2.val === 0){
        return a1;
    }
    // Adding two sums should return one single sum including all terms
    if (a1.type==="sum" && a2.type === "sum"){
        return M.sum(Array.merge(a1.items,a2.items));
    }
    // Adding a value to a sum merges it if sum contains value
    if ((a1.type==="sum" && a2.type==="val") || (a1.type==="val" && a2.type==="sum")){
        var sum = a1.type === "sum" ? a1 : a2, val = a1.type === "val" ? a1 : a2, arr = [], merged;
       // sum = M.sum.calc(sum);
        sum.items.map(function(term){
            if (term.type==="val" && !merged){
                arr.push( M.sum.add(val,term) );
                merged = true;
            }
            else {
                arr.push(term);
            }
        });
        if (merged){
            return M.sum(arr);
        }
    }
    // Adding a sum and an item returns one single sum with that item at the end
    if (a1.type==="sum"){
        return M.sum(Array.append(a1.items,a2));
    }
    // Adding an item and a sum returns one single sum with that item at the beginning
    if (a2.type==="sum"){
        return M.sum(Array.prepend(a2.items,a1));
    }
    // Two values with same unit becomes one single value. Addition! :)
    if (a1.type==="val" && a2.type === "val"){
        return M.val(a1.val+a2.val);
    }

    // Default: just merge the two args into a sum
    return M.sum([a1,a2]);

};

M.sum.equal = function(s1,s2){
    return M.collection.equal(s1,s2);
}

// ********************************* Product class *****************************************

M.prod = function(arr){
    return M.collection({items:arr,type:"prod"});
};

M.prod.calc = function(prod){
    var arr = [], obj = {};
    prod = M.prod.removeOnes( M.prod.flattenProduct( prod ) );
    prod.items.map(function(item){
        if (!obj[item.type]){
            obj[item.type] = [];
        }
        obj[item.type].push(item);
    });
    for(var type in obj){
        switch(type){
            case "val": // multiplying all values together
                var val,nonNumber;
                obj.val.map(function(v){
                    if (!val) {
                        val = v;
                    } else {
                        val = M.prod.multiply(val,v);
                    }
                });
                arr.push(val);
                break;
            case "sum": // multiplying all sums with each other
                obj.sum.map(function(s){
                });
                break;
            default:
                arr = Array.merge(arr,obj[type]);
        }
    };
    return M.prod(arr);
};

M.prod.equal = function(p1,p2){
    return M.collection.equal(p1,p2);
};

M.prod.removeOnes = function(prod){
    return M.collection.removeItem(prod,M.val(1));
};

M.prod.flattenProduct = function(prod,depth){
    return M.prod( M.collection.harvestItems(prod,depth) );
}

M.prod.multiply = function(a1,a2){
    var zero = M.val(0), one = M.val(1);
    // If either argument is a zero, just return 0
    if (M.equal(a1,zero) || M.equal(a2,zero)){
        return zero;
    }
    // If either argument is a unitless 1, return the other argument on its own
    if (M.equal(a1,one)) {
        return a2;
    }
    if (M.equal(a2,one)) {
        return a1;
    }
    // Multiplying two prods should return one single prod with all factors
    if (a1.type==="prod" && a2.type === "prod"){
        return M.prod(Array.merge(a1.items,a2.items));
    }
    // Multiplying a prod and an item returns one single prod with that item at the end
    if (a1.type==="prod"){
        return M.prod(Array.append(a1.items,a2));
    }
    // Multiplying an item and a prod returns one single prod with that item at the beginning
    if (a2.type==="prod"){
        return M.prod(Array.prepend(a2.items,a1));
    }
    // Multiplying two values returns a multiplied value
    if (a1.type==="val" && a2.type==="val"){
        return M.val(a1.val * a2.val);
    }
    // Multiplying a sum and an item returns a sum with all terms multiplied with the item from the right
    // If the right item is a sum too, we flatten the result one step.
    if (a1.type==="sum"){
        var arr = [];
        a1.items.map(function(term){
            arr.push(M.prod.multiply(term,a2));
        });
        return a2.type === "sum" ? M.sum.flattenSum( M.sum(arr), 1) : M.sum(arr);
    }
    // Multiplying an item and a sum returns a sum with all terms multiplied with the item from the left
    if (a2.type==="sum"){
        var arr = [];
        a2.items.map(function(term){
            arr.push(M.prod.multiply(a1,term));
        });
        return M.sum(arr);
    }
    // Default: just merge the two args into a product
    return M.prod([a1,a2]);
};