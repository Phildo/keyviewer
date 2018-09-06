/*
tone = 0-88 (0 = lowest note on keyboard [A])
position = ?-0-? (0 = lowest F on treble)
accidental = -1,1 (-1 = b, 1 = #)
clef = -1,1 (-1 = bass, 1 = treble)
color = -1,1 (-1 = black, 1 = white)
mode = -1,1 (-1 = minor, 1 = major)
hand = -1,1 (-1 = left, 1 = right)
*/

var flat   = -1; var sharp  =  1;
//var black  = -1; var white  = 1; //disable, because black/white as rgb colors more useful
var bass   = -1; var treble =  1;
var left   = -1; var right  =  1;
var minor  = -1; var major  =  1;

var middle_a     = 36
var low_treble_d = 41;
var low_bass_f   = 20;
var tones_per_octave = 12;
var whites_per_octave = 7;
var blacks_per_octave = 5;

var scale_minor = [ 0, 2, 3, 5, 7, 8, 10, 12, ];
var scale_major = [ 0, 2, 4, 5, 7, 9, 11, 12, ];
var scale_for_mode = function(mode)
{
  switch(mode)
  {
    case minor: return scale_minor; break;
    case major: return scale_major; break;
  }
}

var color_for_tone = function(tone)
{
  switch(tone%tones_per_octave)
  {
    case 0:  return  1; break;
    case 1:  return -1; break;
    case 2:  return  1; break;
    case 3:  return  1; break;
    case 4:  return -1; break;
    case 5:  return  1; break;
    case 6:  return -1; break;
    case 7:  return  1; break;
    case 8:  return  1; break;
    case 9:  return -1; break;
    case 10: return  1; break;
    case 11: return -1; break;
  }
  return 0;
}

var glyph_for_tone = function(accidental, tone)
{
  switch((tone+tones_per_octave)%tones_per_octave)
  {
    case 0:  return                         "A";         break;
    case 1:  return (accidental == sharp) ? "A#" : "Bb"; break;
    case 2:  return                         "B";         break;
    case 3:  return                         "C";         break;
    case 4:  return (accidental == sharp) ? "C#" : "Db"; break;
    case 5:  return                         "D";         break;
    case 6:  return (accidental == sharp) ? "D#" : "Eb"; break;
    case 7:  return                         "E";         break;
    case 8:  return                         "F";         break;
    case 9:  return (accidental == sharp) ? "F#" : "Gb"; break;
    case 10: return                         "G";         break;
    case 11: return (accidental == sharp) ? "G#" : "Ab"; break;
  }
  return "-";
}

var root_position_for_key = function(clef, tone, mode)
{
  return position_for_tone(clef, accidental_for_key(tone, mode), tone);
}

var position_for_tone = function(clef, accidental, tone)
{
  var offset_tone;
       if(clef == treble) offset_tone = low_treble_d;
  else if(clef == bass)   offset_tone = low_bass_f;
  var position = 0;
  while(tone-offset_tone >  tones_per_octave) { position += whites_per_octave; offset_tone += tones_per_octave; }
  while(tone-offset_tone < -tones_per_octave) { position -= whites_per_octave; offset_tone -= tones_per_octave; }
  while(offset_tone < tone) { offset_tone++; position += ((color_for_tone(offset_tone) > 0) ? 1 : 0); } //only increment position when new step is white (assume #)
  while(offset_tone > tone) { position -= ((color_for_tone(offset_tone) > 0) ? 1 : 0); offset_tone--; } //only decrement position when current step is white (assume #)
  if(color_for_tone(tone) < 0 && accidental == flat) position++;
  return position;
}

var accidental_for_key = function(tone, mode)
{
  if(mode == minor) tone += 3;
  switch(tone%tones_per_octave)
  {
    //               M
    case 0:  return sharp; break; //A
    case 1:  return flat;  break; //A#/Bb
    case 2:  return sharp; break; //B
    case 3:  return sharp; break; //C
    case 4:  return flat;  break; //C#/Db
    case 5:  return sharp; break; //D
    case 6:  return flat;  break; //D#/Eb
    case 7:  return sharp; break; //E
    case 8:  return flat;  break; //F
    case 9:  return sharp; break; //F#/Gb
    case 10: return sharp; break; //G
    case 11: return flat;  break; //G#/Ab
  }
}

