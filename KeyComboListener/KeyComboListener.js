/*
 * KeyComboListener. For applications that require key event listeners (key down and key up for now)
 * and may require different combinations of keys pressed at once. This allows a singular key event 
 * listent to be attached to a DOM object to listen for key down/up events and execute a given function
 * associated with said combo. Adding combinations is as easy as a method call. Sample usage:
 *
 * var listener = $(document).KeyComboListener(); 
 * listener.addKeyCombo(Keys.alt, Keys.ctrl, Keys.z, function() {...do something...}); //take a list of keycodes as params
 * listener.addKeyCombo([Keys.alt, Keys.ctrl, Keys.s], function() {...do something else...}); //array of keycodes
 * 
 * It is now ready to listen for key combinations and execute the desired behavior.
 *
 * @author Patrick Rabig
 * @version 1.0
 * @dependencies - jQuery 1.11.1+
 * @domObj - DOM element from a jQuery call or javascript.
 */
function KeyComboListener(domObj) {
	this.domObj = $(domObj);
	/*
	 * A map of keys currently pressed. Keycodes are mapped to a true boolean
	 * value then deleted when no longer pressed.
	 */
	this.keysDown = {};
	
	/* 
	 * Map to hold key combos. String of numeric key values will map to a function
	 * to perform. I.e. Alt+Ctrl should alert "hello world" would look like:
	 * this.keyComboFn = {"17,18" : function() {alert("Hello World")}}. Numbers always
	 * in sorted incrementally.
	 */
	this.keyComboFn = {};
	this.pressed();
	this.unpressed();
}

/*
 * Assign a key down even handler to the DOM object assigned to the key listener.
 */
KeyComboListener.prototype.pressed = function() {
	function makeListener(obj) {
		function listener(e) {
			obj.keysDown[e.keyCode] = true; //make entry if key pressed
			obj.checkCombo();
		}
		return listener;
	}

	this.domObj.keydown(makeListener(this));
}

/*
 * Assign a key up event handler to the DOM object assigned to the key listener.
 */
KeyComboListener.prototype.unpressed = function() {
	function makeListener(obj) {
		function listener(e) {
			delete obj.keysDown[e.keyCode]; //remove entry if key no longer pressed
		}
		return listener;
	}
	this.domObj.keyup(makeListener(this));
}

/*
 * Check to see if the combination of keys currently pressed is currently in
 * the keycode->function map, keyComboFn, and run it if is present.
 */
KeyComboListener.prototype.checkCombo = function() {
	var pressedCodes = []; 
	for(var i in this.keysDown) pressedCodes.push(i);
	var comboStr = pressedCodes.sort().toString();
	var fn = this.keyComboFn[comboStr];
	if(fn != null) fn();
}

/*
 * When adding a key combination, an array of keycodes can be passed as the
 * first parameter OR a list of key codes can be passed. The last parameter is
 * always a function. Order of keycodes does not matter, but key combination must
 * be unique or it will be overwritten if same combination is used as an argument
 * again.
 * All of these are valid calls and will do the same thing:
 *
 * Assume: keyComboListener = new KeyComboListener();
 * Valid:  keyComboListener.addKeyCombo([17,18,13], function(){alert('Sample!')});
 * Valid:  keyComboListener.addKeyCombo(17,18,13, function(){alert('Sample!')});
 * Valid:  keyComboListener.addKeyCombo([Keys.ctrl, Keys.alt, Keys.enter], function(){alert('Sample!')});
 * Valid:  keyComboListener.addKeyCombo(Keys.ctrl, Keys.alt, Keys.enter, function(){alert('Sample!')});
 */
