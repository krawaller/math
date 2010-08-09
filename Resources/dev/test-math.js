JSpec.describe("Math library",function(){
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
            it("should correctly clone nested objects",function(){
                var obj = {foo:"bar",fee:{bee:"moo"}};
                expect(Object.clone(obj)).to(eql,obj);
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
        describe("Array remove",function(){
            it("should be defined",function(){
                expect(Array.remove).to(be_a,Function);
            });
            it("should remove items at given positions",function(){
                var arr = ["a","b","c","d","e"], pos = [1,3], expected = ["a","c","e"];
                expect(Array.remove(arr,pos)).to(eql,expected);
            });
        });
        describe("Array insert",function(){
            it("should be defined",function(){
                expect(Array.insert).to(be_a,Function);
            });
            it("should insert new array at given position",function(){
                var arr = ["a","b","c","d","e"], newitems = ["x","y"];
                expect(Array.insert(arr,2,newitems)).to(eql,["a","b","x","y","c","d","e"]);
                expect(Array.insert(arr,0,newitems)).to(eql,["x","y","a","b","c","d","e"]);
                expect(Array.insert(arr,600,newitems)).to(eql,["a","b","c","d","e","x","y"]);
            });
        });
        describe("Array exchange",function(){
            it("should be defined",function(){
                expect(Array.exchange).to(be_a,Function);
            });
            it("should remove items at given positions, and insert new items at earliest removed pos",function(){
                var arr = ["a","b","c","d","e"], newitems = ["x","y"];
                expect(Array.exchange(arr,[1,3],newitems)).to(eql,["a","x","y","c","e"]);
                expect(Array.exchange(arr,[0,3,4],newitems)).to(eql,["x","y","b","c"]);
            });
        });
    });
    describe("The container class",function(){
        it("should be defined",function(){
            expect(M.cnt).to(be_a,Function);
        });
        it("should have an objs storage object",function(){
            var res = M.cnt();
            expect(res.objs).to(be_an,Object);
        });
        it("should have a history object",function(){
            var res = M.cnt();
            expect(res.hist).to(be_an,Object);
        });
        describe("The store function",function(){
            it("should be defined",function(){
                expect(M.cnt.store).to(be_a,Function);
            });
            it("should store an object in objs and make a history entry",function(){
                var cnt = M.cnt(), obj = M.val(cnt,7);
                cnt.step = 32;
                M.cnt.store(cnt,obj);
                expect(cnt.objs[obj.id]).to(eql,obj);
                expect(cnt.hist[obj.id][cnt.step]).to(eql,obj);
            });
        });
    });
    describe("The statement class",function(){
        it("should be defined",function(){
            expect(M.stmnt).to(be_a,Function);
        });
        it("should inherit from M.obj",function(){
            var cnt = M.cnt(), res = M.stmnt(cnt);
            expect(res).to(be_an,M.obj);
            expect(res.type).to(be,"stmnt");
        });
        it("should have an id",function(){
            var cnt = M.cnt(), res = M.stmnt(cnt);
            expect(res.id).to(be_a,Number);
        });
    });
    describe("The Placeholder class",function(){
        it("should have a constructor on M",function(){
            expect(M.plc).to(be_a,Function);
        });
        it("should inherit from M.obj",function(){
            var cnt = M.cnt(), res = M.plc(cnt);
            expect(res).to(be_an,M.obj);
            expect(res.type).to(be,"plc");
        });
        it("should have an id",function(){
            var cnt = M.cnt(), res = M.plc(cnt);
            expect(res.id).to(be_a,Number);
        });
    });
    describe("The obj abstract class",function(){
        it("should be defined",function(){
            expect(M.obj).to(be_a,Function);
        });
        it("should be a constructor",function(){
            var cnt = M.cnt(), res = M.obj(cnt);
            expect(res).to(be_an,M.obj);
            expect(res.type).to(be,"base");
            expect(res.constructor).to(be,M.obj);
        });
        it("should set a unique id on each object",function(){
            var cnt = M.cnt(), o1 = M.obj(cnt), o2 = M.obj(cnt);
            expect(o1.id).to(be_a,Number);
            expect(o1.id>0).to(be,true);
            expect(o2.id>o1.id).to(be,true);
        });
        it("should add a copy of the object to the container",function(){
            var cnt = M.cnt(), o1 = M.obj(cnt), o2 = M.obj(cnt);
            expect(cnt.objs).to(be_an,Object);
            expect(cnt.objs[o1.id]).to(eql,o1);
            expect(cnt.objs[o2.id]).to(eql,o2);
        });
        describe("The draw function",function(){
            it("should be defined",function(){
                expect(M.obj.draw).to(be_a,Function);
            });
            it("should return correct html",function(){
                var cnt = M.cnt(), o = M.obj(cnt,{type:"test"});
                expect(M.obj.draw(cnt,o)).to(be,"<div class='M_obj M_test' id='"+o.id+"'></div>");
            });
        });
        describe("The equal function",function(){
            it("should be defined",function(){
                expect(M.obj.equal).to(be_a,Function);
            });
            it("should return false for two items of different type",function(){
                expect(M.obj.equal({type:"foo"},{type:"bar"})).to(be,false);
            });
            it("should correctly compare values",function(){
                var cnt = M.cnt();
                expect(M.obj.equal(cnt,M.val(cnt,3),M.val(cnt,3))).to(be,true);
                expect(M.obj.equal(cnt,M.val(cnt,3),M.val(cnt,4))).to(be,false);
            });
            it("should correctly compare sums",function(){
                var cnt = M.cnt(), sum1 = M.sum(cnt), sum2 = M.sum(cnt);
                M.col.add(cnt,sum1,M.val(cnt,2));
                M.col.add(cnt,sum1,M.val(cnt,3));
                M.col.add(cnt,sum2,M.val(cnt,3));
                M.col.add(cnt,sum2,M.val(cnt,2));
                expect(M.obj.equal(cnt,sum1,sum2)).to(be,true);
                M.col.add(cnt,sum1,M.val(cnt,4));
                M.col.add(cnt,sum2,M.val(cnt,5));
                expect(M.obj.equal(cnt,sum1,sum2)).to(be,false);
            });/*
            it("should correctly compare products",function(){
                var arr = [M.val(2),M.val(3)];
                expect(M.obj.equal(M.prod(arr), M.prod(arr))).to(be,true);
                expect(M.obj.equal(M.prod(arr), M.prod(Array.merge(arr,[M.val(4)])))).to(be,false);
            }); */
        });
        describe("The calc function",function(){
            it("should be defined",function(){
                expect(M.obj.calc).to(be_a,Function);
            });
            it("should return values as they are",function(){
                var cnt = M.cnt(), val = M.val(cnt,32);
                expect(M.obj.calc(cnt,val)).to(eql,val);
            });
        });
    });
    
    describe("The Value class",function(){
        it("should have a constructor on M",function(){
            expect(M.val).to(be_a,Function);
        });
        it("should inherit from M.obj",function(){
            var cnt = M.cnt(), val = M.val(cnt,7);
            expect(val).to(be_an,M.obj);
        });
        it("should have an id",function(){
            var cnt = M.cnt(), val = M.val(cnt,7);
            expect(val.id).to(be_a,Number);
        });
        it("should have a val type and a val property",function(){
            var cnt = M.cnt(), val = M.val(cnt,7);
            expect(val.type).to(be,"val");
            expect(val.val).to(equal,7);
        });
        it("should add the object to the container",function(){
            var cnt = M.cnt(), o1 = M.val(cnt,{val:8});
            expect(cnt.objs).to(be_an,Object);
            expect(cnt.objs[o1.id]).to(eql,o1);
        });
        it("should be correctly drawn",function(){
            var cnt = M.cnt(), val = M.val(cnt,{val:7});
            expect(M.obj.draw(cnt,val)).to(be,"<div class='M_obj M_val' id='"+val.id+"'><span>7</span></div>");
        });
        describe("The equal function",function(){
            it("should be defined",function(){
                expect(M.val.equal).to(be_a,Function);
            });
            it("should return false for two values with different val",function(){
                var cnt = M.cnt(), v1 = M.val(cnt,7), v2 = M.val(cnt,9), ret = M.val.equal(cnt,v1,v2);
                expect(ret).to(be,false);
            });
        });
    });
    
    describe("The fraction class",function(){
        it("should have a constructor on M",function(){
            expect(M.frc).to(be_a,Function);
        });
        it("should inherit from M.obj",function(){
            var cnt = M.cnt(), frc = M.frc(cnt);
            expect(frc).to(be_an,M.obj);
        });
        it("should have an id",function(){
            var cnt = M.cnt(), frc = M.frc(cnt);
            expect(frc.id).to(be_a,Number);
        });
        it("should have a frc type",function(){
            var cnt = M.cnt(), frc = M.frc(cnt);
            expect(frc.type).to(be,"frc");
        });
        it("should add the object to the container",function(){
            var cnt = M.cnt(), o1 = M.frc(cnt);
            expect(cnt.objs).to(be_an,Object);
            expect(cnt.objs[o1.id]).to(eql,o1);
        });
        it("should have annotated placeholders set as numerator and denominator",function(){
            var cnt = M.cnt(), frc = M.frc(cnt);
            expect(cnt.objs[frc.num].type).to(be,"plc");
            expect(cnt.objs[frc.num].ppos).to(be,"num");
            expect(cnt.objs[frc.den].type).to(be,"plc");
            expect(cnt.objs[frc.den].ppos).to(be,"den");
        });
        it("should be correctly drawn",function(){
            var cnt = M.cnt(), frc = M.frc(cnt);
            expect(M.obj.draw(cnt,frc)).to(be,"<div class='M_obj M_frc' id='"+frc.id+"'>"+
                   "<div class='M_obj M_plc M_num' id='"+frc.num+"'></div>"+
                   "<div class='M_obj M_plc M_den' id='"+frc.den+"'></div>"+
                   "</div>");
        });
        describe("The setNumerator function",function(){
            it("should be defined",function(){
                expect(M.frc.setNumerator).to(be_a,Function);
            });
            it("should replace the placeholders with the item id:s, update container step and store col",function(){
                var cnt = M.cnt(), frc = M.frc(cnt);
                    p1 = cnt.objs[frc.num],
                    v1 = M.val(cnt,{val:1}), v2 = M.val(cnt,{val:2});
                expect(p1.type).to(be,"plc");
                M.frc.setNumerator(cnt,frc,v1);
                frc = cnt.objs[frc.id]; // needed?
                expect(M.obj.equal(cnt,cnt.objs[frc.num],v1)).to(be,true);
                expect(cnt.objs[frc.num].ppos).to(be,"num");
                M.frc.setNumerator(cnt,frc,v2);
                frc = cnt.objs[frc.id]; // needed?
                expect(M.obj.equal(cnt,cnt.objs[frc.num],v2)).to(be,true);
                var i=0;
                for(var p in cnt.hist[frc.id]){ i++ };
                expect(i).to(be,3);
            });
        });
        describe("The setDenominator function",function(){
            it("should be defined",function(){
                expect(M.frc.setDenominator).to(be_a,Function);
            });
            it("should replace the placeholders with the item id:s, update container step and store col",function(){
                var cnt = M.cnt(), frc = M.frc(cnt);
                    p1 = cnt.objs[frc.den],
                    v1 = M.val(cnt,{val:1}), v2 = M.val(cnt,{val:2});
                expect(p1.type).to(be,"plc");
                M.frc.setDenominator(cnt,frc,v1);
                frc = cnt.objs[frc.id]; // needed?
                expect(M.obj.equal(cnt,cnt.objs[frc.den],v1)).to(be,true);
                expect(cnt.objs[frc.den].ppos).to(be,"den");
                M.frc.setDenominator(cnt,frc,v2);
                frc = cnt.objs[frc.id]; // needed?
                expect(M.obj.equal(cnt,cnt.objs[frc.den],v2)).to(be,true);
                var i=0;
                for(var p in cnt.hist[frc.id]){ i++ };
                expect(i).to(be,3);
            });
        });
    });
    
    describe("The M.col abstract class constructor",function(){
        it("should be defined",function(){
            expect(M.col).to(be_a,Function);
        });
        it("should be a constructor, using the type in the arg object",function(){
            var cnt = M.cnt(), col = M.col(cnt,{type:"test"});
            expect(col).to(be_an,M.obj);
            expect(col.type).to(be,"test");
            expect(col.constructor).to(be,M.obj);
        });
    /*    it("should not create a collection if just 1 item in argument array",function(){ // TODO - rethink, only do on test
            expect(M.col({items:[M.val(3)]}).type).to(be,"val");
        }); */
        it("should create two placeholder objects and set these as children",function(){
            var cnt = M.cnt(), col = M.col(cnt,{type:"test"});
            expect(col.items.length).to(be,2);
            expect(cnt.objs[ col.items[0] ].type).to(be,"plc");
            expect(cnt.objs[ col.items[1] ].type).to(be,"plc");
        });
        it("should be correctly drawn",function(){
            var cnt = M.cnt(), col = M.col(cnt,{type:"col"});
            expect(M.obj.draw(cnt,col)).to(be,"<div class='M_obj M_col' id='"+col.id+"'><div class='M_obj M_plc M_first' id='"+cnt.objs[ col.items[0] ].id+"'></div><div class='M_obj M_plc M_last' id='"+cnt.objs[ col.items[1] ].id+"'></div></div>");
        });
        describe("The annotate function",function(){
            it("should be defined",function(){
                expect(M.col.annotate).to(be_a,Function);
            });
            it("should annotate the collection items",function(){
                var cnt = M.cnt(), v1 = M.val(cnt,{val:1}), v2 = M.val(cnt,{val:1}), v3 = M.val(cnt,{val:1}),
                    col = M.col(cnt,{type: "test"});
                col.items = [v1.id,v2.id,v3.id];
                M.col.annotate(cnt,col);
                expect(cnt.objs[v1.id].ppos).to(be,"first");
                expect(cnt.objs[v2.id].ppos).to(be,1);
                expect(cnt.objs[v3.id].ppos).to(be,"last");
            });
        });
        describe("The add function",function(){
            it("should be defined",function(){
                expect(M.col.add).to(be_a,Function);
            });
            it("should replace the placeholders with the item id:s, update container step and store col",function(){
                var cnt = M.cnt(), col = M.col(cnt,{type:"test"}),
                    p1 = cnt.objs[cnt.objs[col.id].items[0]],
                    p2 = cnt.objs[cnt.objs[col.id].items[1]],
                    v1 = M.val(cnt,{val:1}), v2 = M.val(cnt,{val:1}), v3 = M.val(cnt,{val:1});
                expect(p1.type).to(be,"plc");
                expect(p2.type).to(be,"plc");
                expect(col.items.length).to(be,2);
                M.col.add(cnt,col,v1,{replaceid:p2.id});
                col = cnt.objs[col.id];
                expect(col.items.length).to(be,2);
                expect(M.obj.equal(cnt,cnt.objs[col.items[0]],p1)).to(be,true);
                expect(M.obj.equal(cnt,cnt.objs[col.items[1]],v1)).to(be,true);
                M.col.add(cnt,col,v2);
                col = cnt.objs[col.id];
                expect(col.items.length).to(be,2);
                expect(M.obj.equal(cnt,cnt.objs[col.items[0]],v2)).to(be,true);
                expect(M.obj.equal(cnt,cnt.objs[col.items[1]],v1)).to(be,true);
                M.col.add(cnt,col,v3);
                col = cnt.objs[col.id];
                expect(col.items.length).to(be,3);
                expect(M.obj.equal(cnt,cnt.objs[col.items[0]],v2)).to(be,true);
                expect(M.obj.equal(cnt,cnt.objs[col.items[1]],v1)).to(be,true);
                expect(M.obj.equal(cnt,cnt.objs[col.items[2]],v3)).to(be,true);
                var i=0;
                for(var p in cnt.hist[col.id]){ i++ };
                expect(i).to(be,4);
            });
        });
        
/*
        
        it("should store copies of the value-made argument array in the items property",function(){
            var cnt = M.cnt(), arr = [M.val({cnt:cnt,val:1}),M.val({cnt:cnt,val:1}),M.val({cnt:cnt,val:1})],
                col = M.col({items:arr,type:"test"});
                
            var arr = [M.val(1),M.val(2),M.val(3)], col = M.col({items:arr,type:"test"});
            expect(col.items.length).to(be,arr.length);
            expect(col.items[0].val).to(be,arr[0].val);
            expect(col.items[0] === arr[0]).to(be,false);
        });
        it("should annotate the included objects",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], col = M.col({items:arr,type:"test"});
            expect(col.items[0].parentType).to(be,"test");
            expect(col.items[0].positionInParent).to(be,"first");
            expect(col.items[1].positionInParent).to(be,1);
            expect(col.items[arr.length-1].positionInParent).to(be,"last");
        });
        it("should add the object to the statement if provided",function(){
            var cnt = M.cnt(), arr = [M.val(1),M.val(2),M.val(3)], col = M.col({items:arr,type:"test",cnt:cnt});
            expect(cnt.objs).to(be_an,Object);
            expect(cnt.objs[col.id]).to(eql,col);
        });
        describe("The harvestItems function",function(){
            it("should be defined",function(){
                expect(M.col.harvestItems).to(be_a,Function);
            });
            it("should return an array with all terms",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum = M.sum(arr), ret = M.col.harvestItems(sum);
                expect(ret).to(eql,sum.items);
            });
            it("should also collect from nested sums",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], sum1 = M.sum(arr1), 
                    arr2 = [M.val(4),M.val(5),sum1], sum2 = M.sum(arr2), ret = M.col.harvestItems(sum2);
                expect(ret.length).to(be,5);
                expect(M.obj.equal(M.sum(ret),M.sum(Array.merge(arr1,[arr2[0],arr2[1]])))).to(be,true);
            });
            it("should only collect to the given depth",function(){
                var sum = M.sum([ M.val(1), M.sum([ M.val(2), M.sum([ M.val(3), M.sum([M.val(4),M.val(5)]) ]) ]) ]);
                expect(M.col.harvestItems(sum,1).length).to(be,3);
                expect(M.col.harvestItems(sum,2).length).to(be,4);
                expect(M.col.harvestItems(sum,0).length).to(be,2);
            });
        });
    });

    describe("The sum class",function(){
        it("should have a constructor on M",function(){
            expect(M.sum).to(be_a,Function);
        });
        it("should inherit from M",function(){
            var x = M.sum([]);
            expect(x).to(be_an,M.obj);
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
            expect(x.items).to(be_an,Array);
        });
        it("should not create a sum if not more than 1 item in argument array",function(){
            expect(M.sum([M.val(3)]).type).to(be,"val");
        });
        it("should store copies of the value-made argument array in the terms property",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], x = M.sum(arr);
            expect(x.items[0].val).to(be,arr[0].val);
            expect(x.items[0].unit).to(eql,arr[0].unit);
            expect(x.items[0] === arr[0]).to(be,false);
        });
        it("should annotate the included objects",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], x = M.sum(arr);
            expect(x.items[0].parentType).to(be,"sum");
            expect(x.items[0].positionInParent).to(be,"first");
            expect(x.items[0].parentId).to(be,x.id);
            expect(x.items[1].positionInParent).to(be,1);
            expect(x.items[arr.length-1].positionInParent).to(be,"last");
        });
        it("should add the object to the statement if provided",function(){
            var cnt = M.cnt(), arr = [M.val(1),M.val(2),M.val(3)], sum = M.sum({items:arr,cnt:cnt});
            expect(cnt.objs).to(be_an,Object);
            expect(cnt.objs[sum.id]).to(eql,sum);
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
                expect(res.items.length).to(be,2);
            });
            it("should merge all equal non-value items into a product",function(){
                var foo = {type: "foo"}, bar = {type: "bar"}, arr = [M.val(2),M.val(3),foo,foo,foo,bar,foo],
                    sum = M.sum(arr), res = M.sum.calc(sum);
                expect(res).to(be_an,M.obj);
                expect(res.type).to(be,"sum");
                expect(res.items.length).to(be,3);
                expect( M.obj.equal(res, M.sum([M.val(5),M.prod([M.val(4),foo]),bar])) ).to(be,true);
            });
        });
        describe("The flattenSum function",function(){
            it("should be defined",function(){
                expect(M.sum.flattenSum).to(be_a,Function);
            });
            it("should return sum including terms from all contained sums",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], sum1 = M.sum(arr1), 
                    arr2 = [M.val(4),M.val(5),sum1], sum2 = M.sum(arr2), ret = M.sum.flattenSum(sum2);
                expect(ret.items.length).to(be,5);
                expect(M.obj.equal(ret,M.sum(Array.merge(arr1,[arr2[0],arr2[1]])))).to(be,true);
            });
            it("should only flatten to the given depth",function(){
                var sum = M.sum([ M.val(1), M.sum([ M.val(2), M.sum([ M.val(3), M.sum([M.val(4),M.val(5)]) ]) ]) ]);
                expect(M.sum.flattenSum(sum,1).items.length).to(be,3);
                expect(M.sum.flattenSum(sum,2).items.length).to(be,4);
                expect(M.sum.flattenSum(sum,0).items.length).to(be,2);
            });
        });
        describe("The removeZeroes function",function(){
            it("should be defined",function(){
                expect(M.sum.removeZeroes).to(be_a,Function);
            });
            it("should return the sum without zeroes",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum1 = M.sum(arr), sum2 = M.sum(Array.merge(arr,[M.val(0)]));
                expect(M.obj.equal(M.sum.removeZeroes(sum2),sum1)).to(be,true);
                expect(M.obj.equal(M.sum.removeZeroes(sum1),sum1)).to(be,true);
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
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"sum");
                expect(ret.items.length).to(be,arr1.length+arr2.length);
                expect(ret.items[0].val).to(be,arr1[0].val);
                expect(ret.items[arr1.length-1].val).to(be,arr1[arr1.length-1].val);
                expect(ret.items[arr1.length].val).to(be,arr2[0].val);
                expect(ret.items[ret.items.length-1].val).to(be,arr2[arr2.length-1].val);
                expect(ret.items[arr1.length-1].positionInParent).to(be,arr1.length-1);
                expect(ret.items[arr1.length].positionInParent).to(be,arr1.length);
            });
            it("should merge two incompatible items into a sum",function(){
                var a1 = {type: "testobj",val: 666}, a2 = {type: "testobj2",val: 667}, ret = M.sum.add(a1,a2);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"sum");
                expect(ret.items[0].val).to(be,a1.val);
                expect(ret.items[1].val).to(be,a2.val);
            });
            it("should merge a sum and an item into a sum with updated annotations and the item at the end",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum = M.sum(arr), 
                    item = {type: "testobj",val: 666}, ret = M.sum.add(sum,item);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"sum");
                expect(ret.items.length).to(be,arr.length+1);
                expect(ret.items[arr.length].val).to(be,item.val);
                expect(ret.items[arr.length].positionInParent).to(be,"last");
                expect(ret.items[arr.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.items[arr.length-1].positionInParent).to(be,arr.length-1);
            });
            it("should merge an item and a sum into a sum with updated annotations and the item at the beginning",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], sum = M.sum(arr), 
                    item = {type: "testobj",val: 666}, ret = M.sum.add(item,sum);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"sum");
                expect(ret.items.length).to(be,arr.length+1);
                expect(ret.items[0].val).to(be,item.val);
                expect(ret.items[0].positionInParent).to(be,"first");
                expect(ret.items[1].val).to(be,arr[0].val);
                expect(ret.items[ret.items.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.items[1].positionInParent).to(be,1);
            });
            it("should merge a value into a sum if it already contains a value",function(){
                var arr = [M.val(3),{type:"foo"}], sum = M.sum(arr), item = M.val(4),
                    expected = M.sum([M.val(7),{type:"foo"}]);
                expect(M.obj.equal(M.sum.add(sum,item),expected)).to(be,true);
                expect(M.obj.equal(M.sum.add(item,sum),expected)).to(be,true);
            });
            it("should merge two values into a single value",function(){
                var v1 = M.val(666), v2 = M.val(-777), ret = M.sum.add(v1,v2);
                expect(ret).to(be_an,M.obj);
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
            expect(x).to(be_an,M.obj);
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
            expect(x.items).to(be_an,Array);
        });
        it("should store copies of the value-made argument array in the factors property",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], x = M.prod(arr);
            expect(x.items[0].val).to(be,arr[0].val);
            expect(x.items[0].unit).to(eql,arr[0].unit);
            expect(x.items[0] === arr[0]).to(be,false);
        });
        it("should annotate the included objects",function(){
            var arr = [M.val(1),M.val(2),M.val(3)], x = M.prod(arr);
            expect(x.items[0].parentType).to(be,"prod");
            expect(x.items[0].parentId).to(be,x.id);
            expect(x.items[0].positionInParent).to(be,"first");
            expect(x.items[1].positionInParent).to(be,1);
            expect(x.items[arr.length-1].positionInParent).to(be,"last");
        });
        it("should add the object to the container if provided",function(){
            var cnt = M.cnt(), arr = [M.val(1),M.val(2),M.val(3)], prod = M.prod({items:arr,cnt:cnt});
            expect(cnt.objs).to(be_an,Object);
            expect(cnt.objs[prod.id]).to(eql,prod);
        });
        describe("The removeOnes function",function(){
            it("should be defined",function(){
                expect(M.prod.removeOnes).to(be_a,Function);
            });
            it("should return the prod without ones",function(){
                var arr = [M.val(2),M.val(3),M.val(4)], prod1 = M.prod(arr), prod2 = M.prod(Array.merge(arr,[M.val(1)]));
                expect(M.obj.equal(M.prod.removeOnes(prod2),prod1)).to(be,true);
                expect(M.obj.equal(M.prod.removeOnes(prod1),prod1)).to(be,true);
            });
        });
        describe("The calc function",function(){
            it("should be defined",function(){
                expect(M.prod.calc).to(be_a,Function);
            });
            it("should merge all vals into one",function(){
                var prod = M.prod([ M.val(2), M.val(3), M.val(5), M.prod([M.val(7),{type:"foo"}]), {type:"bar"} ]),
                    res = M.prod.calc(prod);
                expect(res).to(be_an,M.obj);
                expect(res.type).to(be,"prod");
                expect(res.items.length).to(be,3);
                expect(M.obj.equal(M.prod([M.val(2*3*5*7),{type:"foo"},{type:"bar"}]),res)).to(be,true);
            });
            it("should merge two incompatible values into a prod",function(){
                var a1 = {type: "foo",val: 666}, a2 = {type: "bar",val: 667}, prod = M.prod([a1,a2]), ret = M.prod.calc(prod);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"prod");
                expect(ret.items[0].val).to(be,a1.val);
                expect(ret.items[1].val).to(be,a2.val);
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
        describe("The flattenProduct function",function(){
            it("should be defined",function(){
                expect(M.prod.flattenProduct).to(be_a,Function);
            });
            it("should return product including factors from all contained products",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], prod1 = M.prod(arr1), 
                    arr2 = [M.val(4),M.val(5),prod1], prod2 = M.prod(arr2), ret = M.prod.flattenProduct(prod2);
                expect(ret.items.length).to(be,5);
                expect(M.obj.equal(ret,M.prod(Array.merge(arr1,[arr2[0],arr2[1]])))).to(be,true);
            });
            it("should only flatten to the given depth",function(){
                var prod = M.prod([ M.val(1), M.prod([ M.val(2), M.prod([ M.val(3), M.prod([M.val(4),M.val(5)]) ]) ]) ]);
                expect(M.prod.flattenProduct(prod,1).items.length).to(be,3);
                expect(M.prod.flattenProduct(prod,2).items.length).to(be,4);
                expect(M.prod.flattenProduct(prod,0).items.length).to(be,2);
            });
        });
        describe("The multiply function",function(){
            it("should be defined",function(){
                expect(M.prod.multiply).to(be_a,Function);
            });
            it("should merge two incompatible values into a prod",function(){
                var a1 = {type: "testobj",val: 666}, a2 = {type: "testobj2",val: 667}, ret = M.prod.multiply(a1,a2);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"prod");
                expect(ret.items[0].val).to(be,a1.val);
                expect(ret.items[1].val).to(be,a2.val);
            });
            it("should merge two prods into a new prod with updated annotations",function(){
                var arr1 = [M.val(1),M.val(2),M.val(3)], arr2 = [M.val(4),M.val(5),M.val(6)],
                    p1 = M.prod(arr1), p2 = M.prod(arr2), ret = M.prod.multiply(p1,p2);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"prod");
                expect(ret.items.length).to(be,arr1.length+arr2.length);
                expect(ret.items[0].val).to(be,arr1[0].val);
                expect(ret.items[arr1.length-1].val).to(be,arr1[arr1.length-1].val);
                expect(ret.items[arr1.length].val).to(be,arr2[0].val);
                expect(ret.items[ret.items.length-1].val).to(be,arr2[arr2.length-1].val);
                expect(ret.items[arr1.length-1].positionInParent).to(be,arr1.length-1);
                expect(ret.items[arr1.length].positionInParent).to(be,arr1.length);
            });
            it("should merge a prod and an item into a prod with updated annotations and the item at the end",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], prod = M.prod(arr), 
                    item = {type: "testobj",val: 666}, ret = M.prod.multiply(prod,item);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"prod");
                expect(ret.items.length).to(be,arr.length+1);
                expect(ret.items[arr.length].val).to(be,item.val);
                expect(ret.items[arr.length].positionInParent).to(be,"last");
                expect(ret.items[arr.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.items[arr.length-1].positionInParent).to(be,arr.length-1);
            });
            it("should merge an item and a prod into a prod with updated annotations and the item at the beginning",function(){
                var arr = [M.val(1),M.val(2),M.val(3)], prod = M.prod(arr), 
                    item = {type: "testobj",val: 666}, ret = M.prod.multiply(item,prod);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"prod");
                expect(ret.items.length).to(be,arr.length+1);
                expect(ret.items[0].val).to(be,item.val);
                expect(ret.items[0].positionInParent).to(be,"first");
                expect(ret.items[1].val).to(be,arr[0].val);
                expect(ret.items[ret.items.length-1].val).to(be,arr[arr.length-1].val);
                expect(ret.items[1].positionInParent).to(be,1);
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
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"sum");
                expect(ret.items.length).to(be,sum.items.length);
                expect(M.obj.equal(M.prod.multiply(v1,item),ret.items[0])).to(be,true);
                expect(M.obj.equal(M.prod.multiply(v2,item),ret.items[1])).to(be,true);
                expect(ret.items[ret.items.length-1].type).to(be,"prod");
                expect(ret.items[ret.items.length-1].items[0].type).to(be,v3.type);                
                expect(M.obj.equal(ret.items[ret.items.length-1].items[1],item)).to(be,true);
              //  expect(M.sum.equal(ret,M.sum([M.prod.multiply(v1,item),M.prod.multiply(v2,item),M.prod.multiply(v3,item)]))).to(be,true);
            });
            it("should merge an item and a sum into a sum with all terms multiplied with the item from the left",function(){
                var v1 = M.val(3), v2 = M.val(4), v3 = {type:"foo"}, item = M.val(-3),
                    sum = M.sum([v1,v2,v3]), ret = M.prod.multiply(item,sum);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"sum");
                expect(ret.items.length).to(be,sum.items.length);
                expect(M.obj.equal(M.prod.multiply(v1,item),ret.items[0])).to(be,true);
                expect(M.obj.equal(M.prod.multiply(v2,item),ret.items[1])).to(be,true);
                expect(ret.items[ret.items.length-1].type).to(be,"prod");
                expect(ret.items[ret.items.length-1].items[1].type).to(be,v3.type);                
                expect(M.obj.equal(ret.items[ret.items.length-1].items[0],item)).to(be,true);
              //  expect(M.sum.equal(ret,M.sum([M.prod.multiply(v1,item),M.prod.multiply(v2,item),M.prod.multiply(v3,item)]))).to(be,true);
            });
            it("should merge two sums into one, with each term in one multiplied with each term in the other",function(){
                var v1 = M.val(3), v2 = M.val(4), v3 = M.val(5), v4 = M.val(7),
                    sum1 = M.sum([v1,v2]), sum2 = M.sum([v3,v4]), ret = M.prod.multiply(sum1,sum2);
                expect(ret).to(be_an,M.obj);
                expect(ret.type).to(be,"sum");
                expect(M.obj.equal( ret.items[0], M.prod.multiply(sum1.items[0],sum2.items[0]))).to(be,true);
                expect(M.obj.equal( ret, M.sum([ M.prod.multiply(v1,v3),M.prod.multiply(v1,v4),M.prod.multiply(v2,v3),M.prod.multiply(v2,v4), ]) )).to(be,true);
            });
        });
        */
    });
});