var blacks_for_key = function(tone, mode)
{
  if(mode == minor) tone += 3;
  switch(tone%tones_per_octave)
  {
    //              M
    case 0:  return 3; break; //A
    case 1:  return 2; break; //A#/Bb
    case 2:  return 5; break; //B
    case 3:  return 0; break; //C
    case 4:  return 5; break; //C#/Db
    case 5:  return 2; break; //D
    case 6:  return 3; break; //D#/Eb
    case 7:  return 4; break; //E
    case 8:  return 1; break; //F
    case 9:  return 6; break; //F#/Gb
    case 10: return 1; break; //G
    case 11: return 4; break; //G#/Ab
  }
}

var positions_bass_flat_accidental    = [ 3, 6, 2, 5, 1, 4, 0];
var positions_bass_sharp_accidental   = [ 7, 4, 8, 5, 2, 6, 3];
var positions_treble_flat_accidental  = [ 5, 8, 4, 7, 3, 6, 2];
var positions_treble_sharp_accidental = [ 9, 6,10, 7, 4, 8, 5];
var positions_for_signature = function(clef, accidental)
{
  if(clef == bass)
  {
    if(accidental == flat)  return positions_bass_flat_accidental;
    if(accidental == sharp) return positions_bass_sharp_accidental;
  }
  else if(clef == treble)
  {
    if(accidental == flat)  return positions_treble_flat_accidental;
    if(accidental == sharp) return positions_treble_sharp_accidental;
  }
}

var fingerings_major_left = [
[5,4,3,2,1,3,2,1], //A
[3,2,1,4,3,2,1,3], //A#/Bb
[4,3,2,1,4,3,2,1], //B
[5,4,3,2,1,3,2,1], //C
[3,2,1,4,3,2,1,3], //C#/Db
[5,4,3,2,1,3,2,1], //D
[3,2,1,4,3,2,1,3], //D#/Eb
[5,4,3,2,1,3,2,1], //E
[5,4,3,2,1,3,2,1], //F
[4,3,2,1,3,2,1,4], //F#/Gb
[5,4,3,2,1,3,2,1], //G
[3,2,1,4,3,2,1,3], //G#/Ab
];
var fingerings_major_right = [
[1,2,3,1,2,3,4,5], //A
[2,1,2,3,1,2,3,4], //A#/Bb
[1,2,3,1,2,3,4,5], //B
[1,2,3,1,2,3,4,5], //C
[2,3,1,2,3,4,1,2], //C#/Db
[1,2,3,1,2,3,4,5], //D
[3,1,2,3,4,1,2,3], //D#/Eb
[1,2,3,1,2,3,4,5], //E
[1,2,3,4,1,2,3,4], //F
[2,3,4,1,2,3,1,2], //F#/Gb
[1,2,3,1,2,3,4,5], //G
[3,4,1,2,3,1,2,3], //G#/Ab
];
var fingerings_for_key = function(hand, tone, mode)
{
  if(mode == minor) tone += 3;
       if(hand == left)  return fingerings_major_left[tone%tones_per_octave];
  else if(hand == right) return fingerings_major_right[tone%tones_per_octave];
}

var middleify_tone = function(tone)
{
  while(tone < middle_a)                  tone += tones_per_octave;
  while(tone > middle_a+tones_per_octave) tone -= tones_per_octave;
  return tone;
}

var draw_note = function(cx, cy, w, h, ctx)
{
  var hscale = 1.2;
  ctx.beginPath();
  ctx.save();
  ctx.scale(hscale,1);
  ctx.arc(cx/hscale,cy,h/2,0,twopi);
  ctx.restore();
  ctx.fill();
}

