document
	.getElementById('wifi-form')
	.addEventListener('submit', function (event) {
		event.preventDefault()

		const ssid = document.getElementById('ssid').value
		const password = document.getElementById('password').value
		const encryption = document.getElementById('encryption').value

		let qrData = `WIFI:T:${encryption};S:${ssid};P:${password};;`

		if (encryption === 'nopass') {
			qrData = `WIFI:T:nopass;S:${ssid};;`
		}

		// Очистить предыдущий QR-код
		const container = document.getElementById('qrcode-container')
		container.innerHTML = ''

		// Создать новый QR-код в формате SVG
		const qrCode = new QRCode(container, {
			text: qrData,
			width: 350,
			height: 350,
			useSVG: true,
			correctLevel: QRCode.CorrectLevel.H,
		})

		// Добавляем наблюдатель за изменением DOM, чтобы отследить момент появления SVG
		const observer = new MutationObserver(() => {
			const svgElement = container.querySelector('svg')
			if (svgElement) {
				// Отключаем наблюдатель, когда SVG найден
				observer.disconnect()

				// Создаем кнопку для сохранения SVG
				const saveButton = document.createElement('button')
				saveButton.textContent = 'Save as SVG'
				saveButton.addEventListener('click', function () {
					const serializer = new XMLSerializer()
					const source = serializer.serializeToString(svgElement)

					const svgBlob = new Blob([source], {
						type: 'image/svg+xml;charset=utf-8',
					})
					const url = URL.createObjectURL(svgBlob)
					const downloadLink = document.createElement('a')
					downloadLink.href = url
					downloadLink.download = 'qrcode.svg'
					document.body.appendChild(downloadLink)
					downloadLink.click()
					document.body.removeChild(downloadLink)
					URL.revokeObjectURL(url)
				})

				// Добавляем кнопку в контейнер

				container.appendChild(saveButton)
			}
		})

		// Запуск наблюдателя за контейнером
		observer.observe(container, { childList: true, subtree: true })
	})
