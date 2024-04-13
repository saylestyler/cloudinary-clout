# yarg stuff

## document your args like so (maybe output with --help)

```js
#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('This is my awesome program\n\nUsage: $0 [options]')
  .help('help').alias('help', 'h')
  .version('version', '1.0.1').alias('version', 'V')
  .options({
    input: {
      alias: 'i',
      description: "<filename> Input file name",
      requiresArg: true,
      required: true
    },
    output: {
      alias: 'o',
      description: "<filename> output file name",
      requiresArg: true,
      required: true
    }
  })
  .parse();

console.log('Inspecting options');
console.dir(argv);
console.log("input:", argv.input);
console.log("output:", argv.output);
```

```js
var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .command('count', 'Count the lines in a file')
    .example('$0 count -f foo.js', 'count the lines in the given file')
    .alias('f', 'file')
    .nargs('f', 1)
    .describe('f', 'Load a file')
    .demandOption(['f'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2019')
    .parse();

var fs = require('fs');
var s = fs.createReadStream(argv.file);

var lines = 0;
s.on('data', function (buf) {
    lines += buf.toString().match(/\n/g).length;
});

s.on('end', function () {
    console.log(lines);
});
```
