
M = {};

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

Object.merge = function(){
    if (!arguments[0]){
        arguments[0] = {};
    }
    if (!arguments[1]){
        arguments[1] = {};
    }
    for (var property in arguments[1]) {
        if (!arguments[0].hasOwnProperty(property)){ arguments[0][property] = arguments[1][property]; }
    }
    Array.prototype.splice.call(arguments,1,1);
    return arguments.length === 1 ? arguments[0] : Object.merge.apply(0,arguments);
}

Array.merge = function(){
    return Array.prototype.concat.apply([],arguments);
};

Array.append = function(arr,item){
    var ret = Object.clone(arr);
    ret.push(item);
    return ret;
};

Array.prepend = function(arr,item){
    var ret = [Object.clone(item)], arr = Object.clone(arr);
    arr.map(function(i){ ret.push(i); });
    return ret;
};

Array.remove = function(arr,positions){
    arr = Object.clone(arr), count = 0;
    positions.sort().map(function(p){
        arr.splice(p-count++,1);
    });
    return arr;
};

Array.insert = function(arr,position,newitems){
    return Array.merge(arr.slice(0,position),newitems,arr.slice(position));
};

Array.exchange = function(arr,positions,newitems){
    return Array.insert(Array.remove(arr,positions),Math.min.apply({},positions),newitems);
};


// ************************************ Container class ******************************************

M.cnt = function(o){
    var ret = {
        type: "cnt",
        objs: {},
        hist: {},
        step: 0
    };
    return ret;
};

M.cnt.store = function(cnt,o){
    cnt.objs[o.id] = o; //Object.clone(o); // TODO - remove clonecalls when not needed
    if (!cnt.hist[o.id]){
        cnt.hist[o.id] = {};
    }
    cnt.hist[o.id][cnt.step] = o; //Object.clone(o);
};


// ************************************ Obj abstract baseclass ************************************

M.objs = 0;

M.obj = function(cnt,o){
    o = o || {};
    o.constructor = M.obj;
    o = Object.merge(o,{type:"base",id: ++M.objs});
    M.cnt.store(cnt,o);
    return o;
};

M.obj.draw = function(cnt,o){
    var drawtype = (o.type === "sum" || o.type === "prod" ? "col" : o.type);
//console.log(o.type,drawtype,M[drawtype] && M[drawtype].draw ? M[drawtype].draw : "NODRAW");
    return "<div class='M_obj M_"+o.type+(o.ppos ? " M_"+o.ppos:"")+"' id='"+o.id+"'>" + (M[drawtype] && M[drawtype].draw ? M[drawtype].draw(cnt,o) : "") + "</div>";
};

M.obj.equal = function(cnt,a1,a2){
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
        case "plc": return a1 === a2;
        case "foo": return a2.type === "foo";
        case "bar": return a2.type === "bar";
        case "sum":
        case "col": return M.col.equal(cnt,a1,a2);
        default: return M[a1.type].equal(cnt,a1,a2);
    }
}

M.obj.calc = function(cnt,item){
    if (typeof M[item.type] !== "object" || typeof M[item.type].calc !== "function"){
        return item;
    }
    return M[item.type].calc(item);
}


// ************************************ Statement class ******************************************

M.stmnt = function(cnt,o){
    return M.obj(cnt,Object.merge({type:"stmnt"},o));
};

// *************************** Collection abstract class ******************************

M.col = function(cnt,o){
    var col = M.obj(cnt,Object.merge({items:[]},o));
    M.col.add( cnt, col, M.plc(cnt) );
    M.col.add( cnt, col, M.plc(cnt) );
    return cnt.objs[col.id];
//    return M.obj( Object.merge(o,{items:[ M.plc(cnt).id, M.plc(cnt).id] }) );
 /*   
    ret.items = [];
    if (arg.items && arg.items.length > 0){
    for(var i=0;i<num;i++){
        var o = Object.clone(arg.items[i]);
        o.parentType = arg.type;
        o.positionInParent = !i ? "first" : i === num - 1 ? "last" : i;
        o.parentId = ret.id;
        ret.items.push(o);
    }
    }
    return M.obj(ret); */
};

M.col.annotate = function(cnt,col){
    var num = col.items.length;
    for(var i=0;i<num;i++){
        var o = cnt.objs[col.items[i]], ppos = !i ? "first" : i === num - 1 ? "last" : i;
        if (o.ppos != ppos){
            M.cnt.store(cnt,Object.merge({ppos:ppos},o));
        }
    }
}

M.col.draw = function(cnt,col){
    var ret = "";
    col.items.map(function(id){
        ret += M.obj.draw(cnt,cnt.objs[id]);
    });
    return ret;
};

