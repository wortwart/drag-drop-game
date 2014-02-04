// Hash mit Lösung
var land_stadt = $H({USA: 'NY', GB: 'L', D: 'H', F: 'P'});
// Punktestand
var punkte = 0;
// Selektoren für Drag- und Drop-Objekte
var sel_drag = '#staedteliste li';
var sel_drop = '#laenderliste li';
// Optionen für Highlight-Effekt:
// bei Erfolg gibt es einen Verlauf von Grün nach Weiß,
// bei Misserfolg von Rot nach Weiß
// die beiden Optionen-Objekte werden mit Prototypes Class.create() erzeugt
var Hinweis = Class.create();
Hinweis.prototype = {
 initialize: function(col) {this.startcolor = col;},
 duration: 2, // Sekunden
 endcolor: '#ffffff',
 restorecolor: '#ffffff' // sonst bleibt bei schnellen Klicks ein Farbrest
};
var roteffekt = new Hinweis('#ff2211');
var grueneffekt = new Hinweis('#11ff22');

// nach Laden des Fensters:
function init() {
 // sucht alle Elemente, die zum Selektor passen
 $$(sel_drag).each(function(dragobj) {
  // erzeugt daraus zurückspringende Drag-Objekte
  // und schreibt sie in das Array dragobjekte
  new Draggable(dragobj, {revert: true});
  // weist den Drag-Objekten eine CSS-Klasse zu
  Element.addClassName(dragobj, 'draggable');
 });

 // sucht alle Elemente, die zum Selektor passen
 $$(sel_drop).each(function(dropobj) {
  // erzeugt daraus Drop-Objekte ...
  Droppables.add(dropobj, {
   // ... die nur die CSS-Klasse "draggable" akzeptieren
   accept: 'draggable',
   // nach dem Droppen:
   onDrop: function(dragobj) {
    // passen Drag- und Dropobjekt zusammen?
    if (land_stadt[dropobj.id] == dragobj.id) {
     // ja: Erfolgsmeldung
     $('anleitung').update(dragobj.firstChild.nodeValue + ' liegt in ' + dropobj.firstChild.nodeValue + ' - ein glatter Punkt!');
     score(1);
    } else {
     $('anleitung').update('auweia ...');
     score(-1);
    }
   },
   // CSS-Klasse während des Überfahrens der Drop-Objekte
   hoverclass: 'hervorheben'
  });
 });
}

// Aufruf nach dem Droppen mit +1 oder -1
function score(wert) {
 // aktualisiert Punktestand
 punkte += wert;
 // Rückmeldung mit passendem Highlight-Effekt
 $('punktestand').update(punkte + ' Punkt' + (punkte != 1? 'e' : ''));
 new Effect.Highlight('punktestand', wert > 0? grueneffekt : roteffekt);
 // 4 Punkte: Spiel gewonnen
 if(punkte > 3) {
  $('anleitung').update('Sie sind zu gut für dieses Spiel - Gratuliere!');
  exit(1);
 // -4 Punkte: Spiel verloren
 } else if(punkte < -3) {
  $('anleitung').update("Bei Ihnen ist Hopfen und Malz verloren ...");
  exit(0);
 }
}

// beendet das Spiel
function exit(ok) {
 // lässt Spielergebnis fünfmal grün oder rot aufblinken
 $R(1, 5).each(function() {
  var blinker = ok? grueneffekt : roteffekt;
  new Effect.Highlight('anleitung', blinker)
  // warte mit dem nächsten Effekt, bis der aktuelle vorbei ist
  blinker.queue = 'end';
 });
 // Element sind nicht mehr droppable
 $$(sel_drop).each(function(dropobj) {
  Droppables.remove(dropobj.id);
 });
 // Elemente sind nicht mehr draggable und verlieren ihre CSS-Klasse
 Draggables.drags.each(function(dragobj) {
  dragobj.element.removeAttribute('class');
  dragobj.destroy();
 });
}

// führt nach Laden des Fensters init() aus (Prototype-Syntax)
Event.observe(window, 'load', init);
