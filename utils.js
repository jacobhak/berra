var utils = module.exports;

utils.vinsterForSpelare = function(spelare, omgangar) {
  return omgangar.filter(function(a) {
    return a.get('vinnare') === spelare;
  }).length;
};

utils.spelareToVinster = function(spelare, omgangar) {
  return spelare.map(function(s) {
    return {"spelare": s.get('namn'), "vinster": utils.vinsterForSpelare(s.get('namn'), omgangar)};
  });
};