var draw_bubble = function(cx, cy, w, h, ctx)
{
  ctx.beginPath();
  ctx.arc(cx,cy,h/2,0,twopi);
  ctx.fill();
}

var bass_img   = GenImg("assets/bass.png");
var treble_img = GenImg("assets/treble.png");
var flat_img   = GenImg("assets/flat.png");
var sharp_img  = GenImg("assets/sharp.png");
var draw_scale = function(tone, mode, x, y, note_h, content_alpha, ctx)
{
  var scale_progression = scale_for_mode(mode);
  var accidental = accidental_for_key(tone, mode);
  var blacks = blacks_for_key(tone, mode);

  var treble_tone = tone;
  var bass_tone = tone-tones_per_octave;
  var treble_p = position_for_tone(treble, accidental, treble_tone)
  var bass_p   = position_for_tone(bass,   accidental, bass_tone)
  var treble_signature_positions = positions_for_signature(treble, accidental);
  var bass_signature_positions   = positions_for_signature(bass,   accidental);
  var right_fingerings = fingerings_for_key(right, treble_tone, mode);
  var left_fingerings  = fingerings_for_key(left, bass_tone, mode);

  var h = note_h*4;
  var note_w = note_h;
  var clef_w = h*0.75;
  var signature_w = note_w*6*0.75;
  var w = clef_w+signature_w+(note_w*2)*scale_progression.length;
  var treble_y = y;
  var bass_y = y+note_h*8;
  var keyboard_y = bass_y+note_h*6;
  var listboard_y = keyboard_y+note_h*6;
  var canonboard_y = listboard_y+note_h*2;
  var y;

  var accidental_img;
  var accidental_oversize = note_w/2;
  switch(accidental)
  {
    case flat:  accidental_img = flat_img;  break;
    case sharp: accidental_img = sharp_img; break;
  }

  ctx.fillStyle = black;
  ctx.strokeStyle = black;
  ctx.textAlign = "center";
  ctx.font = floor(note_h*0.8)+"px Arial";

  //lines
  ctx.lineWidth = floor(h/100);
  if(ctx.lineWidth == 0) ctx.lineWidth = 1;
  for(var i = 0; i < 5; i++) drawLine(x,treble_y+note_h*i,x+w,treble_y+note_h*i,ctx);
  for(var i = 0; i < 5; i++) drawLine(x,bass_y+note_h*i,x+w,bass_y+note_h*i,ctx);

  //clef
  ctx.drawImage(treble_img,x-clef_w/2,treble_y-clef_w/2,clef_w*2,h+clef_w);
  ctx.drawImage(bass_img,x,bass_y,clef_w,h);

  //signature
  ctx.globalAlpha = content_alpha;
  for(var twice = 0; twice < 2; twice++)
  {
    var signature_x = x+clef_w;
    var signature_y;
    var signature_positions;
    if(twice == 0) //treble
    {
      y = treble_y;
      signature_positions = treble_signature_positions;
    }
    else //bass
    {
      y = bass_y;
      signature_positions = bass_signature_positions;
    }
    for(var i = 0; i < blacks; i++)
    {
      signature_y = y+h-signature_positions[i]*note_h/2;
      ctx.drawImage(accidental_img, signature_x-accidental_oversize/2, signature_y-accidental_oversize/2, note_w+accidental_oversize, note_h+accidental_oversize);
      signature_x += note_w/2;
    }
  }
  ctx.globalAlpha = 1;

  //notes
  ctx.globalAlpha = content_alpha;
  for(var twice = 0; twice < 2; twice++)
  {
    var note_x = x+clef_w+signature_w;
    var note_y;
    var note_p;
    var p;
    var fingerings;
    if(twice == 0) //treble
    {
      tone = treble_tone;
      y = treble_y;
      p = treble_p;
      fingerings = right_fingerings;
    }
    else //bass
    {
      tone = bass_tone;
      y = bass_y;
      p = bass_p;
      fingerings = left_fingerings;
    }
    for(var i = 0; i < scale_progression.length; i++)
    {
      note_p = p+i;
      note_y = y+h-note_p*note_h/2;
      switch(i)
      {
        case 0: case 2: case 4: ctx.fillStyle = red;   ctx.strokeStyle = red; break;
        default:                ctx.fillStyle = black; ctx.strokeStyle = black; break;
      }
      if((note_p < 0 || note_p > 10) && (note_p+100)%2 == 1)
        drawLine(note_x-note_w/2, note_y+note_h/2, note_x+note_w+note_w/2, note_y+note_h/2, ctx);
      if(color_for_tone(tone+scale_progression[i]) == -1)
        //ctx.strokeRect(note_x-note_w, note_y, note_w, note_h);
        ctx.drawImage(accidental_img, note_x-note_w-accidental_oversize/2, note_y-accidental_oversize/2, note_w+accidental_oversize, note_h+accidental_oversize);
      //ctx.strokeRect(note_x, note_y, note_w, note_h);
      draw_note(note_x+note_w/2, note_y+note_h/2, note_w, note_h, ctx);
      ctx.fillStyle = white;
      ctx.fillText(fingerings[i], note_x+note_w/2, note_y+note_h/2+note_h/3);
      ctx.fillStyle = black;
      note_x += note_w*2;
    }
  }
  ctx.globalAlpha = 1;

  //piano
  var n_keys_displayed = whites_per_octave*3;
  var key_w = w/n_keys_displayed;
  var key_x = x;
  var key_h = note_h*5;
  var root_tone = bass_tone%tones_per_octave;
  var tone_i = 0;
  var progression_i = 0;
  var bubble_h = key_h/8;
  ctx.font = floor(bubble_h*0.8)+"px Arial";
  for(var i = 0; i < n_keys_displayed; i++)
    ctx.strokeRect(key_x+key_w*i,keyboard_y,key_w,key_h);
  for(var i = 0; i < n_keys_displayed; i++)
  {
    if(progression_i < scale_progression.length && tone_i == root_tone+scale_progression[progression_i])
    { //left hand
      switch(progression_i)
      {
        case 0: case 2: case 4: ctx.fillStyle = red;   ctx.strokeStyle = red; break;
        default:                ctx.fillStyle = black; ctx.strokeStyle = black; break;
      }
      var bx = key_x+key_w/2;
      var by = keyboard_y+key_h*3/4-bubble_h;
      ctx.globalAlpha = content_alpha*0.6;
      draw_bubble(bx, by, bubble_h, bubble_h, ctx);
      ctx.globalAlpha = 1;
      ctx.fillStyle = white;
      ctx.fillText(left_fingerings[progression_i], bx, by+bubble_h/3);
      progression_i++;
    }
    if(progression_i >= scale_progression.length && tone_i == root_tone+tones_per_octave+scale_progression[progression_i-scale_progression.length])
    { //right hand
      switch(progression_i-scale_progression.length)
      {
        case 0: case 2: case 4: ctx.fillStyle = red;   ctx.strokeStyle = red; break;
        default:                ctx.fillStyle = black; ctx.strokeStyle = black; break;
      }
      var bx = key_x+key_w/2;
      var by = keyboard_y+key_h*3/4+bubble_h;
      ctx.globalAlpha = content_alpha;
      draw_bubble(bx, by, bubble_h, bubble_h, ctx);
      ctx.globalAlpha = 1;
      ctx.fillStyle = white;
      ctx.fillText(right_fingerings[progression_i-scale_progression.length], bx, by+bubble_h/3);
      progression_i++;
    }
    tone_i++;
    if(i+1 < n_keys_displayed && color_for_tone(tone_i) == -1)
    {
      ctx.fillStyle = black;
      ctx.fillRect(key_x+key_w*2/3,keyboard_y,key_w*2/3,key_h/2);
      if(progression_i < scale_progression.length && tone_i == root_tone+scale_progression[progression_i])
      { //left hand
        switch(progression_i)
        {
          case 0: case 2: case 4: ctx.fillStyle = red;   ctx.strokeStyle = red; break;
          default:                ctx.fillStyle = white; ctx.strokeStyle = white; break;
        }
        var bx = key_x+key_w;
        var by = keyboard_y+key_h/4-bubble_h;
        ctx.globalAlpha = content_alpha*0.6;
        draw_bubble(bx, by, bubble_h, bubble_h, ctx);
        ctx.globalAlpha = 1;
        ctx.fillStyle = black;
        ctx.fillText(left_fingerings[progression_i], bx, by+bubble_h/3);
        progression_i++;
      }
      if(progression_i >= scale_progression.length && tone_i == root_tone+tones_per_octave+scale_progression[progression_i-scale_progression.length])
      { //right hand
        switch(progression_i-scale_progression.length)
        {
          case 0: case 2: case 4: ctx.fillStyle = red;   ctx.strokeStyle = red; break;
          default:                ctx.fillStyle = white; ctx.strokeStyle = white; break;
        }
        var bx = key_x+key_w;
        var by = keyboard_y+key_h/4+bubble_h;
        ctx.globalAlpha = content_alpha;
        draw_bubble(bx, by, bubble_h, bubble_h, ctx);
        ctx.globalAlpha = 1;
        ctx.fillStyle = black;
        ctx.fillText(right_fingerings[progression_i-scale_progression.length], bx, by+bubble_h/3);
        progression_i++;
      }
      tone_i++;
    }
    key_x += key_w;
  }

  //list
  n_keys_displayed = tones_per_octave*3;
  key_w = w/n_keys_displayed;
  key_x = x;
  key_h = note_h*1;
  tone_i = 0;
  progression_i = 0;
  for(var i = 0; i < n_keys_displayed; i++)
  {
    ctx.strokeStyle = black;
    ctx.strokeRect(key_x,listboard_y,key_w,key_h);
    if(progression_i < scale_progression.length && tone_i == root_tone+scale_progression[progression_i])
    { //left hand
      switch(progression_i)
      {
        case 0: case 2: case 4: ctx.fillStyle = red;   ctx.strokeStyle = red; break;
        default:                ctx.fillStyle = black; ctx.strokeStyle = black; break;
      }
      var bx = key_x+key_w/2;
      var by = listboard_y-bubble_h/4;
      ctx.globalAlpha = content_alpha;
      draw_bubble(bx, by, bubble_h, bubble_h, ctx);
      ctx.globalAlpha = 1;
      ctx.fillStyle = white;
      ctx.fillText(left_fingerings[progression_i], bx, by+bubble_h/3);
      progression_i++;
    }
    if(progression_i >= scale_progression.length && tone_i == root_tone+tones_per_octave+scale_progression[progression_i-scale_progression.length])
    { //right hand
      switch(progression_i-scale_progression.length)
      {
        case 0: case 2: case 4: ctx.fillStyle = red;   ctx.strokeStyle = red; break;
        default:                ctx.fillStyle = black; ctx.strokeStyle = black; break;
      }
      var bx = key_x+key_w/2;
      var by = listboard_y+key_h+bubble_h/4;
      ctx.globalAlpha = content_alpha;
      draw_bubble(bx, by, bubble_h, bubble_h, ctx);
      ctx.globalAlpha = 1;
      ctx.fillStyle = white;
      ctx.fillText(right_fingerings[progression_i-scale_progression.length], bx, by+bubble_h/3);
      progression_i++;
    }
    ctx.fillStyle = black;
    ctx.fillText(glyph_for_tone(accidental, tone_i),key_x+key_w/2,listboard_y+key_h*2/3);
    tone_i++;
    key_x += key_w;
  }

  //canonical
  n_keys_displayed = tones_per_octave;
  key_w = w/n_keys_displayed;
  key_x = x;
  key_h = note_h*2;
  tone_i = 0;
  progression_i = 0;
  ctx.strokeStyle = black;
  ctx.fillStyle = black;
  for(var i = 0; i < n_keys_displayed; i++)
  {
    if(tone%tones_per_octave == i)
    {
      ctx.fillStyle = gray;
      ctx.fillRect(key_x,canonboard_y,key_w,key_h);
      ctx.fillStyle = black;
    }
    ctx.strokeRect(key_x,canonboard_y,key_w,key_h);
    ctx.fillText(glyph_for_tone(accidental, tone_i),key_x+key_w/2,canonboard_y+key_h*2/3);
    tone_i++;
    key_x += key_w;
  }

}

