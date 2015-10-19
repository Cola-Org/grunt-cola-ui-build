'use strict';

path = require 'path'
yaml = require 'js-yaml'
_ = require 'lodash'
jade = require 'jade'
module.exports = (grunt)->
	yamlSchema = null
	strictOption = false
	loadYaml = (filepath, options)->
		data = grunt.file.read(filepath, options)
		try
			return yaml.safeLoad(data, {
				schema: yamlSchema
				filename: filepath
				strict: strictOption
			})
		catch e
			grunt.warn(e)
			return null
	createYamlSchema = (customTypes)->
		yamlTypes = []
		_.each(customTypes, (resolver, tagAndKindString)->
			tagAndKind = tagAndKindString.split(/\s+/)
			yamlType = new yaml.Type(tagAndKind[0], {
				loadKind: tagAndKind[1]
				loadResolver: (state)->
					result = resolver.call(@, state.result, loadYaml)
					if _.isUndefined(result) || _.isFunction(result) then return false
					state.result = result
					return true
			})
			yamlTypes.push(yamlType)
		)
		return yaml.Schema.create(yamlTypes)
	grunt.registerMultiTask('yamlToDoc', 'Compile YAML to JSDOC', ()->
		options = @options({
			customTypes: {}
			ignored: null
			space: 2
			strict: false
			header: "Cola UI API-<VERSION>"
			version: "<VERSION>"
			readEncoding: grunt.file.defaultEncoding
			writeEncoding: grunt.file.defaultEncoding
		})
		readOptions =
			encoding: options.readEncoding
		SYMBOLS = {}
		yamlSchema = createYamlSchema(options.customTypes)
		strictOption = options.strict
		parseClass = (klass)->
			if klass.stereotype == "namespace"
				oldSYMBOL = SYMBOLS[klass.name]
				if oldSYMBOL
					SYMBOLS[klass.name] = _.merge(oldSYMBOL, klass, (a, b)->
						if _.isArray(a) then return a.concat(b)
					)
			else
				SYMBOLS[klass.name] = klass
			return
		memberOf = (klass, propName)->
			klassName = klass.name
			for item in klass[propName]
				item.memberOf = klassName
		unionProps = (klass, superKlass, propName)->
			items = _.union(klass[propName] || [], superKlass[propName] || [])
			if propName is "methods"
				for item in items
					unless /\)$/.test(item.name)
						item.key = item.name()
						argName = "("
						args = item.arguments
						argNames = []
						if args
							argNames.push(arg.name) for arg in args
							argName += argNames.join(",")
						argName += ")"
						item.name = item.name + argName
			else if propName is "events"
				for item in items
					args = item.arguments
					if args
						if args.length == 1
							oldArg = args[0]
							argName = oldArg.name
							if argName is "self"
								item.arguments = [oldArg, {name: "arg"}]
							else if argName is "arg"
								item.arguments = [{name: "self", label: "组件本身"}, oldArg]
					else
						item.arguments = [
							{
								name: "self"
								label: "组件本身"
							}
							{
								name: "arg"
							}
						]
				klass.events = _.uniq(items, "name")

		jsDocElements = ["methods", "events", "attributes"]
		extendHandler = (klass)->
			if klass.super
				superKlass = SYMBOLS[klass.super]
				unless  superKlass._ignore then extendHandler(superKlass)
				for name in jsDocElements
					unionProps(klass, superKlass, name)
			klass._ignore = true

		_.each(@files, (filePair)->
			filePair.src.forEach((src)->
				return if grunt.file.isDir(src) || (options.ignored && path.basename(src).match(options.ignored))
				result = loadYaml(src, readOptions)
				if result instanceof Array
					parseClass(item) for item in result
				else if typeof result == "object"
					parseClass(result)
			)
		)

		klassNames = []
		for name,klass of SYMBOLS
			for propName in jsDocElements
				memberOf(klass, propName)
			klassNames.push(klass.name)
		for name,klass of SYMBOLS
			if klass.stereotype is "class" and not alias._ignore
				extendHandler(klass)

		dest = path.join(process.cwd(), options.output)
		template = path.join(__dirname, "..", "templates", "doc.jade")
		topNames = ["window"]
		klassNames = klassNames.sort()
		for topName in topNames
			index = klassNames.indexOf(topName)
			if index > -1
				klassNames.splice(index, 1)
				klassNames.unshift(topName)
		tabs = ["attributes", "properties", "methods", "events"]
		for name,klass of SYMBOLS
			htmlFile = path.join(dest, "#{name}.html")
			for tabName in tabs
				if alias[tabName]?.length > 0
					alias.activeTab = tabName
					break

	)

