#!/usr/bin/env node

var program = require('commander');
var shell = require('shelljs');

program
	.version('0.0.1');

program
	.command('setup')
	.description('Setup the project')
	.action(function(cmd, options) {
		require('./cli/setup')(cmd, options);
	});

program
	.command('update')
	.description('Update the custom_covers table with DCI files')
	.option('-f, --file <file>', 'Path to CSV file with updates (relative to cwd)')
	.option('--verbose', 'Run script in verbose mode')
	.action(function(cmd, options) {
		require('./cli/update')(cmd, options);
	});

program
	.command('update-local-mysql')
	.description('Update local mysql database from the .sql files in the project')
	.action(function() {
		if (shell.exec('sh ./cli/update-local-db.sh').code !== 0) {
			console.error('Error: Update failed');
			process.exit(1);
		}
		console.log('We\'re all green here. Enjoy the rest of your day.  : )');
	});

if (!process.argv.slice(2).length) {
	program.outputHelp();
}

program.parse(process.argv);
