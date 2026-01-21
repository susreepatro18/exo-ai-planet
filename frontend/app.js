const API = "http://127.0.0.1:5000";

/* 3D Planet Animation Canvas */
function initiate3DPlanets() {
    const canvas = document.getElementById('planetCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let animationFrame = 0;
    
    class Planet3D {
        constructor(x, y, size, color, speed) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.speed = speed;
            this.rotation = 0;
            this.depth = Math.random() * 100;
        }
        
        update() {
            this.rotation += this.speed;
            this.depth = (this.depth + 0.5) % 100;
        }
        
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Create gradient for planet
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, this.color[0]);
            gradient.addColorStop(1, this.color[1]);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw planet details (stripes, spots)
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
            ctx.stroke();
            
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
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize 3D planets when page loads
document.addEventListener('DOMContentLoaded', initiate3DPlanets);

/* Scroll to specific section */
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
        document.getElementById("resultTable").classList.remove("hidden");
        document.getElementById("status").innerText = data.label;
        document.getElementById("score").innerText = data.score.toFixed(4);
    })
    .catch(() => alert("Prediction failed"));
}

/* Show ranking */
function showRanking() {
    fetch(`${API}/ranking`)
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("rankTable");
        const tbody = table.querySelector("tbody");

        tbody.innerHTML = "";

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

        document.getElementById("rankTable").classList.remove("hidden");
        document.getElementById("closeBtn").classList.remove("hidden");
    })
    .catch(() => alert("Ranking failed"));
}

/* Close ranking */
function closeRanking() {
    document.getElementById("rankTable").classList.add("hidden");
    document.getElementById("closeBtn").classList.add("hidden");
}

