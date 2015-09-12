/*
 * grunt-cola-ui-build
 * https://github.com/Cola-Org/grunt-cola-ui-build
 *
 * Copyright (c) 2015 alextong
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path'),
	yaml = require('js-yaml'),
	_ = require('lodash'),
	jade = require('jade');
module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	var yamlSchema = null;
	var strictOption = false;

	function loadYaml(filepath, options) {
		var data = grunt.file.read(filepath, options);

		try {
			return yaml.safeLoad(data, {
				schema: yamlSchema,
				filename: filepath,
				strict: strictOption
			});
		} catch (e) {
			grunt.warn(e);
			return null;
		}
	}

	function createYamlSchema(customTypes) {
		var yamlTypes = [];

		_.each(customTypes, function (resolver, tagAndKindString) {
			var tagAndKind = tagAndKindString.split(/\s+/);

			var yamlType = new yaml.Type(tagAndKind[0], {
				loadKind: tagAndKind[1],
				loadResolver: function (state) {
					var result = resolver.call(this, state.result, loadYaml);

					if (_.isUndefined(result) || _.isFunction(result)) {
						return false;
					} else {
						state.result = result;
						return true;
					}
				}
			});

			yamlTypes.push(yamlType);
		});

		return yaml.Schema.create(yamlTypes);
	}

	grunt.registerMultiTask('yamlToDoc', 'Compile YAML to JSDOC', function () {
		var options = this.options({
			customTypes: {},
			ignored: null,
			space: 2,
			strict: false,
			version: "<VERSION>",
			readEncoding: grunt.file.defaultEncoding,
			writeEncoding: grunt.file.defaultEncoding
		});


		var readOptions = {
			encoding: options.readEncoding
		};

		var SYMBOLS = {};

		yamlSchema = createYamlSchema(options.customTypes);
		strictOption = options.strict;
		function parseClass(obj) {
			if (obj.stereotype === "namespace") {
				var old = SYMBOLS[obj.name] || {};
				SYMBOLS[obj.name] = _.merge(old, obj, function (a, b) {
					if (_.isArray(a)) {
						return a.concat(b);
					}
				});
			} else {
				SYMBOLS[obj.name] = obj;
			}
		}

		function memberOf(obj, name) {
			var member = obj.name;
			_.each(obj[name], function (item) {
				item.memberOf = member
			});
		}

		function unionProps(obj, superObj, name) {
			var items = _.union(obj[name] || [], superObj[name] || []);
			if (name === "methods") {
				_.each(items, function (item) {
					if (!/\)$/.test(item.name)) {
						item.key = item.name;
						var argName = "(", args = item.arguments;
						if (args) {
							for (var i = 0; i < args.length; i++) {
								if (i == 0) {
									argName += args[i].name
								} else {
									argName += "," + args[i].name
								}
							}
						}
						argName += ")";

						item.name = item.name + argName;
					}
				})
			}

			if (name === "events") {
				_.each(items, function (item) {
					if (!item.arguments) {
						item.arguments = [
							{
								"name": "self",
								"label": "组件本身"
							},
							{
								"name": "arg"
							}
						];
					} else {
						if (item.arguments.length == 1) {
							var oldArg = item.arguments[0];
							var argName = oldArg.name;
							if (argName == "self") {
								item.arguments = [oldArg, {
									"name": "arg"
								}]
							} else if (argName == "arg") {
								item.arguments = [{
									"name": "self",
									"label": "组件本身"
								}, oldArg]
							}
						}
					}

				})
			}
			obj[name] = _.uniq(items, "name");
		}


		var classDocElements = ["methods", "events", "attributes"];

		function classExtendHandler(alias) {
			if (alias.super) {
				var superClass = SYMBOLS[alias.super];
				if (!superClass._ignore) {
					classExtendHandler(superClass)
				}
				_.each(classDocElements, function (name) {
					unionProps(alias, superClass, name)
				});
				_.each(superClass, function (value, key) {
					if (_.indexOf(classDocElements, key) > -1 && !alias[key]) {
						alias[key] = value;
					}
				});
			}

			alias._ignore = true

		}

		_.each(this.files, function (filePair) {
			filePair.src.forEach(function (src) {
				if (grunt.file.isDir(src) || (options.ignored && path.basename(src).match(options.ignored))) {
					return;
				}
				var result = loadYaml(src, readOptions);
				if (_.isArray(result)) {
					_.each(result, function (item) {
						parseClass(item)
					})
				} else if (_.isObject(result)) {
					parseClass(result)
				}
			});
		});

		var aliasNames = [];
		_.each(SYMBOLS, function (alias) {
			_.each(classDocElements, function (prop) {
				memberOf(alias, prop);
			});
			aliasNames.push(alias.name);
		});
		_.each(SYMBOLS, function (alias) {
			if (alias.stereotype === "class") {
				if (!alias._ignore) {
					classExtendHandler(alias)
				}
			}
		});
		var dest = path.join(process.cwd(), options.output);
		var tamplate = path.join(__dirname, "..", "templates", "doc.jade");
		var topNames = ["window"];

		aliasNames = aliasNames.sort();
		for (var i = 0; i < topNames.length; i++) {
			var nameItem = topNames[i];
			var index = aliasNames.indexOf(nameItem);
			if (index > -1) {
				aliasNames.splice(index, 1);
				aliasNames.unshift(nameItem);
			}
		}
		_.each(SYMBOLS, function (alias, name) {
				var htmlFile = path.join(dest, name + ".html");
				var tabs = ["attributes", "properties", "methods", "events"];
				for (var i = 0; i < tabs.length; i++) {
					var tabName = tabs[i];
					if (alias[tabName] && alias[tabName].length > 0) {
						alias.activeTab = tabName;
						break;
					}
				}
				var html = jade.renderFile(tamplate, {
					title: name,
					aliasNames: aliasNames,
					alias: alias,
					version: options.version
				});
				grunt.file.write(htmlFile, html);
			}
		)
		;

	});


	grunt.registerMultiTask('cola-ui-clean', '清除cola-ui项目中coffee import信息.', function () {
		// 内部使用默认选项定义处
		var options = this.options({
			punctuation: "",
			separator: "",
			importBegin: '#IMPORT_BEGIN',
			importEnd: "#IMPORT_END",
			license: ""
		});
		this.files.forEach(function (f) {
			var src = f.src.filter(function (filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
				var fileDate = grunt.file.read(filepath);
				var reg = new RegExp(options.importBegin + '[\\w\\W\\s\\S]+?' + options.importEnd, "i");

				fileDate = fileDate.replace(reg, "");

				return fileDate;
			}).join(grunt.util.normalizelf(grunt.util.linefeed + options.separator));
			//编写版权信息和结束语
			src = options.license + src + options.punctuation;
			grunt.file.write(f.dest, src);
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});

	grunt.registerMultiTask('cola-ui-license', '为cola-ui源文件添加版权声明.', function () {
		// 内部使用默认选项定义处
		var options = this.options({
			punctuation: "",
			separator: "",
			license: ""
		});
		this.files.forEach(function (f) {
			var src = f.src.filter(function (filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
				return grunt.file.read(filepath);
			}).join(grunt.util.normalizelf(options.separator));
			//编写版权信息和结束语
			src = options.license + src + options.punctuation;
			grunt.file.write(f.dest, src);
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});


};



