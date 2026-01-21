// ✅ Vercel-safe API base (works locally & in production)
const API = window.location.origin;

/* 3D Planet Animation Canvas */
function initiate3DPlanets() {
    const canvas = document.getElementById('planetCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    class Planet3D {
        constructor(x, y, size, color, speed) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.speed = speed;
            this.rotation = 0;
        }
        
        update() {
            this.rotation += this.speed;
        }
        
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, this.color[0]);
            gradient.addColorStop(1, this.color[1]);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    const planets = [
        new Planet3D(canvas.width * 0.2, canvas.height * 0.3, 40, ['#ff6b4a', '#d63a2a'], 0.01),
        new Planet3D(canvas.width * 0.8, canvas.height * 0.5, 30, ['#00d4ff', '#0066cc'], 0.015),
        new Planet3D(canvas.width * 0.5, canvas.height * 0.8, 35, ['#b8860b', '#654321'], 0.008),
    ];
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        planets.forEach(planet => {
            planet.update();
            planet.draw(ctx);
        });
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

document.addEventListener('DOMContentLoaded', initiate3DPlanets);

/* Scroll to section */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/* Collect input data */
function getInputData() {
    return {
        pl_rade: parseFloat(document.getElementById("pl_rade").value),
        pl_bmasse: parseFloat(document.getElementById("pl_bmasse").value),
        pl_eqt: parseFloat(document.getElementById("pl_eqt").value),
        pl_density: parseFloat(document.getElementById("pl_density").value),
        pl_orbper: parseFloat(document.getElementById("pl_orbper").value),
        pl_orbsmax: parseFloat(document.getElementById("pl_orbsmax").value),
        st_luminosity: parseFloat(document.getElementById("st_luminosity").value),
        pl_insol: parseFloat(document.getElementById("pl_insol").value),
        st_teff: parseFloat(document.getElementById("st_teff").value),
        st_mass: parseFloat(document.getElementById("st_mass").value),
        st_rad: parseFloat(document.getElementById("st_rad").value),
        st_met: parseFloat(document.getElementById("st_met").value)
    };
}

/* Prediction */
function predict() {
    fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getInputData())
    })
    .then(res => res.json())
    .then(data => {
        if (!data || data.error) {
            alert("Prediction failed");
            return;
        }
        document.getElementById("resultTable").classList.remove("hidden");
        document.getElementById("status").innerText = data.label;
        document.getElementById("score").innerText = data.score.toFixed(4);
    })
    .catch(err => {
        console.error(err);
        alert("Prediction failed");
    });
}

/* Show ranking */
function showRanking() {
    fetch(`${API}/ranking`)
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("rankTable");
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='14'>No rankings available yet.</td></tr>";
        } else {
            data.forEach((row, i) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${row.pl_rade}</td>
                        <td>${row.pl_bmasse}</td>
                        <td>${row.pl_eqt}</td>
                        <td>${row.pl_density}</td>
                        <td>${row.pl_orbper}</td>
                        <td>${row.pl_orbsmax}</td>
                        <td>${row.st_luminosity}</td>
                        <td>${row.pl_insol}</td>
                        <td>${row.st_teff}</td>
                        <td>${row.st_mass}</td>
                        <td>${row.st_rad}</td>
                        <td>${row.st_met}</td>
                        <td>${row.score.toFixed(4)}</td>
                    </tr>
                `;
            });
        }

        table.classList.remove("hidden");
        document.getElementById("closeBtn").classList.remove("hidden");
    })
    .catch(err => {
        console.error(err);
        alert("Ranking failed");
    });
}

/* Close ranking */
function closeRanking() {
    document.getElementById("rankTable").classList.add("hidden");
    document.getElementById("closeBtn").classList.add("hidden");
}
