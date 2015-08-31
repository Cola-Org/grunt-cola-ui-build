$(".menu .item").tab();
var jsBeautifyOptions = {
	space_before_conditional: true,
	keep_array_indentation: false,
	preserve_newlines: true,
	unescape_strings: true,
	jslint_happy: false,
	brace_style: "end-expand",
	indent_char: " ",
	indent_size: 4
};
$(".description>code").each(function () {
	var $dom = $(this);
	var html = $dom.html();
	$dom.addClass("prettyprint")
	var pre = document.createElement("pre");
	var code = js_beautify(html.toString(), jsBeautifyOptions);
	$dom.text(code)
});
$("#searchInput").on("input", function () {
	var value = this.value.toLowerCase();
	$("#sidebar> .ui.list>a.item").each(function () {
		var $dom=$(this);
		var state=$dom.text().toLowerCase().indexOf(value) > -1;
		$dom.toggleClass("hidden", !state);
	})
});

prettyPrint();