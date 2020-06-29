var fs = require('fs');


let beforeRegex = /__metadata\("[a-z:]+",\s/;
let singleRegex = /[\w\.]+/;
let multipleRegex = /\[((,\s){0,1}[\w\.,]+)+\]/;
let regex = /__metadata\("[a-z:]+",\s((\[((,\s){0,1}[\w\.]+)+\])|([\w\.]+))\)/;

function fixLine(line) {
	let match = beforeRegex.exec(line);
	
	let before = line.substring(0, match.index + match[0].length);
	let after = line.substring(match.index + match[0].length);
	let multiple = multipleRegex.exec(after);
	
	if (multiple) {
		
		
		if (!multiple) {
			throw new Error("Unknown parsing error!");
		}
		let parts = multiple[0].substring(1, multiple[0].length - 1).split(",");
		for (let key in parts) {
			parts[key] = "function(){return " + parts[key] + ";}";
		}
		let res = before + "[";
		
		for (let i = 0;i < parts.length;i++) {
			if (i === 0) {
				res += parts[i];
			} else {
				res += ", " + parts[i];
			}
		}
		res += "])";
		return res;
	} else {
		let single = singleRegex.exec(after);
		return before + "function(){return " + single[0] + ";})";
	} 
}

function fixMetadata(content) {
	
	return fix(regex, content, fixLine);
}

function fix(regex, content, fixer, single = false) {
	let match;
	
	match = regex.exec(content);
	if (match) {

		let before = content.substring(0, match.index);
		let toFix = content.substring(match.index, match.index + match[0].length);
		let after;
		if (single) {
			after = content.substring(match.index + match[0].length);
		} else {
			after = fix(regex, content.substring(match.index + match[0].length), fixer);
		}
		
		return before + fixer(toFix) + after;
	} else {
		return content;
	}
}


function fixIntercepts(content) {
	return fix(/core_1\.Intercept\(\s*\w+(\s*,\s*\w+)*\s*\)/, content, function(toFix) {
		return toFix.substring(0, 17) + fix(/\w+/, toFix.substring(17, toFix.length - 1) + ")", function(className) {
			return "function(){return " + className + ";}";
		});
	});
}
function fixControls(content) {
	return fix(/core_1\.Control\(\s*\w+\s*\)/, content, function(toFix) {
		return "core_1.Control(function() {return " + toFix.substring(15, toFix.length - 1) + ";})";
	});
}

function processFile(filePath) {
	
	if (!filePath.endsWith(".js")) {
		return;
	}
	fs.readFile(filePath, 'utf-8', function(err, content) {
		if (err) {
			throw err;
			return;
		}
		let fixed = fixMetadata(content);
		fixed = fixIntercepts(fixed);
		fixed = fixControls(fixed);
		
		fs.writeFile(filePath, fixed, function(err) {
			if(err) {
				throw err;
			}
		}); 

	});
	
}

function readFiles(dirname) {
	fs.readdir(dirname, function(err, filenames) {
		if (err) {
			throw err;
			return;
		}
		filenames.forEach(function(filename) {
			if (fs.lstatSync(dirname + "/" + filename).isDirectory()) {
				readFiles(dirname + "/" + filename);
			} else {
				processFile(dirname + "/" + filename);
			}
		});
	});
}

if (process.argv.length !== 3) {
	throw new Error("Invalid command line arguments!");
}

readFiles(process.argv[2]);

