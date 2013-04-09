// A web audio api synth
var SCSynth = cc.Class.extend({

	ctor:function () {
    	cc.log("SCSynth ctor()");
    	this.globalMediator = null;
    	this.audioContext = null;
    	this.effectChain = null;
    	this.revNode = null;
    },
    
    init:function (){
	  
	   try {
    		this.audioContext = new webkitAudioContext();
    	}
    	catch(e) {
    		alert('Web Audio API is not supported in this browser');
    	}  
    	
    	// Main connection point for everything
    	this.effectChain = this.audioContext.createGainNode();
    	
    	
    	//Reverb
    	this.revNode = this.audioContext.createGainNode();

    	// gain for reverb
    	this.revGain = this.audioContext.createGainNode();
    	this.revGain.gain.value = 0.1;

		// gain for reverb bypass.  Balance between this and the previous = effect mix.
		this.revBypassGain = this.audioContext.createGainNode();

		// overall volume control node
    	this.volNode = this.audioContext.createGainNode();
    	this.volNode.gain.value = 0.25;

    	this.effectChain.connect( this.revNode );
    	this.effectChain.connect( this.revBypassGain );
    	this.revNode.connect( this.revGain );
    	this.revGain.connect( this.volNode );
    	this.revBypassGain.connect( this.volNode );

   	 	// hook it up to the "speakers"
    	this.volNode.connect( this.audioContext.destination );
    
    
    
    	// test oscillator
    	this.source = this.audioContext.createOscillator();
	    this.source.type = 0; // sine wave
	    this.source.envelope = this.audioContext.createGain();
	    this.source.connect(this.source.envelope);
	    this.source.envelope.connect(this.effectChain);
	    
    },
    
    playNote:function(){
	    
	    
	    
	    // This is the "initial patch" of the ADSR settings.  YMMV.
	    var currentEnvA = 1;
	    var currentEnvD = 1;
	    var currentEnvS = .10;
	    var currentEnvR = .10;
	    
	    // set up the volume ADSR envelope
	    var now = this.audioContext.currentTime;
	    var envAttackEnd = now + (currentEnvA/10.0);

	    this.source.envelope.gain.setValueAtTime( 0.0, now );
	    this.source.envelope.gain.linearRampToValueAtTime( 1.0, envAttackEnd );
	    this.source.envelope.gain.setTargetValueAtTime( (currentEnvS/100.0), envAttackEnd, (currentEnvD/100.0)+0.001 );

	    this.source.noteOn(0);
    },
    
    setGlobalMediator:function(mediator){
	  	cc.log("SCLogicComponent setGlobalMediator()");
	  	
	  	if(mediator){
		  	this.globalmediator = mediator;
	  	}  
    },
    
    
        
        
        
        
    update:function (){
	    
	    
    }

});