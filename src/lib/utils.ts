export function debounce(func: (...args: any[]) => void, wait: number) {
	let timeout: NodeJS.Timeout;

	return (...args: any[]) => {
		const finish = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(finish, wait);
	};
}

export function escapeComparison(str: string) {
	return str.replaceAll("$", "$$").replaceAll("%", "$%").replaceAll("_", "$_");
}
