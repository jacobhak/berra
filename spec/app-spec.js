var utils = require('../utils.js');

describe('utils', function() {
  describe('spelareTovinster', function() {
    var omgangar = [
      {vinnare: "berra"},
      {vinnare: "bengt"}
    ];
    var spelare = [
      "berra",
      "bengt",
      "leif"
    ];
    var result = [
      {"spelare": "berra", "vinster": 1},
      {"spelare": "bengt", "vinster": 1},
      {"spelare": "leif", "vinster": 0}
    ];
    it('should map spelare to the number of vinster of each spelare', function() {
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
