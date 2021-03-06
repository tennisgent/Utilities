describe('Array', function(){
    var objects, numbers, strings, mixed, result, expected;

	beforeEach(function(){
		objects = [ //length = 4
			{key1: 'value1', key2: 'value2', key3: 'value3'},
			{key1: 'value2', key2: 'value3', key3: 'value1'},
			{key1: 'value3', key2: 'value1', key3: 'value2'},
			{key1: 'value2', key2: 'value3', key3: 'value1'}
		];
		numbers = [1,2,3,4,5,6,7,8,9,1.1,1.2,1.3,1.4,1.5,4]; // length = 15
		strings = ['string1','string2','string3','string4','string4','string5']; // length = 6
		mixed = [1,'string1',{key1: 'value1'},5,'string2',{key2: 'value2'},5]; // length = 7
	});

    describe('.each()', function () {
		var array, spy, falsy = null;

		beforeEach(function(){
		    array = [{key:'value1'},{key:'value2'},{key:'value3'},{key:'value4'}];
			spy = jasmine.createSpyObj('spy',['callback']);
		});

		it('should return the array if the array is falsy', function(){
		    var res = Array.each(falsy, spy.callback);
			expect(res).toEqual(falsy);
		});

		it('should return the array if a falsy callback is given', function(){
			var res = Array.each(array, falsy);
			expect(res).toEqual(array);
		});
		
		it('should call the callback function for each item in the array', function(){
		    Array.each(array, spy.callback);
			expect(spy.callback.calls.count()).toEqual(array.length);
		});

		it('should pass each item in the array as the first parameter to the callback', function(){
			Array.each(array, spy.callback);
			for(var i=0; i<array.length; i++){
				expect(spy.callback.calls.argsFor(i)).toContain(array[i]);
			}
		});

		it('should pass the index for each item in the array as the second parameter to the callback', function(){
			Array.each(array, spy.callback);
			for(var i=0; i<array.length; i++){
				expect(spy.callback.calls.argsFor(i)).toContain(i);
			}
		});

		it('should break out of the loop if the callback returns false', function(){
			spy.callback2 = function(item, index){
				if(index >= 2){
					return false;
				}
			};
			spyOn(spy, 'callback2').and.callThrough();
		    Array.each(array, spy.callback2);
			expect(spy.callback2.calls.count()).toEqual(3);
			expect(spy.callback2.calls.count()).toBeLessThan(array.length);
		});

    });

	describe('.copy()', function () {
		var array;

		beforeEach(function(){
		    array = [{key:'value1'},{key:'value2'},{key:'value3'},{key:'value4'}];
		});

		it('should return the original array if JSON is not defined', function(){
		    var json = JSON;
			JSON = undefined;
			var copy = Array.copy(array);
			expect(copy).toBe(array);
			JSON = json;
		});

		it('should return a new object reference', function(){
			var copy = Array.copy(array);
			expect(copy).not.toBe(array);
			expect(copy).toEqual(array);
		});

		it('should return an array that has the same length as the original', function(){
			var copy = Array.copy(array);
			expect(copy.length).toEqual(array.length);
		});

		it('should return new object references for every item in the array', function(){
			var copy = Array.copy(array);
			for(var i=0; i<array.length; i++){
				expect(copy[i]).not.toBe(array[i]);
				expect(copy[i]).toEqual(array[i]);
			}
		});
	});

    describe('.find()', function(){

		describe('basic', function () {

			it('should return an array if the filter matches', function(){
				result = Array.find(numbers, 1);
				expect(result).toEqual(jasmine.any(Array));

				result = Array.find(numbers, 1.3);
				expect(result).toEqual(jasmine.any(Array));

				result = Array.find(numbers, 4);
				expect(result).toEqual(jasmine.any(Array));

				result = Array.find(strings, 'string2');
				expect(result).toEqual(jasmine.any(Array));

				result = Array.find(strings, 'string4');
				expect(result).toEqual(jasmine.any(Array));

				result = Array.find(mixed, 1);
				expect(result).toEqual(jasmine.any(Array));

				result = Array.find(mixed, 'string2');
				expect(result).toEqual(jasmine.any(Array));
			});

			it('should return null if the filter does not match', function(){
				result = Array.find(numbers, 100);
				expect(result).toBeNull();

				result = Array.find(numbers, 12.34);
				expect(result).toBeNull();

				result = Array.find(strings, 'string7');
				expect(result).toBeNull();

				result = Array.find(mixed, 10);
				expect(result).toBeNull();

				result = Array.find(mixed, 'string7');
				expect(result).toBeNull();
			});

			it('should find all elements in the array where the simple filter matches', function(){
				result = Array.find(numbers, 1);
				expected = [1];
				expect(result).toEqual(expected);

				result = Array.find(numbers, 1.3);
				expected = [1.3];
				expect(result).toEqual(expected);

				result = Array.find(numbers, 4);
				expected = [4, 4];
				expect(result).toEqual(expected);

				result = Array.find(strings, 'string2');
				expected = ['string2'];
				expect(result).toEqual(expected);

				result = Array.find(strings, 'string4');
				expected = ['string4','string4'];
				expect(result).toEqual(expected);

				result = Array.find(mixed, 1);
				expected = [1];
				expect(result).toEqual(expected);

				result = Array.find(mixed, 'string2');
				expected = ['string2'];
				expect(result).toEqual(expected);
			});

			it('should find all elements in the array where all keys in the filter object match', function(){
				result = Array.find(objects, {key2: 'value2'});
				expected = [objects[0]];
				expect(result).toEqual(expected);

				result = Array.find(objects, {key2: 'value1', key3: 'value2'});
				expected = [objects[2]];
				expect(result).toEqual(expected);

				result = Array.find(objects, {key1: 'value2'});
				expected = [objects[1],objects[3]];
				expect(result).toEqual(expected);
			});

			it('should return null if the filter object does not match', function(){
				result = Array.find(objects, {key2: 'value5'});
				expect(result).toBeNull();

				result = Array.find(objects, {key2: 'value1', key3: 'value5'});
				expect(result).toBeNull();

				result = Array.find(objects, {key1: 'value5'});
				expect(result).toBeNull();
			});

		});

		describe('onlyOne', function () {

			it('should return the first matching result for simple filters', function(){
				result = Array.find(numbers, 1, true);
				expected = 1;
				expect(result).toEqual(expected);

				result = Array.find(numbers, 1.3, true);
				expected = 1.3;
				expect(result).toEqual(expected);

				result = Array.find(numbers, 4, true);
				expected = 4;
				expect(result).toEqual(expected);

				result = Array.find(strings, 'string2', true);
				expected = 'string2';
				expect(result).toEqual(expected);

				result = Array.find(strings, 'string4', true);
				expected = 'string4';
				expect(result).toEqual(expected);

				result = Array.find(mixed, 1, true);
				expected = 1;
				expect(result).toEqual(expected);

				result = Array.find(mixed, 'string2', true);
				expected = 'string2';
				expect(result).toEqual(expected);
			});

		});

		describe('indexes', function () {

			it('should return the index of the first matching result for simple filters', function(){
				result = Array.find(numbers, 1.5, false, true);
				expected = [numbers.indexOf(1.5)];
				expect(result).toEqual(expected);

				result = Array.find(numbers, 5, false, true);
				expected = [numbers.indexOf(5)];
				expect(result).toEqual(expected);

				result = Array.find(numbers, 4, false, true);
				expected = [numbers.indexOf(4), numbers.length-1];
				expect(result).toEqual(expected);

				result = Array.find(strings, 'string2', false, true);
				expected = [strings.indexOf('string2')];
				expect(result).toEqual(expected);

				result = Array.find(strings, 'string4', false, true);
				expected = [strings.indexOf('string4'), strings.lastIndexOf('string4')];
				expect(result).toEqual(expected);

				result = Array.find(mixed, 1, false, true);
				expected = [mixed.indexOf(1)];
				expect(result).toEqual(expected);

				result = Array.find(mixed, 'string2', false, true);
				expected = [mixed.indexOf('string2')];
				expect(result).toEqual(expected);
			});

		});

    });

    describe('.findOne()', function(){
        var array, filter;

        beforeEach(function(){
            array = [];
			filter = {};
			spyOn(Array, 'find');
        });

		it('should find the matching filters in the source array with caseInsensitive flag as true', function(){
			Array.findOne(array, filter, true);
			expect(Array.find).toHaveBeenCalledWith(array, filter, true, false, true);
		});

		it('should find the matching filters in the source array with caseInsensitive flag as false', function(){
			Array.findOne(array, filter, false);
			expect(Array.find).toHaveBeenCalledWith(array, filter, true, false, false);
		});

    });

	describe('.findIndexes()', function(){
		var array, filter;

		beforeEach(function(){
			array = [];
			filter = {};
			spyOn(Array, 'find');
		});

		it('should find the matching filters in the source array with caseInsensitive flag as true', function(){
			Array.findIndexes(array, filter, true);
			expect(Array.find).toHaveBeenCalledWith(array, filter, false, true, true);
		});

		it('should find the matching filters in the source array with caseInsensitive flag as false', function(){
			Array.findIndexes(array, filter, false);
			expect(Array.find).toHaveBeenCalledWith(array, filter, false, true, false);
		});

	});

	describe('.findIndex()', function(){
		var array, filter;

		beforeEach(function(){
			array = [];
			filter = {};
			spyOn(Array, 'find');
		});

		it('should find the matching filters in the source array with caseInsensitive flag as true', function(){
			Array.findIndex(array, filter, true);
			expect(Array.find).toHaveBeenCalledWith(array, filter, true, true, true);
		});

		it('should find the matching filters in the source array with caseInsensitive flag as false', function(){
			Array.findIndex(array, filter, false);
			expect(Array.find).toHaveBeenCalledWith(array, filter, true, true, false);
		});

	});

	describe('.count()', function(){
		var array, filter;

		beforeEach(function(){
			array = [{count:1},{count:2},{count:3},{count:1},{count:4}];
			filter = {count:1};
			spyOn(Array, 'find').and.returnValue([0,3]);
		});

		it('should return a numeric value', function(){
			var result = Array.count(array, filter);
			expect(typeof result).toEqual('number');
		});

		it('should return the correct number of matching results', function(){
			var result = Array.count(array, filter);
			expect(result).toEqual(2);
		});

	});

    describe('.replace()', function(){

        it('should NOT replace any values if the simple filter does NOT match', function(){
            result = Array.replace(numbers, 100, null);
            expect(result).toEqual(numbers);

            result = Array.replace(strings, 'string7', null);
            expect(result).toEqual(strings);

            result = Array.replace(mixed, 'string7', null);
            expect(result).toEqual(mixed);
        });

        it('should replace all values if the simple filter matches', function(){
            Array.replace(numbers, 2, null);
            expect(numbers[1]).toBeNull();

            Array.replace(numbers, 4, null);
            expect(numbers[3]).toBeNull();
            expect(numbers[numbers.length-1]).toBeNull();

            Array.replace(strings, 'string3', null);
            expect(strings[2]).toBeNull();

            Array.replace(strings, 'string4', null);
            expect(strings[3]).toBeNull();
            expect(strings[4]).toBeNull();

            Array.replace(mixed, 'string1', null);
            expect(mixed[1]).toBeNull();

            Array.replace(mixed, 5, null);
            expect(mixed[3]).toBeNull();
            expect(mixed[6]).toBeNull();
        });

        it('should replace all values if the filter object matches', function(){
            Array.replace(objects, {key1: 'value3'}, {});
            expect(objects[2]).toEqual({});

            Array.replace(objects, {key3: 'value3'}, {});
            expect(objects[0]).toEqual({});

            Array.replace(objects, {key1: 'value2'}, {});
            expect(objects[0]).toEqual({});
            expect(objects[2]).toEqual({});
        });

    });

    describe('.sortBy()', function(){

        it('should return false if no array is supplied', function(){
            expect(Array.sortBy(undefined, undefined)).toEqual(false);
        });

        it('should return the original array if no "by" field is supplied', function(){
            var result = Array.sortBy(objects, undefined);
            expect(result).toEqual(objects);
        });

        it('should sort the array of objects based on the field provided', function(){
            var expected = [
				{key1:'value2',key2:'value3',key3:'value1'},
				{key1:'value2',key2:'value3',key3:'value1'},
				{key1:'value3',key2:'value1',key3:'value2'},
				{key1:'value1',key2:'value2',key3:'value3'}
			];
            var result = Array.sortBy(objects, 'key3');
            expect(result).toEqual(expected);
        });

        it('should sort the array of objects based on the field and thenBy field provided', function(){
            var expected = [objects[0], objects[3], objects[1], objects[2]];
            Array.sortBy(objects, 'key1', 'key4');
            expect(objects).toEqual(expected);
        });

		it('should sort in descending order if the reverse flag is set', function(){
			var expected = [objects[0], objects[3], objects[1], objects[2]].reverse();
			Array.sortBy(objects, 'key1', 'key4', true);
			expect(objects).toEqual(expected);
		});

    });

    describe('.remove()', function(){

        it('should return the original array if the filter does not match', function(){
            var orig = Array.copy(numbers);
            Array.remove(numbers, 100);
            expect(numbers).toEqual(orig);
            orig = Array.copy(strings);
            Array.remove(strings, 'string7');
            expect(strings).toEqual(orig);
            orig = Array.copy(mixed);
            Array.remove(mixed, 'string7');
            expect(mixed).toEqual(orig);
        });

        it('should remove all elements that match the given filter', function(){
            Array.remove(numbers, 2);
            expect(numbers.length).toEqual(14);
            Array.remove(numbers, 4);
            expect(numbers.length).toEqual(12);
            Array.remove(strings, 'string2');
            expect(strings.length).toEqual(5);
            Array.remove(strings, 'string4');
            expect(strings.length).toEqual(3);
            Array.remove(mixed, {key1: 'value1'});
            expect(mixed.length).toEqual(6);
            Array.remove(mixed, 5);
            expect(mixed.length).toEqual(4);
        });

    });

	describe('.exists()', function () {

		it('should return false if element does not exist in the source array', function(){
		    var result = Array.exists(numbers, 1000);
			expect(result).toEqual(false);
			var result = Array.exists(strings, 'someString');
			expect(result).toEqual(false);
			var result = Array.exists(objects, {key:'someValue'});
			expect(result).toEqual(false);
		});

		it('should return true if element exists in the source array', function(){
			var result = Array.exists(numbers, 4);
			expect(result).toEqual(true);
			var result = Array.exists(strings, 'string1');
			expect(result).toEqual(true);
			var result = Array.exists(objects, objects[2]);
			expect(result).toEqual(true);
		});

	});

	describe('.unique()', function () {

		it('should remove duplicate values from the source array', function(){
			expect(numbers.length).toEqual(15);
			Array.unique(numbers);
			expect(numbers.length).toEqual(14);
			expect(strings.length).toEqual(6);
			Array.unique(strings);
			expect(strings.length).toEqual(5);
			expect(objects.length).toEqual(4);
			Array.unique(objects);
			expect(objects.length).toEqual(3);
		});

	});

});