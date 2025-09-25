export function homeView(rotate: boolean): string {
	const rotateDegrees = rotate? "rotate-180" : "";
	return `
	<div class="flex flex-col items-center gap-4 ${rotateDegrees}">
		<div class="text-gray-300 mt-8 mb-4 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_WELCOME%%</div>
		<div>
			<img class="w-80 h-80 opacity-80 border-fuchsia-800 border rounded-lg" src="/images/team.jpg"/>
			<div class="text-gray-300 mt-1 text-center">%%TEXT_TEAM%%</div>
		</div>
		<div class="text-gray-300 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_TECH%%</div>
		<div class="flex flex-row gap-2 h-10">
			<img src="/images/babylonjs.png" class="h-10 w-10"/>
			<img src="/images/docker.svg" class="h-10 w-10"/>
			<img src="/images/git.svg" class="h-10 w-10"/>
			<img src="/images/node.png" class="h-10 w-10"/>			
			<img src="/images/nodejs.svg" class="h-10 w-10"/>			
			<img src="/images/npm.svg" class="h-10 w-10"/>
			<img src="/images/sqlite.svg" class="h-10 w-10"/>
			<img src="/images/tailwind.svg" class="h-10 w-10"/>
			<img src="/images/typescript.svg" class="h-10 w-10"/>			
			<img src="/images/vim.svg" class="h-10 w-10"/>
		</div>
	</div>
	`;
}
