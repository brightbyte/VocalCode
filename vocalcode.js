meSpeak.loadConfig( 'mespeak/mespeak_config.json' );
meSpeak.loadVoice( 'mespeak/voices/en/en-us.json' );

window.VocalCodeChunkStream = function( root ) {
	var lineBreakRegex = /[\r\n]*[^\r\n]+/g;
	var prefixSplitRegex = /^([\r\n]*)([ \t]*)([^\r\n]*)$/;
	
	return {
		_root: root,
		_next: root,
		_indent: null,
		_style: null,
		_pushback: [],
		_highlight: null,
		
		_findStyle: function( node ) {
			while( node && !( node instanceof Element ) ) {
				node = node.parentNode;
			}
			
			return node ? node.style : null;
		},
		
		highlight: function( node ) {			
			if ( this._highlight ) {
				this._highlight.className =
					this._highlight.className.replace( /\bvcHighlight\b/, '' );			
			}

			while( node && !( node instanceof Element ) ) {
				node = node.parentNode;
			}
			
			// FIXME: identifiers don't have a wrapping <span>, so we run up to the <pre>
			// tag here, and don't have anything we can highlight. We should wrap such
			// text nodes on a span (but keep the whitespace out of the span).
			if ( node && node.tagName === 'PRE' ) {
				node = null;
			}
			
			this._highlight = node;
			
			if ( this._highlight ) {
				this._highlight.className =
					this._highlight.className + ' vcHighlight';
			}
		},

		nextLeaf: function() {
			while ( this._next && this._next.firstChild ) {
				this._next = this._next.firstChild;
			}

			var current = this._next;
			
			while ( this._next && this._next != this._root ) {
				if ( this._next.nextSibling ) {
					this._next = this._next.nextSibling;
					break;
				} else {
					this._next = this._next.parentNode;
				}
			} 
			
			if ( this._next == this._root ) {
				this._next = null;  // EOF
			}
			
			return current;
		},
		
		nextLine: function() {
			if ( this._pushback.length > 0 ) {
				return this._pushback.shift();
			}
				
			var textNode = this.nextLeaf();
			while ( textNode && !( textNode instanceof Text ) ) {
				textNode = this.nextLeaf();
			}
			
			// TODO merge adjecent nodes if they have the same style
				
			if ( textNode == null ) {
				return null; // EOF
			}
			
			this._style = this._findStyle( textNode );
			this.highlight( textNode );

			var text = textNode.nodeValue;
			
			// FIXME: this doesn't seem to work
			text = text.replace( "\t", "    " ); // 4 spaces per tab

			var lines = text.match( lineBreakRegex );
			
			if ( lines ) {
				text = lines.shift();
				
				for ( var i = lines.length-1; i >= 0; i-- ) {
					this._pushback.unshift( lines[i] );
				}
			}
			
			return [ text, this._style ];
		},

		nextFrame: function() {
			var text = '';
			var style = null;
			var prefix;
			var linebreaks;

			while ( text == '' ) {
				var line = this.nextLine();
				
				if ( line == null ) {
					return null; // EOF
				}

				[ text, style ] = line;				
				[ , linebreaks, prefix, text ] = prefixSplitRegex.exec( text );
				
				if ( this._indent == null || linebreaks.length > 0 ) {
					this._indent = prefix;
				}
			}
			
			return [ this._indent, text, style ];
		}
	};
};

window.vocalcode = function( meSpeak ) {
	
	return {
		_stop: false,
		_meSpeak: meSpeak,
		
		_mangleText: function( text ) {
			// todo: depends on language!
			switch ( text ) {
				case '!=': return ' not equal to ';
				case '===': return ' same as ';
				case '==': return ' equal to ';
				case '.': return '\'s ';
				case '->': return '\'s ';
				case '::': return '\`s';
				case '&&': return ' and ';
				case '||': return ' or ';
				case '++': return ' increment ';
				case '--': return ' decrement ';
				case '=>': return ' is ';
				case ':': return ' is ';
				case '$': return '';
				case ',': return ', ';
				case '_': return ' ';
				case ';': return '. ';
				case '()': return ''; 
				case '(': return ' open ';
				case ')': return ' close ';
				case '[': return ' start ';
				case ']': return ' finish ';
				case '{': return ' begin ';
				case '}': return ' end. ';
				default: 
					return text.replace( '/*', '' )
						.replace( '*/', '' )
						.replace( '//', '' )
						.replace( '#', '' )
						.replace( /\$\B/, '' )
						.replace( /^(\.|->)/, '' )
						.replace( /(\.|->)$/, '\'s' )
						;
			}
		},
		
		_applyStyle: function( options, style ) {
			// todo: mangle text and style at the same time
			
			if ( style.fontStyle == 'italic' ) {
				// comment
				options.variant = 'f2'; // female 2
			} else if ( style.color == 'rgb(51, 102, 204)' ) {
				// string literal
				options.variant = 'm4'; // male 4
			} else if ( style.fontWeight == 'bold' ) {
				// comment
				options.variant = 'croak'; 
				options.speed = 250; 
			} else if ( style.color == 'rgb(51, 153, 51)' ) {
				// operator or punctuation
				options.speed = 250; 
			}
			
			return options; 
		},
		
		stop: function( root ) {
			this._stop = true;
		},
		
		walkAndTalk: function( root ) {
			//this._meSpeak.speak( 'hello world' );
			var stream = VocalCodeChunkStream( root );
			var self = this;
			
			this._stop = false;
			
			var speakNext = function( ok ) {
				if ( !ok || self._stop ) {
					console.log( "ABORT!" );
					stream.highlight( null );
					return;
				}
				
				var frame = stream.nextFrame()
				
				if ( frame ) {
					var indent, text, style;
					[ indent, text, style ] = frame;

					var options = {
						variant: 'm1',
						nostop: true,
						punct: false,
						capitals: 1,
						pitch: 40 + ( indent.length / 4 ) * 20
					};

					text = self._mangleText( text );
					options = self._applyStyle( options, style );
					
					console.log( "say: " + text + " using " + JSON.stringify( options ) );
					self._meSpeak.speak( text, options, speakNext );
				} else {
					stream.highlight( null );
					console.log( "done." );
				}
			};
			
			speakNext( true );
		}
	};
}( window.meSpeak );