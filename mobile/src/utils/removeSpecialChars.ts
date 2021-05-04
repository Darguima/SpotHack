export default (sentence: string, specialChars = ['|', '\\', '/', '?', '*', '<', '"', ':', '>']) => {
	const finalSentence = [...sentence]

	for (let i = 0; i < finalSentence.length; i++) {
		if (specialChars.includes(finalSentence[i])) {
			finalSentence[i] = ''
		}
	}

	return finalSentence.join('')
}
