var utils = module.exports;

utils.vinsterForSpelare = function(spelare, omgangar) {
  return omgangar.filter(function(a) {
    return a['vinnare'] == spelare;
  }).length;
};

utils.spelareToVinster = function(spelare, omgangar) {
  var result = {};
  spelare.forEach(function(s) {
    result[s] = utils.vinsterForSpelare(s, omgangar);
  });
  return result;
};


