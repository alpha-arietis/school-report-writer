const OPENAI_API_KEY = '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'
// Get the required HTML elements
const exampleReportInput = document.getElementById('exampleReport')
const teacherNotesInput = document.getElementById('teacherNotes')
const surveyAnswersInput = document.getElementById('surveyAnswers')
const formTeacherNotesInput = document.getElementById('formTeacherNotes')
const generateReportButton = document.getElementById('generateReportButton')
const reportOutput = document.getElementById('reportOutput')
const loadingSpinner = document.getElementById('loadingSpinner')

// Function to show the loading spinner
function showLoadingSpinner() {
	loadingSpinner.style.display = 'block'
}

// Function to hide the loading spinner
function hideLoadingSpinner() {
	loadingSpinner.style.display = 'none'
}

// Function to generate the progress report
async function generateReport() {
	showLoadingSpinner()
	// Get the input values
	const exampleReport = exampleReportInput.value
	const teacherNotes = teacherNotesInput.value
	const surveyAnswers = surveyAnswersInput.value
	const formTeacherNotes = formTeacherNotesInput.value

	// Combine the input data
	//const combinedInput = `${teacherNotes}\n${surveyAnswers}\n${formTeacherNotes}`

	const messages = [
		{ role: 'system', content: 'You are a user' },
		{
			role: 'user',
			content: `I am a teacher and need help writing short reports about my student's progress. Here are instructions so you understand style, length and format of writing: "${exampleReport}". Write 150 words report that summarises 3 pieces of data - notes of other teachers about the student: "${teacherNotes}", student's survey answers: "${surveyAnswers}" and form teacher's notes about the student: "${formTeacherNotes}".`,
		},
	]
	// Add a delay of 2 seconds between consecutive API requests
	await new Promise(resolve => setTimeout(resolve, 2000))

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			messages,
			max_tokens: 300,
			temperature: 0.6,
			model: 'gpt-3.5-turbo',
			n: 1,
			stop: 'User:',
		}),
	})

	// Get the response from the API
	const data = await response.json()

	// Extract the generated report from the API response
	const generatedReport = data.choices[0].message.content
	//console.log(generatedReport)
	hideLoadingSpinner()
	// Display the generated report
	renderReport(generatedReport)
}

// Function to render the generated report
function renderReport(report) {
	// Clear previous report output
	reportOutput.innerHTML = ''

	// Create report elements
	// const reportTitle = document.createElement('h2')
	// reportTitle.textContent = 'Progress Report'

	const reportText = document.createElement('p')
	reportText.textContent = report

	// Append report elements to the output
	//reportOutput.appendChild(reportTitle)
	reportOutput.appendChild(reportText)
}

// Attach event listener to the generate report button
generateReportButton.addEventListener('click', generateReport)
