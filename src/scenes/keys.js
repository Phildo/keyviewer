/*
tone = 0-88 (0 = lowest note on keyboard [A])
position = ?-0-? (0 = lowest F on treble)
accidental = -1,1 (-1 = b, 1 = #)
clef = -1,1 (-1 = bass, 1 = treble)
color = -1,1 (-1 = black, 1 = white)
mode = -1,1 (-1 = minor, 1 = major)
hand = -1,1 (-1 = left, 1 = right)
*/

var tones_per_octave = 12;
var middle_a     = 36
var low_treble_d = 41;
var low_bass_f   = 20;
var whites_per_octave = 7;
var blacks_per_octave = 5;
var major_scale_progression = [ 0, 2, 4, 5, 7, 9, 11, 12, ];
var minor_scale_progression = [ 0, 2, 3, 5, 7, 8, 10, 12, ];

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
    case 0:  return                    "A";         break;
    case 1:  return (accidental > 0) ? "A#" : "Bb"; break;
    case 2:  return                    "B";         break;
    case 3:  return                    "C";         break;
    case 4:  return (accidental > 0) ? "C#" : "Db"; break;
    case 5:  return                    "D";         break;
    case 6:  return (accidental > 0) ? "D#" : "Eb"; break;
    case 7:  return                    "E";         break;
    case 8:  return                    "F";         break;
    case 9:  return (accidental > 0) ? "F#" : "Gb"; break;
    case 10: return                    "G";         break;
    case 11: return (accidental > 0) ? "G#" : "Ab"; break;
  }
  return "-";
}

var position_for_tone = function(clef, accidental, tone)
{
  var offset_tone;
       if(clef > 0) offset_tone = low_treble_d;
  else if(clef < 0) offset_tone = low_bass_f;
  var position = 0;
  while(tone-offset_tone >  tones_per_octave) { position += whites_per_octave; offset_tone += tones_per_octave; }
  while(tone-offset_tone < -tones_per_octave) { position -= whites_per_octave; offset_tone -= tones_per_octave; }
  while(offset_tone < tone) { offset_tone++; position += ((color_for_tone(offset_tone) > 0) ? 1 : 0); } //only increment position when new step is white (assume #)
  while(offset_tone > tone) { position -= ((color_for_tone(offset_tone) > 0) ? 1 : 0); offset_tone--; } //only decrement position when current step is white (assume #)
  if(color_for_tone(tone) < 0 && accidental < 0) position++;
  return position;
}

var accidental_for_key = function(tone, mode)
{
  if(mode < 0) tone += 9;
  switch(tone%tones_per_octave)
  {
    //               M
    case 0:  return  1; break; //A
    case 1:  return -1; break; //A#/Bb
    case 2:  return  1; break; //B
    case 3:  return  1; break; //C
    case 4:  return -1; break; //C#/Db
    case 5:  return  1; break; //D
    case 6:  return -1; break; //D#/Eb
    case 7:  return  1; break; //E
    case 8:  return -1; break; //F
    case 9:  return  1; break; //F#/Gb
    case 10: return  1; break; //G
    case 11: return -1; break; //G#/Ab
  }
}

var blacks_for_key = function(tone, mode)
{
  if(mode < 0) tone += 9;
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

var fingerings_for_key = function(hand, tone, mode)
{
  if(mode < 0) tone += 9;
  if(hand < 0)
  { //left
    switch(tone%tones_per_octave)
    {
      //              M
      case 0:  return [5,4,3,2,1,3,2,1]; break; //A
      case 1:  return [3,2,1,4,3,2,1,3]; break; //A#/Bb
      case 2:  return [4,3,2,1,4,3,2,1]; break; //B
      case 3:  return [5,4,3,2,1,3,2,1]; break; //C
      case 4:  return [3,2,1,4,3,2,1,3]; break; //C#/Db
      case 5:  return [5,4,3,2,1,3,2,1]; break; //D
      case 6:  return [3,2,1,4,3,2,1,3]; break; //D#/Eb
      case 7:  return [5,4,3,2,1,3,2,1]; break; //E
      case 8:  return [5,4,3,2,1,3,2,1]; break; //F
      case 9:  return [4,3,2,1,3,2,1,4]; break; //F#/Gb
      case 10: return [5,4,3,2,1,3,2,1]; break; //G
      case 11: return [3,2,1,4,3,2,1,3]; break; //G#/Ab
    }
  }
  else
  { //right
    switch(tone%tones_per_octave)
    {
      //              M
      case 0:  return [1,2,3,1,2,3,4,5]; break; //A
      case 1:  return [2,1,2,3,1,2,3,4]; break; //A#/Bb
      case 2:  return [1,2,3,1,2,3,4,5]; break; //B
      case 3:  return [1,2,3,1,2,3,4,5]; break; //C
      case 4:  return [2,3,1,2,3,4,1,2]; break; //C#/Db
      case 5:  return [1,2,3,1,2,3,4,5]; break; //D
      case 6:  return [3,1,2,3,4,1,2,3]; break; //D#/Eb
      case 7:  return [1,2,3,1,2,3,4,5]; break; //E
      case 8:  return [1,2,3,4,1,2,3,4]; break; //F
      case 9:  return [2,3,4,1,2,3,1,2]; break; //F#/Gb
      case 10: return [1,2,3,1,2,3,4,5]; break; //G
      case 11: return [3,4,1,2,3,1,2,3]; break; //G#/Ab
    }
  }
}

