
// Helper methods

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


// Library

M = {};

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



M.val = function(val,unit){
    var ret = {type: "val", val:val,unit: {} };
    if (typeof unit === "object") {
        ret.unit = unit;
    }
    else {
        ret.unit[unit || "NUMBER"] = 1;
    }
    return ret;
};

M.val.equal = function(v1,v2){
    return v1.val === v2.val;
};

M.sum = function(arr){
    var ret = {type: "sum",terms: []}, o, num = arr.length;
    for(var i=0;i<num;i++){
        o = Object.clone(arr[i]);
        o.parentType = "sum";
        o.roleInParent = "term";
        o.positionInParent = !i ? "first" : i === num - 1 ? "last" : "inlist";
        ret.terms.push(o);
    }
    return ret;
};

M.sum.calc = function(sum){
    var arr = [], obj = {};
    sum = M.sum.removeZeroes( M.sum.flattenSum( sum ) );
    sum.terms.map(function(item){
        if (!obj[item.type]){
            obj[item.type] = [];
        }
        obj[item.type].push(item);
    });
    for(var type in obj){
        switch(type){
            case "val": 
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
            default:
                arr = Array.merge(arr,obj[type]);
        }
    };
    return M.sum.flattenSum(M.sum(arr));
};

M.sum.harvestTerms = function(sum,depth){
    var ret = [];
    if (depth === undefined){
        depth = -1;
    }
    sum.terms.map(function(item){
        if (item.type === "sum" && depth !=0){
            ret = Array.merge(ret,M.sum.harvestTerms(item,depth-1));
        }
        else {
            ret.push(item);
        } 
    });
    return ret;
};

M.sum.flattenSum = function(sum,depth){
    return M.sum(M.sum.harvestTerms(sum,depth));
};

M.sum.removeZeroes = function(sum){
    var terms = [];
    sum.terms.map(function(item){
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
        return M.sum(Array.merge(a1.terms,a2.terms));
    }
    // Adding a value to a sum merges it if sum contains value
    if ((a1.type==="sum" && a2.type==="val") || (a1.type==="val" && a2.type==="sum")){
        var sum = a1.type === "sum" ? a1 : a2, val = a1.type === "val" ? a1 : a2, arr = [], merged;
        sum = M.sum.calc(sum);
        sum.terms.map(function(term){
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
        return M.sum(Array.append(a1.terms,a2));
    }
    // Adding an item and a sum returns one single sum with that item at the beginning
    if (a2.type==="sum"){
        return M.sum(Array.prepend(a2.terms,a1));
    }
    // Two values with same unit becomes one single value. Addition! :)
    if (a1.type==="val" && a2.type === "val"){
        return M.val(a1.val+a2.val);
    }

    // Default: just merge the two args into a sum
    return M.sum([a1,a2]);

};

M.sum.equal = function(s1,s2){
    var found,fail;
    if (s1.terms.length !== s2.terms.length){
        return false;
    }
    [{tolookfor:s1,tolookin:s2},{tolookfor:s2,tolookin:s1}].map(function(o){
        o.tolookfor.terms.map(function(a1){
            found = false;
            o.tolookin.terms.map(function(a2){
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

M.prod = function(arr){
    var ret = {type: "prod",factors: []}, o, num = arr.length;
    for(var i=0;i<num;i++){
        o = Object.clone(arr[i]);
        o.parentType = "prod";
        o.roleInParent = "factor";
        o.positionInParent = !i ? "first" : i === num - 1 ? "last" : "inlist";
        ret.factors.push(o);
    }
    return ret;
};

M.prod.calc = function(prod){
    var arr = [], obj = {};
    prod = M.prod.removeOnes( M.prod.flattenProduct( prod ) );
    prod.factors.map(function(item){
        if (!obj[item.type]){
            obj[item.type] = [];
        }
        obj[item.type].push(item);
    });
    for(var type in obj){
        switch(type){
            case "val": 
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
            case "sum": 
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
    var found,fail;
    if (p1.factors.length !== p2.factors.length){
        return false;
    }
    [{tolookfor:p1,tolookin:p2},{tolookfor:p2,tolookin:p1}].map(function(o){
        o.tolookfor.factors.map(function(a1){
            found = false;
            o.tolookin.factors.map(function(a2){
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
};

M.prod.removeOnes = function(prod){
    var factors = [];
    prod.factors.map(function(item){
        if(!(item.type === "val" && item.val === 1)){
            factors.push(item);
        }
    });
    return M.prod(factors);
};

M.prod.harvestFactors = function(prod,depth){
    var ret = [];
    if (depth === undefined){
        depth = -1;
    }
    prod.factors.map(function(item){
        if (item.type === "prod" && depth !=0){
            ret = Array.merge(ret,M.prod.harvestFactors(item,depth-1));
        }
        else {
            ret.push(item);
        } 
    });
    return ret;
}

M.prod.flattenProduct = function(prod,depth){
    return M.prod(M.prod.harvestFactors(prod,depth));
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
        return M.prod(Array.merge(a1.factors,a2.factors));
    }
    // Multiplying a prod and an item returns one single prod with that item at the end
    if (a1.type==="prod"){
        return M.prod(Array.append(a1.factors,a2));
    }
    // Multiplying an item and a prod returns one single prod with that item at the beginning
    if (a2.type==="prod"){
        return M.prod(Array.prepend(a2.factors,a1));
    }
    // Multiplying two values returns a multiplied value
    if (a1.type==="val" && a2.type==="val"){
        return M.val(a1.val * a2.val);
    }
    // Multiplying a sum and an item returns a sum with all terms multiplied with the item from the right
    // If the right item is a sum too, we flatten the result one step.
    if (a1.type==="sum"){
        var arr = [];
        a1.terms.map(function(term){
            arr.push(M.prod.multiply(term,a2));
        });
        return a2.type === "sum" ? M.sum.flattenSum( M.sum(arr), 1) : M.sum(arr);
    }
    // Multiplying an item and a sum returns a sum with all terms multiplied with the item from the left
    if (a2.type==="sum"){
        var arr = [];
        a2.terms.map(function(term){
            arr.push(M.prod.multiply(a1,term));
        });
        return M.sum(arr);
    }
    // Default: just merge the two args into a product
    return M.prod([a1,a2]);
};