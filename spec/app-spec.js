var utils = require('../utils.js');

describe('utils', function() {
  describe('spelareTovinster', function() {
    it('should return map spelare to the number of vinster of each spelare', function() {
      var omgangar = [
        {vinnare: "berra"},
        {vinnare: "bengt"}
      ];
      var spelare = [
	"berra",
	"bengt",
	"leif"
      ];
      var result = {
	"berra": 1,
	"bengt": 1,
	"leif": 0
      };
      expect(utils.spelareToVinster(spelare, omgangar)).toEqual(result);
    });  
  });

  describe('vinsterForSpelare', function() {
    it('should given a spelare and omgangar, return the spelares number of vinster', function() {
      var omgangar = [
	{vinnare: "berra"},
	{vinnare: "bengt"}
      ];
      expect(utils.vinsterForSpelare('berra', omgangar)).toBe(1);
    });
  });
});
