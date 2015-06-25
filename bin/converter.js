#!/usr/bin/env node

const
  EXIT_ERROR = 1;

var
  path = require('path'),
  converter = require('../lib/converter'),
  execPath;

if (['-h', '--help'].indexOf(process.argv[2]) != -1) {
  execPath = path.relative(process.cwd(), process.argv[1]);
  if (['.', path.sep].indexOf(execPath[0]) == -1) {
    execPath = '.' + path.sep + execPath;
  }

  process.stdout.write('Example: echo "<svg><path d=\\"M0 0l10-10\\" /></svg>" | ' + execPath + ' \n');
  process.exit();
}

var
  svgData = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var
    chunk = process.stdin.read();

  if (chunk !== null) {
    svgData += chunk;
  }
});

process.stdin.on('end', function() {
  var
    boundingBox;

  try {
    boundingBox = converter(svgData);
  }
  catch(e) {
    process.stderr.write(String(e) + '\n');
    process.exit(EXIT_ERROR);
  }

  process.stdout.write(boundingBox.toString() + '\n');
});