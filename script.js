const cities = [
    { name: "Seoul", timeZone: "Asia/Seoul" },
    { name: "New York", timeZone: "America/New_York" },
    { name: "London", timeZone: "Europe/London" }
];

let customTimes = JSON.parse(localStorage.getItem('customTimes')) || []; // 로컬 스토리지에서 데이터 불러오기

function drawAnalogClock(canvas, time) {
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.translate(radius, radius);

    // Draw the clock face
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.9, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1e1e';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw the hands
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / 360;
    const minuteAngle = (minutes * Math.PI) / 30;
    const secondAngle = (seconds * Math.PI) / 30;

    // Hour hand
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(hourAngle);
    ctx.lineTo(0, -radius * 0.5);
    ctx.stroke();
    ctx.rotate(-hourAngle);

    // Minute hand
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(minuteAngle);
    ctx.lineTo(0, -radius * 0.7);
    ctx.stroke();
    ctx.rotate(-minuteAngle);

    // Second hand
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(secondAngle);
    ctx.lineTo(0, -radius * 0.9);
    ctx.stroke();
    ctx.rotate(-secondAngle);
    ctx.translate(-radius, -radius);
}

function updateClocks() {
    const container = document.getElementById('clock-container');
    container.innerHTML = '';

    // 기본 도시 업데이트
    cities.forEach(city => {
        const localTime = new Date().toLocaleString("en-US", { timeZone: city.timeZone });
        const cityTime = new Date(localTime);

        const div = document.createElement('div');
        div.className = 'city';
        div.innerHTML = `  
            <h2>${city.name}</h2>
            <p>${cityTime.toLocaleTimeString()}</p>
            <p>${cityTime.toLocaleDateString()}</p>
            <canvas width="150" height="150"></canvas>
        `;
        container.appendChild(div);

        const canvas = div.querySelector('canvas');
        drawAnalogClock(canvas, cityTime);
    });

    // 커스텀 시간 업데이트
    customTimes.forEach((custom, index) => {
        const customTime = new Date(custom.time);
        customTime.setSeconds(customTime.getSeconds() + 1); // 시간 증가
        custom.time = customTime.toISOString();

        const div = document.createElement('div');
        div.className = 'city';
        div.innerHTML = `  
            <h2>${custom.name}</h2>
            <p>${customTime.toLocaleTimeString()}</p>
            <p>${customTime.toLocaleDateString()}</p>
            <canvas width="150" height="150"></canvas>
            <button onclick="deleteCustomTime(${index})">Delete</button>
        `;
        container.appendChild(div);

        const canvas = div.querySelector('canvas');
        drawAnalogClock(canvas, customTime);
    });
}

function openCustomTimeModal() {
    const modal = document.getElementById('custom-time-modal');
    modal.style.display = "block";
}

function closeCustomTimeModal() {
    const modal = document.getElementById('custom-time-modal');
    modal.style.display = "none";
}

function addCustomTime() {
    const customName = document.getElementById('custom-name').value;
    const customDateTime = document.getElementById('custom-datetime').value;

    if (customName && customDateTime) {
        const parsedTime = new Date(customDateTime);
        if (!isNaN(parsedTime.getTime())) {
            customTimes.push({ name: customName, time: parsedTime.toISOString() });
            localStorage.setItem('customTimes', JSON.stringify(customTimes)); // 로컬 스토리지에 저장
            updateClocks();
            closeCustomTimeModal();
        } else {
            alert("Invalid date and time format.");
        }
    } else {
        alert("Both name and date/time are required.");
    }
}

function deleteCustomTime(index) {
    customTimes.splice(index, 1);
    localStorage.setItem('customTimes', JSON.stringify(customTimes)); // 삭제된 후 로컬 스토리지에 저장
    updateClocks();
}

document.getElementById('custom-time').addEventListener('click', openCustomTimeModal);
document.getElementById('save-custom-time').addEventListener('click', addCustomTime);
document.getElementsByClassName('close-btn')[0].addEventListener('click', closeCustomTimeModal);

// 초기 시계 업데이트
updateClocks();
setInterval(updateClocks, 1000);
