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
  switch(tone%tones_per_octave)
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
  if(mode == minor) tone += 9;
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
  if(mode == minor) tone += 9;
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
  if(mode == minor) tone += 9;
       if(hand == left)  return fingerings_major_left[tone%tones_per_octave];
  else if(hand == right) return fingerings_major_right[tone%tones_per_octave];
}

var draw_scale = function(hand, tone, mode, x, y, note_h, ctx)
{
  var scale_progression = scale_for_mode(mode);
  var accidental = accidental_for_key(tone, mode);
  var p = position_for_tone(hand, accidental, tone)
  var blacks = blacks_for_key(tone, mode);
  var signature_positions = positions_for_signature(hand, accidental);
  var fingerings = fingerings_for_key(hand, tone, mode);

  ctx.fillStyle = black;
  ctx.strokeStyle = black;

  var h = note_h*4;
  var note_w = note_h;
  var clef_w = h*0.75;
  var signature_w = note_w*3;
  var w = clef_w+signature_w+(note_w*1.5)*scale_progression.length;

  //lines
  ctx.lineWidth = h/100;
  for(var i = 0; i < 5; i++)
    drawLine(x,y+note_h*i,x+w,y+note_h*i,ctx);

  //clef
  ctx.strokeRect(x,y,clef_w,h);

  //signature
  var signature_x = x+clef_w;
  var signature_y;
  for(var i = 0; i < blacks; i++)
  {
    signature_y = y+h-signature_positions[i]*note_h/2;
    ctx.strokeRect(signature_x, signature_y, note_w, note_h);
    signature_x += note_w/2;
  }

  //notes
  var note_x = x+clef_w+signature_w;
  var note_y;
  var note_p;
  for(var i = 0; i < scale_progression.length; i++)
  {
    note_p = p+i;
    note_y = y+h-note_p*note_h/2;
    if((note_p < 0 || note_p > 10) && (note_p+100)%2 == 1)
      drawLine(note_x, note_y+note_h/2, note_x+note_w, note_y+note_h/2, ctx);
    if(color_for_tone(tone+scale_progression[i]) == -1)
      ctx.strokeRect(note_x-note_w/2, note_y, note_w, note_h);
    ctx.strokeRect(note_x, note_y, note_w, note_h);
    note_x += note_w*1.5;
  }

  //fingerings
  ctx.fillStyle = blue;
  ctx.textAlign = "center";
  note_x = x+clef_w+signature_w; //duplicate note placement!
  for(var i = 0; i < fingerings.length; i++)
  {
    note_p = p+i;
    note_y = y+h-note_p*note_h/2;
    ctx.fillText(fingerings[i], note_x+note_w/2, note_y+note_h/2);
    note_x += note_w*1.5;
  }
}

