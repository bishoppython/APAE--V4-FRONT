const btn = document.getElementById("entrarBtn");

btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const cpf = document.querySelector('input[placeholder*="CPF"]').value.trim();
  const senha = document.querySelector('input[placeholder*="senha"]').value;

  if (!cpf || !senha) { alert("Preencha CPF e senha"); return; }

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf, senha })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "CPF ou senha incorretos!");
      return;
    }

    localStorage.setItem("token", data.token);
    sessionStorage.setItem("usuarioNome", data.nome);

    window.location.href = "/dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar ao servidor.");
  }
});
