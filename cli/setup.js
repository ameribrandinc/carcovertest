'use strict';

var shell = require('shelljs');

module.exports = function() {
	shell.exec('cp git-hooks/* .git/hooks/');
	shell.exec('chmod +x .git/hooks/pre-commit');
};