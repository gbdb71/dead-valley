// World

define([], function () {

  // save the bits in localStorage
  var worldMap = localStorage;

  var saveList = worldMap['saveList'];
  saveList = saveList ? JSON.parse(saveList) : [];

  var makeSomeRoom = function () {
    var key = saveList.shift();
    console.log('deleting ' + key);
    delete worldMap[key];
  };

  var updateSaveList = function (key) {
    if (key !== 'dude') {
      saveList.push(key);
      save('saveList', saveList);
    }
  };

  var save = function (key, data, noStringify) {
    var stringData = noStringify ? data : JSON.stringify(data);
    var tryAgain = false;
    do {
      try {
        worldMap[key] = stringData;
        if (key !== 'saveList') { // no super recursion
          updateSaveList(key);
        }
        tryAgain = false;
      } catch (e) {
        makeSomeRoom();
        tryAgain = true;
      }
    } while (tryAgain);
  };

  var World = {
    setSectionData: function (position, data) {
      var pos = position.toString();
      save(pos, data.tiles, true);
      if (data.roads) {
        save(pos + 'r', data.roads);
      }
      if (data.buildings) {
        save(pos + 'b', data.buildings);
      }
      if (data.sprites) {
        this.saveSprites(position, data.sprites);
      }
    },

    saveSprites: function (position, sprites) {
      save(position.toString() + 's', sprites);
    },

    saveDude: function (dude) {
      save('dude', dude.toString(), true);
    },

    saveBuildings: function (position, buildings) {
      save(position.toString() + 'b', buildings);
    },

    getTiles: function (position) {
      var data = worldMap[position.toString()];
      return data;
    },

    getRoads: function (position) {
      var data = worldMap[position.toString() + 'r'];
      return data && JSON.parse(data);
    },

    getBuildings: function (position) {
      var data = worldMap[position.toString() + 'b'];
      return data && JSON.parse(data);
    },

    getSprites: function (position) {
      var data = worldMap[position.toString() + 's'];
      return data && JSON.parse(data);
    },

    getDude: function () {
      return worldMap['dude'];
    },

    getSurroundingRoads: function (position) {
      var northSection = this.getRoads(position.add({x: 0, y:-1})),
          southSection = this.getRoads(position.add({x: 0, y: 1})),
          eastSection  = this.getRoads(position.add({x: 1, y: 0})),
          westSection  = this.getRoads(position.add({x:-1, y: 0}));
      return {
        n: northSection && northSection.s,
        s: southSection && southSection.n,
        e: eastSection  && eastSection.w,
        w: westSection  && westSection.e
      };
    },

    usedSpace: function () {
      var count = 0;
      for (var i = 0; i < localStorage.length; i++) {
        count += localStorage[localStorage.key(i)].length
      }
      return count * 2; // 2 bytes per character
    },

    clear: function () {
      worldMap.clear();
    }
  };

  return World;
});
