'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
var path = _interopDefault(require('path'));
var theoModule = _interopDefault(require('theo'));

theoModule.registerFormat('custom-values.css', "{{#each props as |prop|}}\n  {{#if prop.comment~}}\n  {{{trimLeft (indent (comment (trim prop.comment)))}}}\n  {{/if~}}\n@value {{{prop.name}}} {\n\tvalue: {{#eq prop.type \"string\"}}\"{{/eq}}{{{prop.value}}}{{#eq prop.type \"string\"}}\"{{/eq}};\n}\n\t{{/each}}\n");
var isWatching = process.argv.includes('-w') || process.argv.includes('--watch');

function convertTokens(input, output, format) {
  theoModule.convert({
    transform: {
      type: 'web',
      file: input
    },
    format: {
      type: format
    }
  }).then(function (filecontent) {
    fs.ensureDirSync(path.dirname(output));
    fs.writeFile(output, filecontent, function (err) {
      if (err) throw err;
    });
  })["catch"](function (error) {
    return console.log("Something went wrong: ".concat(error));
  });
}

function theo() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!opts.input || !opts.output) {
    if (!opts.output.file || !opts.output.format) {
      throw Error('Input, output and format option must be specified');
    }
  }

  return {
    name: 'theo',
    generateBundle: function generateBundle() {
      convertTokens(opts.input, opts.output.file, opts.output.format);

      if (isWatching) {
        fs.watch(opts.input, {
          recursive: true
        }, function () {
          convertTokens(opts.input, opts.output.file, opts.output.format);
        });
      }
    }
  };
}

module.exports = theo;
