/**
 * `tasks/config/clean`
 *
 * ---------------------------------------------------------------
 *
 * Remove generated files and folders.
 *
 * For more information, see:
 *   https://sailsjs.com/anatomy/tasks/config/clean.js
 *
 */
module.exports = function(grunt) {

  grunt.config.set('clean', {
      dev: [
        getFolderPath('fonts/**'),
        getFolderPath('images/**'),
        getFolderPath('dependencies/**'),
		    getFolderPath('icons/**'),
        getFolderPath('plugins/**'),
		    getFolderPath('min/**'),
        getFolderPath('js/**'),
        getFolderPath('styles/**'),
        getFolderPath('*.*')
      ],
    build: ['www'],
    afterBuildProd: [
      'www/concat',
      'www/min',
      'www/hash',
      'www/js',
      'www/styles',
      'www/templates',
      'www/dependencies'
    ]
  });
  
	function getFolderPath(folderName){
	  return '.tmp/public/' + folderName;
	}
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // This Grunt plugin is part of the default asset pipeline in Sails,
  // so it's already been automatically loaded for you at this point.
  //
  // Of course, you can always remove this Grunt plugin altogether by
  // deleting this file.  But check this out: you can also use your
  // _own_ custom version of this Grunt plugin.
  //
  // Here's how:
  //
  // 1. Install it as a local dependency of your Sails app:
  //    ```
  //    $ npm install grunt-contrib-clean --save-dev --save-exact
  //    ```
  //
  //
  // 2. Then uncomment the following code:
  //
  // ```
  // // Load Grunt plugin from the node_modules/ folder.
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // ```
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

};
