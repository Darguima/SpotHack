export default (miliseconds: number) => {
	const totalSeconds = ~~(miliseconds / 1000)

	const totalMinutes = ~~(totalSeconds / 60)

	const seconds = (totalSeconds - 60 * totalMinutes)

	const totalHours = ~~(totalMinutes / 60)

	const minutes = (totalMinutes - 60 * totalHours)

	return { seconds: seconds, minutes: minutes, hours: totalHours }
}
