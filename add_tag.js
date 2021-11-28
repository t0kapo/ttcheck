const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const jquery = require("jquery");
const fs = require("fs");
const beautify_html = require("js-beautify").html;

//GitHub Actions用のToolkit
const core = require('@actions/core');
const github = require('@actions/github');

//オーバーヘッド(処理時間)の計測用
const { performance } = require('perf_hooks');

try {
	const starttime = performance.now(); //計測開始

	//assign html file and policy javascript(japanese:HTMLファイルとJSファイルの中身を変数へ格納)
	var file_html = String(core.getInput('html-file-path'));
	var file_js = String(core.getInput('js-policy-file-path'));
	let html = fs.readFileSync(file_html,"utf8");
	let jscript = fs.readFileSync(file_js,"utf8");

	//change html using dom operation(jQuery) (japanese: 取得したHTMLをjsdomでDOMツリーにして、jQueryでDOM操作を行えるようにする)
	var dom = new JSDOM(html);
	const $ = jquery(dom.window);

	if ($('meta[http-equiv="Content-Security-Policy"]').length){    //Trusted Types有効化用のmetaタグ(CSPヘッダ用)がある場合
		var check = String($('meta[http-equiv="Content-Security-Policy"]').attr("content"));

		const words = jscript.split(' ');
		const policy_name = words[1];
		const str_check =  new RegExp(policy_name);

		if (str_check.test(check) ==  true){		//既に指定したポリシーがある場合
			console.log("The policy '"+ policy_name + "' already exists!!");									//何もしない 
		}else{
			console.log("add new policy!");

			$('meta[http-equiv="Content-Security-Policy"]').attr("content", function(index, val){ //新しいポリシーの場合、新しいポリシー名とポリシーを追加する
				return val + ' ' + policy_name;
			});
			$("body").prepend('<script id="trusted_types">' + jscript + '</script>');
		}
	}else{
		console.log("Activate Trusted Types and add new policy!!");

		const words = jscript.split(' ');
		const policy_name = words[1];

		$("head").append('<meta http-equiv="Content-Security-Policy" content="require-trusted-types-for \'script\';  trusted-types ' + policy_name +'">');
		$("body").prepend('<script id="trusted_types">' + jscript + '</script>');
	}
	
	var change_dom = dom.serialize();
	//make code beautiful
	var code_beautifier = beautify_html(change_dom);
	//overwrite html file
	fs.writeFile(file_html, code_beautifier, (err) => {
		if (err) {
			throw err;
			console.log('Failed to overwrite the file "' + file_html + '".');
		}else{
			console.log('File overwrite successful!');
		}
	});

	const endtime = performance.now(); //計測終了
	const time = endtime - starttime;
	core.setOutput("time", time);
} catch (error) {
	core.setFailed(error.message);
}
