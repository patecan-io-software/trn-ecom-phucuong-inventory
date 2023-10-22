import { ProductColor } from '../../domain'

export const getRandomColor = () => {
	const letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

export const getRandomAlphabetString = (length: number) => {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += letters[Math.floor(Math.random() * letters.length)]
	}
	return result
}

export const getRandomProductColor = (): ProductColor => {
	return {
		label: getRandomAlphabetString(5),
		value: getRandomColor(),
	}
}
