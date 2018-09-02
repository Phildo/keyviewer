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
  };

  self.cleanup = function()
  {
  };

};

