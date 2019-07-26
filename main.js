
const readlib				= require("read");
const read				= function(opts, cb) {
    if ( typeof cb === 'function' )
	return readlib(opts, cb);
    
    return new Promise(function(f,r) {
	readlib(opts, function(err, answer, isDefault) {
	    err
		? r( err )
		: f({ answer, isDefault });
	});
    });
}

/*
  Read options:

  prompt	- What to write to stdout before reading input.
  silent	- Don't echo the output as the user types it.
  replace	- Replace silenced characters with the supplied character value.
  timeout	- Number of ms to wait for user input before giving up.
  default	- The default value if the user enters nothing.
  edit		- Allow the user to edit the default value.
  terminal	- Treat the output as a TTY, whether it is or not.
  input		- Readable stream to get input data from. (default process.stdin)
  output	- Writeable stream to write prompts to. (default: process.stdout)
*/


module.exports = {
    password: async function() {
	const resp			= await read({
    	    prompt: "Password: ",
    	    silent: true,
	});
	return resp.answer;
    },
    confirm: async function( question, defaultAnswer ) {
	let resp;
	let attempts			= 0;
	const answersMap		= {
	    'y': true,
	    'n': false,
	};
	const validAnswers		= Object.keys( answersMap );
	
	if ( defaultAnswer === true )
	    defaultAnswer		= 'y';
	if ( defaultAnswer === false )
	    defaultAnswer		= 'n';
	
	if ( defaultAnswer !== undefined ) {
	    defaultAnswer		= defaultAnswer.toLowerCase();
	    
	    if ( !validAnswers.includes( defaultAnswer )  )
		throw new Error("Default answer is not one of the valid answers: " + defaultAnswer);
	}
	
	const validAnswerString		= '[' + validAnswers.map(a => {
	    return a === defaultAnswer
		? a.toUpperCase()
		: a;
	}).join('/') + ']';
	
	while ( resp === undefined || ! validAnswers.includes( resp.answer.toLowerCase() ) ) {
	    if ( attempts > 10 )
		throw new Error("Failed to answer correctly 10 times...are you sure you can read?");
	    
	    attempts++;
	    resp			= await read({
    		prompt: question + ' ' + validAnswerString,
	    });
	    
	    if ( defaultAnswer !== undefined && resp.answer === '' )
		resp.answer		= defaultAnswer;
	}
	
	return answersMap[ resp.answer ];
    },
};
