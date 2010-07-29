JSpec.describe("Math library",function(){
    describe("The object",function(){
        it("should be defined",function(){
            expect(M).to(be_an,Object);
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
        it("should be a val type object",function(){
            var x = M.val(7);
            expect(x).to(be_an,Object);
            expect(x.type).to(be,"val");
        });
        it("should have a val property",function(){
            var x = M.val(7);
            expect(x.val).to(equal,7);
        });
        it("should use default unit 'NUMBER' if only a value is provided, to the power of 1",function(){
            var x = M.val(7);
            expect(x.unit).to(be_an,Object);
            expect(x.unit.NUMBER).to(be,1);
        });
        it("should use given unit to the power of 1 if only a unit name is provided",function(){
            var x = M.val(7,"x");
            expect(x.unit).to(be_an,Object);
            expect(x.unit.NUMBER).to(be_undefined);
            expect(x.unit.x).to(be,1);
        });
        it("should use given unit object",function(){
            var unit = {"x":3,"y":1}, x = M.val(7,unit);
            expect(x.unit).to(equal,unit);
        });
        describe("The calc function",function(){
            before_each(function(){
                x = M.val(7);
            });
            it("should be defined",function(){
                expect(x.calc).to(be_a,Function);
            });
            it("should return the val/unit object",function(){
                var res = x.calc();
                expect(res.val).to(equal,7);
                expect(res.unit.NUMBER).to(equal,1);
            });
        });
        describe("The compareUnits function",function(){
            it("should be defined",function(){
                expect(M.val.compareUnits).to(be_a,Function);
            });
            it("should return false for two non-values",function(){
                expect(M.val.compareUnits()).to(be,false);
                expect(M.val.compareUnits(1,{foo:"bar"})).to(be,false);
                expect(M.val.compareUnits(M.val(3),M.sum([M.val(2),M.val(3)]))).to(be,false);
            });
            it("should return false for two values with different units",function(){
                expect(M.val.compareUnits(M.val(2,"x"),M.val(2,"y"))).to(be,false);
                expect(M.val.compareUnits(M.val(2,{"x":2}),M.val(2,{"x":3}))).to(be,false);
                expect(M.val.compareUnits(M.val(2,{"x":3,"y":5}),M.val(2,{"x":3}))).to(be,false);
                expect(M.val.compareUnits(M.val(2,{"x":3}),M.val(2,{"x":3,"y":5}))).to(be,false);
            });
            it("should return true for two values with same unit",function(){
                expect(M.val.compareUnits(M.val(2,"z"),M.val(3,"z"))).to(be,true);
                expect(M.val.compareUnits(M.val(2,{"x":3}),M.val(3,{"x":3}))).to(be,true);
            });
        });
    });
    describe("The sum class",function(){
        it("should have a constructor on M",function(){
            expect(M.sum).to(be_a,Function);
        });
        it("should be a sum type object",function(){
            var x = M.sum([]);
            expect(x).to(be_an,Object);
            expect(x.type).to(be,"sum");
        });
        it("should have a terms array property",function(){
            var x = M.sum([]);
            expect(x.terms).to(be_an,Array);
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
        describe("The adding function",function(){
            it("should be defined",function(){
                expect(M.sum.add).to(be_a,Function);
            });
            it("should merge two sums into a new sum with updated annotations",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], arr2 = [M.val(4),M.val(5),M.val(6)],
                    s1 = M.sum(arr1), s2 = M.sum(arr2), ret = M.sum.add(s1,s2);
                expect(ret).to(be_an,Object);
                expect(ret.type).to(be,"sum");
                expect(ret.terms.length).to(be,arr1.length+arr2.length);
                expect(ret.terms[0].val).to(be,arr1[0].val);
                expect(ret.terms[arr1.length-1].val).to(be,arr1[arr1.length-1].val);
                expect(ret.terms[arr1.length].val).to(be,arr2[0].val);
                expect(ret.terms[ret.terms.length-1].val).to(be,arr2[arr2.length-1].val);
                expect(ret.terms[arr1.length-1].positionInParent).to(be,"inlist");
                expect(ret.terms[arr1.length].positionInParent).to(be,"inlist");
            });
            it("should merge two incompatible values into a sum",function(){
                var a1 = {type: "testobj",val: 666}, a2 = {type: "testobj2",val: 667}, ret = M.sum.add(a1,a2);
                expect(ret).to(be_an,Object);
                expect(ret.type).to(be,"sum");
                expect(ret.terms[0].val).to(be,a1.val);
                expect(ret.terms[1].val).to(be,a2.val);
            });
            it("should merge a sum and an item into a sum with updated annotations and the item at the end",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum = M.sum(arr), 
                    item = {type: "testobj",val: 666}, ret = M.sum.add(sum,item);
                expect(ret).to(be_an,Object);
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
                expect(ret).to(be_an,Object);
                expect(ret.type).to(be,"sum");
                expect(ret.terms.length).to(be,arr.length+1);
                expect(ret.terms[0].val).to(be,item.val);
                expect(ret.terms[0].positionInParent).to(be,"first");
                expect(ret.terms[1].val).to(be,arr[0].val);
                expect(ret.terms[ret.terms.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.terms[1].positionInParent).to(be,"inlist");
            });
            it("should merge two values with same unit into a single value",function(){
                var v1 = M.val(666,{g:7}), v2 = M.val(-777,{g:7}), ret = M.sum.add(v1,v2);
                expect(ret).to(be_an,Object);
                expect(ret.type).to(be,"val");
                expect(M.val.compareUnits(v1,ret)).to(be,true);
                expect(ret.val).to(be,v1.val + v2.val);
            });
        });
    });
    describe("The prod class",function(){
        it("should have a constructor on M",function(){
            expect(M.prod).to(be_a,Function);
        });
        it("should be a prod type object",function(){
            var x = M.prod([]);
            expect(x).to(be_an,Object);
            expect(x.type).to(be,"prod");
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
    });
});