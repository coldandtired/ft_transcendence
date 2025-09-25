import { navbarView } from "./navbarView.js";
import { translate } from "../../common/translations.js";
import { FrameParams } from "../../common/interfaces.js";

/*
	Returns the whole page, or an error page
*/
export function frameView(params: FrameParams, chatsWaiting: boolean, content: string = null): any {
	if (!content)
		content = errorString(params);

	const text = frameString(navbarView(params, chatsWaiting), content);
	return translate(params.language, text)
}

function frameString(navbar: string, content: string): string {
	return `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8" />
			<link rel="icon" type="image/x-icon" href="/images/favicon.ico">
			<script type="module" src="/js/index.js"></script>
			<link href="/css/styles.css" rel="stylesheet">
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">
			<title>Transcendence</title>
		</head>

		<body>
			<div class="h-screen w-screen bg-[url(/images/bg.png)] bg-cover bg-center flex flex-col">
				${navbar}
				<div class="w-200 mx-auto grow">
					<div id="content" class="grow font-mono">${content}</div>
				</div>
			</div>
		</body>
	</html>
	`;
}

/*
	A frame with an error message body
*/
function errorString(params: FrameParams) {
	return `
	<div class="flex flex-col items-center">
		<div class="text-gray-300 mt-8 mb-4 text-center text-3xl mx-auto rounded-lg border bg-stone-700 border-gray-900 px-3 py-1">%%${params.result}%%</div>
	</div>
	`;
}