M.col.add = function(cnt,col,obj,o){ // o contains child and container
    var insertindex = col.items.length, o = o ? o : {}, obj;
    if (col.items.indexOf(obj.id) !== -1){ // child already present in collection
        return col;
    }
    if (obj.type !== "plc"){
        for(var i=0; i<col.items.length; i++){ // if placeholders present, replace one of them
            if(cnt.objs[col.items[i]].type==="plc" && (!o.replaceid || o.replaceid === col.items[i])){
                insertindex = i;
                break;
            }
        }
        cnt.step++;
    }
    col.items[insertindex] = obj.id;
    M.cnt.store(cnt,col); // store the updated collection in the container
    M.col.annotate(cnt,col);
};

M.col.harvestItems = function(col,depth){
    var ret = [];
    if (depth === undefined){
        depth = -1;
    }
    col.items.map(function(item){
        if (item.type === col.type && depth !=0){
            ret = Array.merge(ret,M.col.harvestItems(item,depth-1));
        }
        else {
            ret.push(item);
        } 
    });
    return ret;
};

M.col.removeItem = function(col,unwanted){
    var items = [];
    col.items.map(function(item){
        if(!(M.obj.equal(item,unwanted))){
            items.push(item);
        }
    });
    return M[col.type](items); 
};

M.col.equal = function(cnt,s1,s2){
    var found,fail;
    if (s1.items.length !== s2.items.length){
        return false;
    }
    [{tolookfor:s1,tolookin:s2},{tolookfor:s2,tolookin:s1}].map(function(o){
        o.tolookfor.items.map(function(id1){
            found = false;
            o.tolookin.items.map(function(id2){
                if (M.obj.equal(cnt,cnt.objs[id1],cnt.objs[id2])){
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


// ************************************ Placeholder class *****************************************

M.plc = function(cnt,o){
    return M.obj(cnt,Object.merge({type:"plc"},o));
};

// ************************************ Value class *****************************************

M.val = function(cnt,o){
    if (typeof o === "number"){
        o = {val:o};
    }
    return M.obj(cnt,Object.merge({type:"val"},o));
};

M.val.equal = function(cnt,v1,v2){
    return v1.val === v2.val;
};

M.val.draw = function(cnt,val){
    return "<span>"+val.val+"</span>";
};

// ******************************** Fraction class *******************************************

M.frc = function(cnt,o){
    var frc = M.obj(cnt,Object.merge({type:"frc"},o));
    M.frc.setNumerator(cnt,frc,M.plc(cnt));
    frc = cnt.objs[frc.id];
    M.frc.setDenominator(cnt,frc,M.plc(cnt));
    frc = cnt.objs[frc.id];
    return frc;
};

M.frc.setNumerator = function(cnt,frc,obj){
    return M.frc.setObj(cnt,frc,obj,"num");
};

M.frc.setDenominator = function(cnt,frc,obj){
    return M.frc.setObj(cnt,frc,obj,"den");
};

M.frc.setObj = function(cnt,frc,obj,place){
    if (frc[place] === obj.id){
        return frc;
    }
    obj.ppos = place;
    frc[place] = obj.id;
    if (obj.type !== "plc"){
        cnt.step++;
    }
    M.cnt.store(cnt,frc);
    M.cnt.store(cnt,obj);
    return frc;
}

M.frc.draw = function(cnt,frc){
    return M.obj.draw(cnt,cnt.objs[frc.num]) + M.obj.draw(cnt,cnt.objs[frc.den]);
};

// ************************************ Sum class *******************************************

M.sum = function(cnt,o){
    return M.col(cnt,{type:"sum"}); //Object.merge({type:"sum"},o || {}));
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
                            if (j!=i && M.obj.equal(obj[type][i],obj[type][j])){
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
    return M.sum( M.col.harvestItems(sum,depth) );    //M.sum.harvestTerms(sum,depth));
};

M.sum.removeZeroes = function(sum){
    return M.col.removeItem(sum,M.val(0));
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
       // sum = M.suM.obj.calc(sum);
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

M.sum.equal = function(cnt,s1,s2){
    return M.col.equal(cnt,s1,s2);
}

// ********************************* Product class *****************************************

M.prod = function(o){
    if (o instanceof Array){
        o = {items: o};
    }
    o.type = "prod";
    return M.col(o);
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
    return M.col.equal(p1,p2);
};

M.prod.removeOnes = function(prod){
    return M.col.removeItem(prod,M.val(1));
};

M.prod.flattenProduct = function(prod,depth){
    return M.prod( M.col.harvestItems(prod,depth) );
}

M.prod.multiply = function(a1,a2){
    var zero = M.val(0), one = M.val(1);
    // If either argument is a zero, just return 0
    if (M.obj.equal(a1,zero) || M.obj.equal(a2,zero)){
        return zero;
    }
    // If either argument is a unitless 1, return the other argument on its own
    if (M.obj.equal(a1,one)) {
        return a2;
    }
    if (M.obj.equal(a2,one)) {
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