var hover_scale = function(tone, mode, x, y, note_h, doX, doY)
{
  var scale_progression = scale_for_mode(mode);
  var accidental = accidental_for_key(tone, mode);
  var blacks = blacks_for_key(tone, mode);

  var treble_tone = tone;
  var bass_tone = tone-tones_per_octave;
  var treble_p = position_for_tone(treble, accidental, treble_tone)
  var bass_p   = position_for_tone(bass,   accidental, bass_tone)
  var treble_signature_positions = positions_for_signature(treble, accidental);
  var bass_signature_positions   = positions_for_signature(bass,   accidental);

  var h = note_h*4;
  var note_w = note_h;
  var clef_w = h*0.75;
  var signature_w = note_w*6*0.75;
  var w = clef_w+signature_w+(note_w*2)*scale_progression.length;
  var treble_y = y;
  var bass_y = y+note_h*8;
  var keyboard_y = bass_y+note_h*6;
  var listboard_y = keyboard_y+note_h*6;
  var canonboard_y = listboard_y+note_h*2;
  var y;

  //notes
  for(var twice = 0; twice < 2; twice++)
  {
    var note_x = x+clef_w+signature_w;
    var note_y;
    var note_p;
    var p;
    if(twice == 0) //treble
    {
      tone = treble_tone;
      y = treble_y;
      p = treble_p;
    }
    else //bass
    {
      tone = bass_tone;
      y = bass_y;
      p = bass_p;
    }
    for(var i = 0; i < scale_progression.length; i++)
    {
      note_p = p+i;
      note_y = y+h-note_p*note_h/2;
      if(ptWithin(note_x,note_y,note_w,note_h,doX,doY)) return middleify_tone(tone + scale_progression[i]);
      note_x += note_w*2;
    }
  }

  //keyboard
  var n_keys_displayed = whites_per_octave*3;
  var key_w = w/n_keys_displayed;
  var key_x = x;
  var key_h = note_h*5;
  var root_tone = bass_tone%tones_per_octave;
  var tone_i = 0;
  var progression_i = 0;
  var bubble_h = key_h/8;
  var tentative = -1;
  for(var i = 0; i < n_keys_displayed; i++)
  {
    if(ptWithin(key_x,keyboard_y,key_w,key_h,doX,doY)) tentative = middleify_tone(tone_i);
    tone_i++;
    if(i+1 < n_keys_displayed && color_for_tone(tone_i) == -1)
    {
      if(ptWithin(key_x+key_w*2/3,keyboard_y,key_w*2/3,key_h/2,doX,doY)) return middleify_tone(tone_i);
      tone_i++;
    }
    key_x += key_w;
    if(tentative != -1) return tentative;
  }

  //list
  n_keys_displayed = tones_per_octave*3;
  key_w = w/n_keys_displayed;
  key_x = x;
  key_h = note_h*1;
  tone_i = 0;
  progression_i = 0;
  for(var i = 0; i < n_keys_displayed; i++)
  {
    if(ptWithin(key_x,listboard_y,key_w,key_h,doX,doY)) return middleify_tone(tone_i);
    tone_i++;
    key_x += key_w;
  }

  //canonical
  n_keys_displayed = tones_per_octave;
  key_w = w/n_keys_displayed;
  key_x = x;
  key_h = note_h*2;
  tone_i = 0;
  progression_i = 0;
  for(var i = 0; i < n_keys_displayed; i++)
  {
    if(ptWithin(key_x,canonboard_y,key_w,key_h,doX,doY)) return middleify_tone(tone_i);
    tone_i++;
    key_x += key_w;
  }

  return -1;
}

