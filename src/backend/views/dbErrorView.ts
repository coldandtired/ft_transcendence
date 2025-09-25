export function dbErrorView(): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 mb-4 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%ERR_DB%%</div>
	</div>
	`;
}
