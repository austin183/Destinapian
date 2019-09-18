//cacheModelTest
'use strict';
const cache = require('../api/models/cacheModel');
const expect = require('chai').expect;

describe('Cache Model', function() {

  // This is the name of the test
  it('should not find cached value using non-existent arguments', function(done) {
    var value = cache.getCachedValue('not', 'exists');
    expect(value).to.equal('');
    done();
  });

  it('should save value to cache and find it', function(done){
  	var value = 'something';
  	var type = 'type';
  	var address = 'address';
  	cache.setCachedValue(type, address, value);
  	var actual = cache.getCachedValue(type, address);
  	expect(actual).to.equal(value);
  	done();
  });

});