KeyComboListener.prototype.addKeyCombo = function() {
	var combo = [];
	if(Array.isArray(arguments[0])) {
		combo = arguments[0]; //if we have an array
	} else {
		for(var i=0; i<arguments.length-1; i++) { //iterate through all but the last element, the fn
			if(Number.isInteger(arguments[i])) 
				combo.push(arguments[i]);
		}
	}
	var comboStr = combo.sort().toString();
	var fn = arguments[arguments.length-1];
	if('function' === typeof fn) {
		this.keyComboFn[comboStr] = fn;
	} else {
		throw Error('The last argument in "KeyComboListener.addKeyCombo" must be a function!')
	}
	
}

var jQuery = jQuery || $;
if(jQuery != null) {
	jQuery.fn.KeyComboListener = function(a) {
		return new KeyComboListener(this);
	}
}

/*
 * Mappings of key names to key codes.
 */
Keys = KeyComboListener.Keys = {};
Keys.backspace					=		8;
Keys.tab						=		9;
Keys.enter						=		13;
Keys.shift						=		16;
Keys.ctrl						=		17;
Keys.alt						=		18;
Keys.pause						=		19;
Keys.capsLock					=		20;
Keys.esc						=		27;
Keys.space						=		32;
Keys.pageUp						=		33;
Keys.pageDn						=		34;
Keys.end						=		35;
Keys.home						=		36;
Keys.leftArrow					=		37;
Keys.upArrow					=		38;
Keys.rightArrow					=		39;
Keys.downArrow					=		40;
Keys.insert						=		45;
Keys.delete						=		46;
Keys._0							=		48;
Keys._1							=		49;
Keys._2							=		50;
Keys._3							=		51;
Keys._4							=		52;
Keys._5							=		53;
Keys._6							=		54;
Keys._7							=		55;
Keys._8							=		56;
Keys._9							=		57;
Keys.a							=		65;
Keys.b							=		66;
Keys.c							=		67;
Keys.d							=		68;
Keys.e							=		69;
Keys.f							=		70;
Keys.g							=		71;
Keys.h							=		72;
Keys.i							=		73;
Keys.j							=		74;
Keys.k							=		75;
Keys.l							=		76;
Keys.m							=		77;
Keys.n							=		78;
Keys.o							=		79;
Keys.p							=		80;
Keys.q							=		81;
Keys.r							=		82;
Keys.s							=		83;
Keys.t							=		84;
Keys.u							=		85;
Keys.v							=		86;
Keys.w							=		87;
Keys.x							=		88;
Keys.y							=		89;
Keys.z							=		90;
Keys.windowLeft					=		91;
Keys.windowRight				=		92;
Keys.select						=		93;
Keys.numpad 					=		{};
Keys.numpad[0]					=		96;
Keys.numpad[1]					=		97;
Keys.numpad[2]					=		98;
Keys.numpad[3]					=		99;
Keys.numpad[4]					=		100;
Keys.numpad[5]					=		101;
Keys.numpad[6]					=		102;
Keys.numpad[7]					=		103;
Keys.numpad[8]					=		104;
Keys.numpad[9]					=		105;
Keys.numpad['multiply']			=		106;
Keys.numpad['plus']				=		107;
Keys.numpad['minus']			=		109;
Keys.numpad['decimalPoint']		=		110;
Keys.numpad['divide']			=		111;
Keys.f1							=		112;
Keys.f2							=		113;
Keys.f3							=		114;
Keys.f4							=		115;
Keys.f5							=		116;
Keys.f6							=		117;
Keys.f7							=		118;
Keys.f8							=		119;
Keys.f9							=		120;
Keys.f10						=		121;
Keys.f11						=		122;
Keys.f12						=		123;
Keys.numLock					=		144;
Keys.scrollLock					=		145;
Keys.semiColon					=		186;
Keys.equals						=		187;
Keys.comma						=		188;
Keys.dash						=		189;
Keys.period						=		190;
Keys.forwardSlash				=		191;
Keys.graveAccent				=		192;
Keys.openBracket				=		219;
Keys.backSlash					=		220;
Keys.closeBraket				=		221;
Keys.quote						=		222;
