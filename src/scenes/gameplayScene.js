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
  var catcher;
  var tone;
  var mode;
  var hover_tone;
  var hover_mode;

  var draw_x = 30;
  var draw_y = 50;
  var draw_note_h = 25;

  self.ready = function()
  {
    self.resize(stage);
    catcher = new Catcher({source:canvas});
    tone = middle_a;
    mode = major;
    hover_tone = -1;
    hover_mode = -1;
  };

  self.tick = function()
  {
    hoverer.filter(catcher);
    clicker.filter(catcher);
    hoverer.flush();
    clicker.flush();
    if(catcher.evt) hover_tone = hover_scale(tone, mode, draw_x, draw_y, draw_note_h, catcher.evt.doX, catcher.evt.doY);
    if(catcher.clicked && hover_tone && hover_tone != -1) tone = hover_tone;
    catcher.flush();
  };

  self.draw = function()
  {
    ctx.strokeRect(0,0,canv.width,canv.height);
    var disp_tone = tone;
    var disp_mode = mode;
    if(hover_tone != -1) disp_tone = hover_tone;
    if(hover_mode != -1) disp_mode = hover_mode;
    draw_scale(disp_tone, disp_mode, draw_x, draw_y, draw_note_h, ctx);
  };

  self.cleanup = function()
  {
  };

};

