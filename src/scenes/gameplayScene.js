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
    var x = 100;
    var y = 100;
    var w = 200;
    var h = 100;
    ctx.strokeStyle = green;
    ctx.lineWidth = 1;
    ctx.strokeRect(x,y,w,h);
    draw_scale(1,middle_a,1, x,y, h/4, ctx);
  };

  self.cleanup = function()
  {
  };

};

