JSpec.describe("Math library",function(){
    describe("The M abstract class constructor",function(){
        it("should be defined",function(){
            expect(M).to(be_a,Function);
        });
        it("should be a constructor",function(){
            var res = M();
            expect(res).to(be_an,M);
            expect(res.type).to(be,"base");
            expect(res.constructor).to(be,M);
        });
        it("should set a unique id on each object",function(){
            var o1 = M(), o2 = M();
            console.log(o1);
            expect(o1.id).to(be_a,Number);
            expect(o1.id>0).to(be,true);
            expect(o2.id>o1.id).to(be,true);
        });
        describe("The equal function",function(){
            it("should be defined",function(){
                expect(M.equal).to(be_a,Function);
            });
            it("should return false for two items of different type",function(){
                expect(M.equal({type:"foo"},{type:"bar"})).to(be,false);
            });
            it("should correctly compare values",function(){
                expect(M.equal(M.val(3),M.val(3))).to(be,true);
                expect(M.equal(M.val(3),M.val(4))).to(be,false);
            });
            it("should correctly compare sums",function(){
                var arr = [M.val(1),M.val(2)];
                expect(M.equal(M.sum(arr), M.sum(arr))).to(be,true);
                expect(M.equal(M.sum(arr), M.sum(Array.merge(arr,[M.val(4)])))).to(be,false);
            });
            it("should correctly compare products",function(){
                var arr = [M.val(2),M.val(3)];
                expect(M.equal(M.prod(arr), M.prod(arr))).to(be,true);
                expect(M.equal(M.prod(arr), M.prod(Array.merge(arr,[M.val(4)])))).to(be,false);
            });
        });
        describe("The calc function",function(){
            it("should be defined",function(){
                expect(M.calc).to(be_a,Function);
            });
            it("should return values as they are",function(){
                var val = M.val(32);
                expect(M.calc(val)).to(eql,val);
            });
        });
    });
    describe("The helper functions",function(){
        describe("Object clone",function(){
            it("should be defined",function(){
                expect(Object.clone).to(be_a,Function);
            });
            it("should clone an array into a new array",function(){
                var a = [1,2,3], res = Object.clone(a);
                expect(res).to(be_an,Array);
                expect(res).to(eql,a);
                expect(a===res).to(be,false);
            })
            it("should make an object into a new object",function(){
                var a = {a:1,4:"abc"}, res = Object.clone(a);
                expect(res).to(be_an,Object);
                expect(res).to(eql,a);
                expect(a===res).to(be,false);
            });
            it("should return primitives as they are",function(){
                var p = "moo", ret = Object.clone(p);
                expect(ret).to(be,p);
            });
        });
        describe("Array merge",function(){
            it("should be defined",function(){
                expect(Array.merge).to(be_a,Function);
            });
            it("should merge two arrays into a new one",function(){
                var a = [1,2,3], b = ["a","b","c"], ret = Array.merge(a,b);
                expect(ret.length).to(be,6);
                expect(ret[0]).to(be,a[0]);
                expect(ret[a.length+b.length-1]).to(be,b[b.length-1]);
                expect(ret === a).to(be,false);
            });
        });
        describe("Array append",function(){
            it("should be defined",function(){
                expect(Array.append).to(be_a,Function);
            });
            it("should merge a clone with the item at the end",function(){
                var arr = [1,2,3], item = 4, ret = Array.append(arr,item);
                expect(ret.length).to(be,arr.length+1);
                expect(ret[0]).to(be,arr[0]);
                expect(ret[ret.length-1]).to(be,item);
                expect(ret === arr).to(be,false);
            });
        });
        describe("Array prepend",function(){
            it("should be defined",function(){
                expect(Array.append).to(be_a,Function);
            });
            it("should merge a clone with the item at the beginning",function(){
                var arr = [1,2,3], item = 4, ret = Array.prepend(arr,item);
                expect(ret.length).to(be,arr.length+1);
                expect(ret[1]).to(be,arr[0]);
                expect(ret[0]).to(be,item);
                expect(ret[ret.length-1]).to(be,arr[arr.length-1]);
                expect(ret === arr).to(be,false);
            });
        });
    });
    describe("The Value class",function(){
        it("should have a constructor on M",function(){
            expect(M.val).to(be_a,Function);
        });
        it("should inherit from M",function(){
            var x = M.val(7);
            expect(x).to(be_an,M);
        });
        it("should have an id",function(){
            var x = M.val(7);
            expect(x.id).to(be_a,Number);
        });
        it("should have a val type and a val property",function(){
            var x = M.val(7);
            expect(x.type).to(be,"val");
            expect(x.val).to(equal,7);
        });
        describe("The equal function",function(){
            it("should be defined",function(){
                expect(M.val.equal).to(be_a,Function);
            });
            it("should return false for two values with different val",function(){
                var v1 = M.val(7), v2 = M.val(9), ret = M.val.equal(v1,v2);
                expect(ret).to(be,false);
            });
        });
    });
    describe("The sum class",function(){
        it("should have a constructor on M",function(){
            expect(M.sum).to(be_a,Function);
        });
        it("should inherit from M",function(){
            var x = M.sum([]);
            expect(x).to(be_an,M);
        });
        it("should have an id",function(){
            var x = M.sum([]);
            expect(x.id).to(be_a,Number);
        });
        it("should have a type property equalling sum",function(){
            var x = M.sum([]);
            expect(x.type).to(be,"sum");
        });
        it("should have a terms array property",function(){
            var x = M.sum([]);
            expect(x.terms).to(be_an,Array);
        });
        it("should not create a sum if not more than 1 item in argument array",function(){
            expect(M.sum([M.val(3)]).type).to(be,"val");
        });
        it("should store copies of the value-made argument array in the terms property",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], x = M.sum(arr);
            expect(x.terms[0].val).to(be,arr[0].val);
            expect(x.terms[0].unit).to(eql,arr[0].unit);
            expect(x.terms[0] === arr[0]).to(be,false);
        });
        it("should annotate the included objects",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], x = M.sum(arr);
            expect(x.terms[0].parentType).to(be,"sum");
            expect(x.terms[0].roleInParent).to(be,"term");
            expect(x.terms[0].positionInParent).to(be,"first");
            expect(x.terms[1].positionInParent).to(be,"inlist");
            expect(x.terms[arr.length-1].positionInParent).to(be,"last");
        });
        describe("The calc function",function(){
            it("should be defined",function(){
                expect(M.sum.calc).to(be_a,Function);
            });
            it("should merge all values into a single value",function(){
                var arr = [ M.val(2), M.val(3) ], sum = M.sum(arr), res = M.sum.calc( sum );
                expect(res.type).to(be,"val");
                expect(res.val).to(be,5);
                arr.push({type:"foo"});
                res = M.sum.calc( M.sum( arr) );
                expect(res.type).to(be,"sum");
                expect(res.terms.length).to(be,2);
            });
            it("should merge all equal non-value items into a product",function(){
                var foo = {type: "foo"}, bar = {type: "bar"}, arr = [M.val(2),M.val(3),foo,foo,foo,bar,foo],
                    sum = M.sum(arr), res = M.sum.calc(sum);
                expect(res).to(be_an,M);
                expect(res.type).to(be,"sum");
                expect(res.terms.length).to(be,3);
                expect( M.equal(res, M.sum([M.val(5),M.prod([M.val(4),foo]),bar])) ).to(be,true);
            });
        });
        describe("The harvestTerms function",function(){
            it("should be defined",function(){
                expect(M.sum.harvestTerms).to(be_a,Function);
            });
            it("should return an array with all terms",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum = M.sum(arr), ret = M.sum.harvestTerms(sum);
                expect(ret).to(eql,sum.terms);
            });
            it("should also collect from nested sums",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], sum1 = M.sum(arr1), 
                    arr2 = [M.val(4),M.val(5),sum1], sum2 = M.sum(arr2), ret = M.sum.harvestTerms(sum2);
                expect(ret.length).to(be,5);
                expect(M.equal(M.sum(ret),M.sum(Array.merge(arr1,[arr2[0],arr2[1]])))).to(be,true);
            });
            it("should only collect to the given depth",function(){
                var sum = M.sum([ M.val(1), M.sum([ M.val(2), M.sum([ M.val(3), M.sum([M.val(4),M.val(5)]) ]) ]) ]);
                expect(M.sum.harvestTerms(sum,1).length).to(be,3);
                expect(M.sum.harvestTerms(sum,2).length).to(be,4);
                expect(M.sum.harvestTerms(sum,0).length).to(be,2);
            });
        });
        describe("The flattenSum function",function(){
            it("should be defined",function(){
                expect(M.sum.flattenSum).to(be_a,Function);
            });
            it("should return sum including terms from all contained sums",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], sum1 = M.sum(arr1), 
                    arr2 = [M.val(4),M.val(5),sum1], sum2 = M.sum(arr2), ret = M.sum.flattenSum(sum2);
                expect(ret.terms.length).to(be,5);
                expect(M.equal(ret,M.sum(Array.merge(arr1,[arr2[0],arr2[1]])))).to(be,true);
            });
            it("should only flatten to the given depth",function(){
                var sum = M.sum([ M.val(1), M.sum([ M.val(2), M.sum([ M.val(3), M.sum([M.val(4),M.val(5)]) ]) ]) ]);
                expect(M.sum.flattenSum(sum,1).terms.length).to(be,3);
                expect(M.sum.flattenSum(sum,2).terms.length).to(be,4);
                expect(M.sum.flattenSum(sum,0).terms.length).to(be,2);
            });
        });
        describe("The removeZeroes function",function(){
            it("should be defined",function(){
                expect(M.sum.removeZeroes).to(be_a,Function);
            });
            it("should return the sum without zeroes",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum1 = M.sum(arr), sum2 = M.sum(Array.merge(arr,[M.val(0)]));
                expect(M.equal(M.sum.removeZeroes(sum2),sum1)).to(be,true);
                expect(M.equal(M.sum.removeZeroes(sum1),sum1)).to(be,true);
            });
        });
        describe("The equal function",function(){
            it("should be defined",function(){
                expect(M.sum.equal).to(be_a,Function);
            });
            it("should return false for two sums with different lengths",function(){
                var s1 = M.sum([M.val(1),M.val(2),M.val(3)]), s2 = M.sum([M.val(4),M.val(5)]), ret = M.sum.equal(s1,s2);
                expect(ret).to(be,false);
            });
            it("should return false for same lengths sums with different elements",function(){
                var s1 = M.sum([M.val(1),M.val(2)]), s2 = M.sum([M.val(4),M.val(5)]), ret = M.sum.equal(s1,s2);
                expect(ret).to(be,false);
            });
            it("should return true for sums with same elements",function(){
                var s1 = M.sum([M.val(1),M.val(2)]), s2 = M.sum([M.val(1),M.val(2)]), ret = M.sum.equal(s1,s2);
                expect(ret).to(be,true);
            });
            it("should return true for sums with same elements but different order",function(){
                var s1 = M.sum([M.val(1),M.val(2)]), s2 = M.sum([M.val(2),M.val(1)]), ret = M.sum.equal(s1,s2);
                expect(ret).to(be,true);
            });
        });
        describe("The adding function",function(){
            it("should be defined",function(){
                expect(M.sum.add).to(be_a,Function);
            });
            it("should if an argument is 0 return the other argument",function(){
                var item = {type:"foo"};
                expect(M.sum.add(M.val(0),item)).to(eql,item);
                expect(M.sum.add(item,M.val(0))).to(eql,item);
            });
            it("should merge two sums into a new sum with updated annotations",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], arr2 = [M.val(4),M.val(5),M.val(6)],
                    s1 = M.sum(arr1), s2 = M.sum(arr2), ret = M.sum.add(s1,s2);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"sum");
                expect(ret.terms.length).to(be,arr1.length+arr2.length);
                expect(ret.terms[0].val).to(be,arr1[0].val);
                expect(ret.terms[arr1.length-1].val).to(be,arr1[arr1.length-1].val);
                expect(ret.terms[arr1.length].val).to(be,arr2[0].val);
                expect(ret.terms[ret.terms.length-1].val).to(be,arr2[arr2.length-1].val);
                expect(ret.terms[arr1.length-1].positionInParent).to(be,"inlist");
                expect(ret.terms[arr1.length].positionInParent).to(be,"inlist");
            });
            it("should merge two incompatible items into a sum",function(){
                var a1 = {type: "testobj",val: 666}, a2 = {type: "testobj2",val: 667}, ret = M.sum.add(a1,a2);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"sum");
                expect(ret.terms[0].val).to(be,a1.val);
                expect(ret.terms[1].val).to(be,a2.val);
            });
            it("should merge a sum and an item into a sum with updated annotations and the item at the end",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum = M.sum(arr), 
                    item = {type: "testobj",val: 666}, ret = M.sum.add(sum,item);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"sum");
                expect(ret.terms.length).to(be,arr.length+1);
                expect(ret.terms[arr.length].val).to(be,item.val);
                expect(ret.terms[arr.length].positionInParent).to(be,"last");
                expect(ret.terms[arr.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.terms[arr.length-1].positionInParent).to(be,"inlist");
            });
            it("should merge an item and a sum into a sum with updated annotations and the item at the beginning",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum = M.sum(arr), 
                    item = {type: "testobj",val: 666}, ret = M.sum.add(item,sum);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"sum");
                expect(ret.terms.length).to(be,arr.length+1);
                expect(ret.terms[0].val).to(be,item.val);
                expect(ret.terms[0].positionInParent).to(be,"first");
                expect(ret.terms[1].val).to(be,arr[0].val);
                expect(ret.terms[ret.terms.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.terms[1].positionInParent).to(be,"inlist");
            });
            it("should merge a value into a sum if it already contains a value",function(){
                var arr = [M.val(3),{type:"foo"}], sum = M.sum(arr), item = M.val(4),
                    expected = M.sum([M.val(7),{type:"foo"}]);
                expect(M.equal(M.sum.add(sum,item),expected)).to(be,true);
                expect(M.equal(M.sum.add(item,sum),expected)).to(be,true);
            });
            it("should merge two values into a single value",function(){
                var v1 = M.val(666), v2 = M.val(-777), ret = M.sum.add(v1,v2);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"val");
                expect(ret.val).to(be,v1.val + v2.val);
            });
        });
    });
    describe("The prod class",function(){
        it("should have a constructor on M",function(){
            expect(M.prod).to(be_a,Function);
        });
        it("should inherit from M",function(){
            var x = M.prod([]);
            expect(x).to(be_an,M);
        });
        it("should have an id",function(){
            var x = M.prod([]);
            expect(x.id).to(be_a,Number);
        });
        it("should be a prod type object",function(){
            var x = M.prod([]);
            expect(x.type).to(be,"prod");
        });
        it("should not make a product if just 1 item in the array",function(){
            expect(M.prod([M.val(3)]).type).to(be,"val");
        });
        it("should have a factors array property",function(){
            var x = M.prod([]);
            expect(x.factors).to(be_an,Array);
        });
        it("should store copies of the value-made argument array in the factors property",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], x = M.prod(arr);
            expect(x.factors[0].val).to(be,arr[0].val);
            expect(x.factors[0].unit).to(eql,arr[0].unit);
            expect(x.factors[0] === arr[0]).to(be,false);
        });
        it("should annotate the included objects",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], x = M.prod(arr);
            expect(x.factors[0].parentType).to(be,"prod");
            expect(x.factors[0].roleInParent).to(be,"factor");
            expect(x.factors[0].positionInParent).to(be,"first");
            expect(x.factors[1].positionInParent).to(be,"inlist");
            expect(x.factors[arr.length-1].positionInParent).to(be,"last");
        });
        describe("The removeOnes function",function(){
            it("should be defined",function(){
                expect(M.prod.removeOnes).to(be_a,Function);
            });
            it("should return the prod without ones",function(){
                var arr = [M.val(2),M.val(3),M.val(4)], prod1 = M.prod(arr), prod2 = M.prod(Array.merge(arr,[M.val(1)]));
                expect(M.equal(M.prod.removeOnes(prod2),prod1)).to(be,true);
                expect(M.equal(M.prod.removeOnes(prod1),prod1)).to(be,true);
            });
        });
        describe("The calc function",function(){
            it("should be defined",function(){
                expect(M.prod.calc).to(be_a,Function);
            });
            it("should merge all vals into one",function(){
                var prod = M.prod([ M.val(2), M.val(3), M.val(5), M.prod([M.val(7),{type:"foo"}]), {type:"bar"} ]),
                    res = M.prod.calc(prod);
                expect(res).to(be_an,M);
                expect(res.type).to(be,"prod");
                expect(res.factors.length).to(be,3);
                expect(M.equal(M.prod([M.val(2*3*5*7),{type:"foo"},{type:"bar"}]),res)).to(be,true);
            });
            it("should merge two incompatible values into a prod",function(){
                var a1 = {type: "foo",val: 666}, a2 = {type: "bar",val: 667}, prod = M.prod([a1,a2]), ret = M.prod.calc(prod);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"prod");
                expect(ret.factors[0].val).to(be,a1.val);
                expect(ret.factors[1].val).to(be,a2.val);
            });
        });
        describe("The equal function",function(){
            it("should be defined",function(){
                expect(M.prod.equal).to(be_a,Function);
            });
            it("should return false for two prod with different lengths",function(){
                var p1 = M.prod([M.val(1),M.val(2),M.val(3)]), p2 = M.prod([M.val(4),M.val(5)]), ret = M.prod.equal(p1,p2);
                expect(ret).to(be,false);
            });
            it("should return false for same lengths prods with different elements",function(){
                var p1 = M.prod([M.val(1),M.val(2)]), p2 = M.prod([M.val(4),M.val(5)]), ret = M.prod.equal(p1,p2);
                expect(ret).to(be,false);
            });
            it("should return true for prods with same elements",function(){
                var p1 = M.prod([M.val(1),M.val(2)]), p2 = M.prod([M.val(1),M.val(2)]), ret = M.prod.equal(p1,p2);
                expect(ret).to(be,true);
            });
            it("should return true for prods with same elements but different order",function(){
                var p1 = M.prod([M.val(1),M.val(2)]), p2 = M.prod([M.val(2),M.val(1)]), ret = M.prod.equal(p1,p2);
                expect(ret).to(be,true);
            });
        });
        describe("The harvestFactors function",function(){
            it("should be defined",function(){
                expect(M.prod.harvestFactors).to(be_a,Function);
            });
            it("should return an array with all factors",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], prod = M.prod(arr), ret = M.prod.harvestFactors(prod);
                expect(ret).to(eql,prod.factors);
            });
            it("should also collect from nested prods",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], prod1 = M.prod(arr1), 
                    arr2 = [M.val(4),M.val(5),prod1], prod2 = M.prod(arr2), ret = M.prod.harvestFactors(prod2);
                expect(ret.length).to(be,5);
                expect(M.equal(M.prod(ret),M.prod(Array.merge(arr1,[arr2[0],arr2[1]])))).to(be,true);
            });
            it("should only collect to the given depth",function(){
                var prod = M.prod([ M.val(1), M.prod([ M.val(2), M.prod([ M.val(3), M.prod([M.val(4),M.val(5)]) ]) ]) ]);
                expect(M.prod.harvestFactors(prod,1).length).to(be,3);
                expect(M.prod.harvestFactors(prod,2).length).to(be,4);
                expect(M.prod.harvestFactors(prod,0).length).to(be,2);
            });
        });
        describe("The flattenProduct function",function(){
            it("should be defined",function(){
                expect(M.prod.flattenProduct).to(be_a,Function);
            });
            it("should return product including factors from all contained products",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], prod1 = M.prod(arr1), 
                    arr2 = [M.val(4),M.val(5),prod1], prod2 = M.prod(arr2), ret = M.prod.flattenProduct(prod2);
                expect(ret.factors.length).to(be,5);
                expect(M.equal(ret,M.prod(Array.merge(arr1,[arr2[0],arr2[1]])))).to(be,true);
            });
            it("should only flatten to the given depth",function(){
                var prod = M.prod([ M.val(1), M.prod([ M.val(2), M.prod([ M.val(3), M.prod([M.val(4),M.val(5)]) ]) ]) ]);
                expect(M.prod.flattenProduct(prod,1).factors.length).to(be,3);
                expect(M.prod.flattenProduct(prod,2).factors.length).to(be,4);
                expect(M.prod.flattenProduct(prod,0).factors.length).to(be,2);
            });
        });
        describe("The multiply function",function(){
            it("should be defined",function(){
                expect(M.prod.multiply).to(be_a,Function);
            });
            it("should merge two incompatible values into a prod",function(){
                var a1 = {type: "testobj",val: 666}, a2 = {type: "testobj2",val: 667}, ret = M.prod.multiply(a1,a2);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"prod");
                expect(ret.factors[0].val).to(be,a1.val);
                expect(ret.factors[1].val).to(be,a2.val);
            });
            it("should merge two prods into a new prod with updated annotations",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], arr2 = [M.val(4),M.val(5),M.val(6)],
                    p1 = M.prod(arr1), p2 = M.prod(arr2), ret = M.prod.multiply(p1,p2);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"prod");
                expect(ret.factors.length).to(be,arr1.length+arr2.length);
                expect(ret.factors[0].val).to(be,arr1[0].val);
                expect(ret.factors[arr1.length-1].val).to(be,arr1[arr1.length-1].val);
                expect(ret.factors[arr1.length].val).to(be,arr2[0].val);
                expect(ret.factors[ret.factors.length-1].val).to(be,arr2[arr2.length-1].val);
                expect(ret.factors[arr1.length-1].positionInParent).to(be,"inlist");
                expect(ret.factors[arr1.length].positionInParent).to(be,"inlist");
            });
            it("should merge a prod and an item into a prod with updated annotations and the item at the end",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], prod = M.prod(arr), 
                    item = {type: "testobj",val: 666}, ret = M.prod.multiply(prod,item);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"prod");
                expect(ret.factors.length).to(be,arr.length+1);
                expect(ret.factors[arr.length].val).to(be,item.val);
                expect(ret.factors[arr.length].positionInParent).to(be,"last");
                expect(ret.factors[arr.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.factors[arr.length-1].positionInParent).to(be,"inlist");
            });
            it("should merge an item and a prod into a prod with updated annotations and the item at the beginning",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], prod = M.prod(arr), 
                    item = {type: "testobj",val: 666}, ret = M.prod.multiply(item,prod);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"prod");
                expect(ret.factors.length).to(be,arr.length+1);
                expect(ret.factors[0].val).to(be,item.val);
                expect(ret.factors[0].positionInParent).to(be,"first");
                expect(ret.factors[1].val).to(be,arr[0].val);
                expect(ret.factors[ret.factors.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.factors[1].positionInParent).to(be,"inlist");
            });
            it("should return a zero if multiplying anything with a zero",function(){
                var ret = M.prod.multiply( M.val(0), M.val(4 ) );
                expect(ret.type).to(be,"val");
                expect(ret.unit).to(eql,M.val(0).unit);
                ret = M.prod.multiply( M.val(0), {type:"foo"} );
                expect(ret.type).to(be,"val");
                expect(ret.unit).to(eql,M.val(0).unit);
            });
            it("should the other argument alone if multiplying with 1",function(){
                expect(M.prod.multiply( M.val(1), {type:"foo"} ).type).to(be,"foo");
                expect(M.prod.multiply( {type:"foo"}, M.val(1) ).type).to(be,"foo");
            });
            it("should merge a sum and an item into a sum with all terms multiplied with the item from the right",function(){
                var v1 = M.val(3), v2 = M.val(4), v3 = {type:"foo"}, item = M.val(-3),
                    sum = M.sum([v1,v2,v3]), ret = M.prod.multiply(sum,item);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"sum");
                expect(ret.terms.length).to(be,sum.terms.length);
                expect(M.equal(M.prod.multiply(v1,item),ret.terms[0])).to(be,true);
                expect(M.equal(M.prod.multiply(v2,item),ret.terms[1])).to(be,true);
                expect(ret.terms[ret.terms.length-1].type).to(be,"prod");
                expect(ret.terms[ret.terms.length-1].factors[0].type).to(be,v3.type);                
                expect(M.equal(ret.terms[ret.terms.length-1].factors[1],item)).to(be,true);
              //  expect(M.sum.equal(ret,M.sum([M.prod.multiply(v1,item),M.prod.multiply(v2,item),M.prod.multiply(v3,item)]))).to(be,true);
            });
            it("should merge an item and a sum into a sum with all terms multiplied with the item from the left",function(){
                var v1 = M.val(3), v2 = M.val(4), v3 = {type:"foo"}, item = M.val(-3),
                    sum = M.sum([v1,v2,v3]), ret = M.prod.multiply(item,sum);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"sum");
                expect(ret.terms.length).to(be,sum.terms.length);
                expect(M.equal(M.prod.multiply(v1,item),ret.terms[0])).to(be,true);
                expect(M.equal(M.prod.multiply(v2,item),ret.terms[1])).to(be,true);
                expect(ret.terms[ret.terms.length-1].type).to(be,"prod");
                expect(ret.terms[ret.terms.length-1].factors[1].type).to(be,v3.type);                
                expect(M.equal(ret.terms[ret.terms.length-1].factors[0],item)).to(be,true);
              //  expect(M.sum.equal(ret,M.sum([M.prod.multiply(v1,item),M.prod.multiply(v2,item),M.prod.multiply(v3,item)]))).to(be,true);
            });
            it("should merge two sums into one, with each term in one multiplied with each term in the other",function(){
                var v1 = M.val(3), v2 = M.val(4), v3 = M.val(5), v4 = M.val(7),
                    sum1 = M.sum([v1,v2]), sum2 = M.sum([v3,v4]), ret = M.prod.multiply(sum1,sum2);
                expect(ret).to(be_an,M);
                expect(ret.type).to(be,"sum");
                expect(M.equal( ret.terms[0], M.prod.multiply(sum1.terms[0],sum2.terms[0]))).to(be,true);
                expect(M.equal( ret, M.sum([ M.prod.multiply(v1,v3),M.prod.multiply(v1,v4),M.prod.multiply(v2,v3),M.prod.multiply(v2,v4), ]) )).to(be,true);
            });
        });
    });
});