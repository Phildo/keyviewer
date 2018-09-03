var GamePlayScene = function(game, stage)
{
  var self = this;

  var canv;
  var canvas;
  var ctx;
  self.resize = function(s)
  {
    stage = s;
    canv = stage.canv;
    canvas = canv.canvas;
    ctx = canv.context;

    if(hoverer) hoverer.detach(); hoverer = new PersistentHoverer({source:canvas});
    if(clicker) clicker.detach(); clicker = new Clicker({source:canvas});
  }

  var hoverer;
  var clicker;

  self.ready = function()
  {
    self.resize(stage);
  };

  self.tick = function()
  {
  };

  self.draw = function()
  {
    var x = 0;
    var y = 100;
    var w = 200;
    var h = 100;
    var tone = middle_a;
    var mode = minor;
    draw_scale(right, tone,                  mode, x,y, h/4, ctx);
    y += 200;
    draw_scale(left,  tone-tones_per_octave, mode, x,y, h/4, ctx);
  };

  self.cleanup = function()
  {
  };

};

