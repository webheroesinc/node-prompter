
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
};
