// Sidebar toggle
const sidebar = document.getElementById("sidebar");
const logoToggle = document.getElementById("logoToggle");
const sidebarCloseBtn = document.getElementById("sidebar-close");

function toggleSidebar() {
  sidebar.classList.toggle("expanded");
  sidebar.classList.toggle("collapsed");
  sidebar.setAttribute("aria-hidden", sidebar.classList.contains("collapsed"));
}

logoToggle.addEventListener("click", toggleSidebar);
sidebarCloseBtn.addEventListener("click", toggleSidebar);

// Modal de saída
const btnSair = document.getElementById("btnSair");
const modalSair = document.getElementById("modalSair");
const confirmSair = document.getElementById("confirmSair");
const cancelSair = document.getElementById("cancelSair");

btnSair.addEventListener("click", () => modalSair.classList.remove("hidden"));
cancelSair.addEventListener("click", () => modalSair.classList.add("hidden"));
confirmSair.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "login.html";
});

// Gráfico (corrigido ID)
// Gráfico (com porcentagens dentro)
const ctx = document.getElementById("chartDesempenho");

new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Acertos", "Erros", "Tentativas"],
    datasets: [
      {
        data: [60, 20, 20],
        backgroundColor: ["#73b369", "#e53e3e", "#f59e0b"],
        borderColor: "#fff",
        borderWidth: 3
      }
    ]
  },
  options: {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      },
      // Adiciona o plugin para desenhar o texto
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 16
        },
        formatter: (value, ctx) => {
          const dataArr = ctx.chart.data.datasets[0].data;
          const total = dataArr.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        }
      }
    }
  },
  plugins: [ChartDataLabels] // importante para ativar o plugin
});

