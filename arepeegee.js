(function (root) {

  Function.prototype.inherits = function(parent) {
    function Surrogate () {};
    Surrogate.prototype = parent.prototype;
    this.prototype = new Surrogate();
    this.prototype.constructor = this;
  };

})(window);

(function (root) {
  var ArePeeGee = root.ArePeeGee = (root.ArePeeGee || {});

  var Map = ArePeeGee.Map = function () {
    this.grid = Map.createGrid();
    this.enemies = [];
  };

  Map.DIMX = Math.pow(2, 4) + 1;
  Map.DIMY = Math.pow(2, 4) + 1;

  _(Map).extend({
    isOnMap: function (pos) {
      return (
        0 <= pos[0] && pos[0] < Map.DIMX && 0 <= pos[1] && pos[1] < Map.DIMY
      );
    },

    randomPosition: function () {
      return [
        Math.floor(Math.random() * Map.DIMX), Math.floor(Math.random() * Map.DIMY)
      ];
    }
  })

  _(Map.prototype).extend({
    addHero: function (hero) {
      var pos = hero.position;

      this.hero = hero;
      this.grid[pos[0]][pos[1]].actor = hero;
    },

    addEnemy: function (enemy) {
      var pos = enemy.position;

      this.enemies.push(enemy);
      this.grid[pos[0]][pos[1]].actor = enemy;
    },

    // an actor is an enemy or a hero
    moveActor: function (actor, delta) {
      var pos = actor.position;

      _pos = [pos[0] + delta[0], pos[1] + delta[1]];

      if (this.isOccupied(_pos)) {
        return this.grid[_pos[0]][_pos[1]].actor;
      }

      if (Map.isOnMap(_pos)) {
        // remove actor at old position from grid
        this.grid[pos[0]][pos[1]].actor = null;

        // update actor's internal position
        actor.position = _pos;

        // update grid to reflect new position
        this.grid[_pos[0]][_pos[1]].actor = actor;

        return true;
      }

      return false;
    },

    removeEnemy: function (enemy) {
      var pos = enemy.position;

      // delete actor from grid
      this.grid[pos[0]][pos[1]].actor = null;

      // delete actor from casting
      this.enemies = _(this.enemies).without(enemy);
    },

    occupiedPositions: function () {
      var enemyPositions = _(this.enemies).pluck('position');

      return _(enemyPositions).union([this.hero.position]);
    },

    unoccupiedPosition: function () {
      do {
        var position = Map.randomPosition();
      } while (
        _(this.occupiedPositions).contains(position)
      );

      return position;
    },

    isOccupied: function (pos) {
      return this.grid[pos[0]][pos[1]].actor !== null;
    }
  })

  _(Map).extend({
    createGrid: function() {
      var grid = [];

      for (var i = 0; i < Map.DIMX; i++) {
        var row = [];

        for (var j = 0; j < Map.DIMY; j++) {
          var tile = new ArePeeGee.Tile({
            x: i, 
            y: j, 
            terrain: 'grass',
            actor: null
          });
          row.push(tile);
        };
        grid.push(row);
      };
      return grid;
    }
  })

})(window);

(function (root) {
  var ArePeeGee = root.ArePeeGee = (root.ArePeeGee || {});

  // terrains will be grass, water, mountain, sand
  // objs will be enemy, hero

  var Tile = ArePeeGee.Tile = function (options) {
    this.x = options.x;
    this.y = options.y;
    this.terrain = options.terrain;
    this.actor = options.actor;
  };

  _(Tile).extend({

  });

  _(Tile.prototype).extend({

  });
})(window);

(function (root) {
  var ArePeeGee = root.ArePeeGee = (root.ArePeeGee || {});

  var UI = ArePeeGee.UI = function () {
    this.map = new ArePeeGee.Map();

    this.addHero();

    this.currentEnemyLevel = 1;

    for(var i = 0; i < 10; i++) {
      this.addEnemy(this.currentEnemyLevel);
    };

    this.$map = this.render();

    this.addMouseHandlers();
  };

  _(UI).extend({
  });

  _(UI.prototype).extend({
    render: function () {
      var map = this.map;

      var hero = map.hero;

      var $map = $('.map');

      var $ul = $('<ul class="group">');

      for(var i = 0; i < ArePeeGee.Map.DIMX; i++) {
        for(var j = 0; j < ArePeeGee.Map.DIMY; j++) {
          var thisTile = map.grid[i][j];

          var terrainCSS = thisTile.terrain;
          var actorCSS = (thisTile.actor === null) ? "" : thisTile.actor.actorType();

          var $li = $('<li>').attr('data-row', i)
                             .attr('data-col', j)
                             .addClass(terrainCSS)
                             .addClass(actorCSS);

          $ul.append($li);
        }
      };

      $map.html($ul);  

      hero.render();

      return $map; 
    }, 

    addMouseHandlers: function() {
      var that = this;

      key('left', function() {
        that.moveHero([0,-1]);
        that.render();
      });

      key('right', function() {
        that.moveHero([0,1]);
        that.render();
      });

      key('up', function() {
        that.moveHero([-1,0]);
        that.render();
      });

      key('down', function() {
        that.moveHero([1,0]);
        that.render();
      });
    },

    moveHero: function (delta) {
      var map = this.map;
      var hero = map.hero;
      var enemy = map.moveActor(hero, delta);

      if (typeof enemy !== 'boolean') {
        hero.attack(enemy);

        if(enemy.isAlive()) {
          enemy.attack(hero);
        } else {
          hero.xp += enemy.killXP;

          hero.levelUp();

          map.removeEnemy(enemy);
        };

        if(map.enemies.length === 0) {
          this.currentEnemyLevel += 1;

          for(var i = 0; i < 10; i++) {
            this.addEnemy(this.currentEnemyLevel);
          };
        }
      };
    },

    addEnemy: function (level) {
      var enemy = new ArePeeGee.Enemy({
        position: this.map.unoccupiedPosition(),
        health: 3 * level,
        strength: 2 + level,
        defense: 1 + level,
        killXP: -1 + 2 * level
      });

      this.map.addEnemy(enemy);
    },

    addHero: function () {
      var hero = new ArePeeGee.Hero({
        position: this.map.unoccupiedPosition(),
        health: 20,
        strength: 3,
        defense: 2
      });

      this.map.addHero(hero);
    }
  });
})(window);

