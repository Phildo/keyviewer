var Catcher = function(init)
{
  var default_init =
  {
    source:document.createElement('div')
  }

  var self = this;
  doMapInitDefaults(self,init,default_init);

  self.evt = 0;

  self.clicked = 0;
  self.shouldClick = function(evt)
  {
    return 1;
  }
  self.click = function(evt)
  {
    self.evt = evt;
    self.clicked = 1;
  }

  self.shouldHover = function(evt)
  {
    return 1;
  }
  self.hover = function(evt)
  {
    self.evt = evt;
  }
  self.unhover = function(evt)
  {
  }

  self.detach = function()
  {
  }

  self.flush = function()
  {
    self.evt = 0;
    self.clicked = 0;
  }
}

