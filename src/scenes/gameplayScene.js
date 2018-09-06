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

  var major_btn = {x:draw_x,                      y:stage.canv.height-100-draw_x, w:100, h:100};
  var minor_btn = {x:stage.canv.width-100-draw_x, y:stage.canv.height-100-draw_x, w:100, h:100};

  self.ready = function()
  {
    self.resize(stage);
    catcher = new Catcher({source:canvas});
    tone = middle_a;
    mode = major;
    hover_tone = -1;
    hover_mode = 0; //confusing, but -1 = minor, 1 = major
  };

  self.tick = function()
  {
    hoverer.filter(catcher);
    clicker.filter(catcher);
    hoverer.flush();
    clicker.flush();
    if(catcher.evt)
    {
      hover_tone = hover_scale(tone, mode, draw_x, draw_y, draw_note_h, catcher.evt.doX, catcher.evt.doY);
      hover_mode = 0;
      if(ptWithinBox(major_btn, catcher.evt.doX, catcher.evt.doY)) hover_mode = major;
      if(ptWithinBox(minor_btn, catcher.evt.doX, catcher.evt.doY)) hover_mode = minor;
    }
    if(catcher.clicked)
    {
      if(hover_tone && hover_tone != -1) tone = hover_tone;
      if(hover_mode) mode = hover_mode;
    }
    catcher.flush();
  };

  self.draw = function()
  {
    ctx.strokeRect(0,0,canv.width,canv.height);
    var disp_tone = tone;
    var disp_mode = mode;
    var hovering = 0;
    if(hover_tone != -1 && disp_tone != hover_tone) { disp_tone = hover_tone; hovering = 1; }
    if(hover_mode !=  0 && disp_mode != hover_mode) { disp_mode = hover_mode; hovering = 1; }
    draw_scale(disp_tone, disp_mode, draw_x, draw_y, draw_note_h, hovering ? 0.6 : 1, ctx);
    ctx.fillStyle = gray;
    if(mode == major) fillBox(major_btn,ctx)
    if(mode == minor) fillBox(minor_btn,ctx)
    ctx.fillStyle = black;
    ctx.fillText("Major",major_btn.x+major_btn.w/2,major_btn.y+30); strokeBox(major_btn,ctx);
    ctx.fillText("Minor",minor_btn.x+minor_btn.w/2,minor_btn.y+30); strokeBox(minor_btn,ctx);
  };

  self.cleanup = function()
  {
  };

};

