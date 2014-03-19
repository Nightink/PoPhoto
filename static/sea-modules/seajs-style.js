/**
 * The Sea.js plugin for embedding style text in JavaScript code
 */

var RE_NON_WORD = /\W/g
var doc = document
var head = document.getElementsByTagName('head')[0] ||
    document.documentElement
var styleNode

// by Nightink   css image path change  host url
var DIRNAME_RE = /.*(?=\/.*$)/

/**
 * Extracts the directory portion of a path.
 * dirname('a/b/c.js') ==> 'a/b/'
 * dirname('d.js') ==> './'
 * @see http://jsperf.com/regex-vs-split/2
 */
function dirname(path) {
  var s = path.match(DIRNAME_RE)
  return (s ? s[0] : '.') + '/'
}
// end

function isAbsolute(id) {
  return id.indexOf('://') > 0 || id.indexOf('//') === 0
}

seajs.importStyle = function(cssText, id, module) {
  if (id) {
    // Convert id to valid string
    id = id.replace(RE_NON_WORD, '-')

    // Don't add multiple times
    if (doc.getElementById(id)) return
  }

  // by Nightink   css image path change  host url
  var module_origin = module ? module.uri.match(/(http|https):\/\/.+?\//i) : null;
  module_origin = module_origin ? module_origin[0] : null
  if(module_origin && doc.origin !== module_origin) {
    var module_base = dirname(module.uri);
    cssText = cssText.replace(/url\(['"]?(.+?)['"]?\)/igm, function(match, submatch){
      var url = match;
      if(!isAbsolute(submatch)) {
        url = 'url(' + module_base + submatch.slice(1) + ')';
      }
      return url;
    });
  }
  // end

  var element

  // Don't share styleNode when id is spectied
  if (!styleNode || id) {
    element = doc.createElement('style')
    id && (element.id = id)

    // Adds to DOM first to avoid the css hack invalid
    head.appendChild(element)
  } else {
    element = styleNode
  }

  // IE
  if (element.styleSheet) {

    // http://support.microsoft.com/kb/262161
    if (doc.getElementsByTagName('style').length > 31) {
      throw new Error('Exceed the maximal count of style tags in IE')
    }

    element.styleSheet.cssText += cssText
  }
  // W3C
  else {
    element.appendChild(doc.createTextNode(cssText))
  }

  if (!id) {
    styleNode = element
  }
}
